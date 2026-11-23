
import { getShiprocketToken } from "@/lib/shiprocket";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { deliveryPincode, weight, cod, length, breadth, height } =
      await req.json();

    // Validate input
    if (!/^\d{6}$/.test(String(deliveryPincode))) {
      return NextResponse.json(
        { success: false, message: "Invalid delivery pincode" },
        { status: 400 }
      );
    }

    const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE;

    if (!pickupPincode) {
      throw new Error("Pickup pincode is not configured");
    }

    // 1. Authenticate with Shiprocket
  // Reuse existing token or authenticate if required
    const token = await getShiprocketToken();

    // 2. Check courier serviceability
    const params = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: String(deliveryPincode),
      weight: String(weight),
      cod: cod ? "1" : "0",
      length: String(length),
      breadth: String(breadth),
      height: String(height),
    });

    const courierResponse = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const courierData = await courierResponse.json();

    if (!courierResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          message: courierData.message || "Unable to check courier serviceability",
        },
        { status: courierResponse.status }
      );
    }

    const couriers =
      courierData.data?.available_courier_companies || [];

    return NextResponse.json({
      success: true,
      couriers,
    });

  } catch (error) {
    console.error("Shiprocket Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while checking delivery availability",
      },
      { status: 500 }
    );
  }
}
