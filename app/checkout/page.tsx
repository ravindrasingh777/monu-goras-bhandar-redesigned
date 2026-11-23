"use client";

import { useEffect, useState } from "react";
import { CircleHelp, LockKeyhole } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { coupons, shipmentRates } from "@/data/site";
import { toast } from "@/components/ui/toast";
import PaymentDialog from "@/components/PaymentDialog";
import { createOrder } from "@/helper/order/action";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full h-[58px] rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const [pincode, setPincode] = useState("");
  const [updatesOnEmail, setUpdatesOnEmail] = useState(false);

  const [filteredShippingRates, setFilteredShippingRates] = useState<any>([]);

  const [selectedShipping, setSelectedShipping] = useState<any>(null);

  const [isSearching, setIsSearching] = useState(false);
  const [searchedPincode, setSearchedPincode] = useState("");
  const [billing, setBilling] = useState("same");
  const [appliedCoupon, setAppliedCoupon] = useState<
    (typeof coupons)[number] | null
  >(null);

  const [couponCode, setCouponCode] = useState("");
  const [createdOrder, setCreatedOrder] = useState<any>();
  const [openQrModal, setOpenQrModal] = useState(false);

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.final_price * item.quantity,
    0,
  );

  const totalWeight = cartItems.reduce(
    (total, item) => total + item?.weight * item.quantity,
    0,
  );

  const discountAmount = appliedCoupon?.amount ?? 0;
  const totalAmount = Math.max(0, cartSubtotal - discountAmount);

  const shippingPlateformHandler = async (pin: string) => {
    // const filteredData = shipmentRates.filter((item) => item.pincode === pin);

    try {
      setIsSearching(true);
      // setFilteredShippingRates([]);
      setSearchedPincode(pin);

      const response = await fetch("/api/shipping/serviceability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deliveryPincode: pin,
          weight: totalWeight,
          cod: false,
          length: 20,
          breadth: 15,
          height: 10,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message);
      }

      console.log("result", result);
      setFilteredShippingRates(result?.couriers);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Unable to check delivery");
    } finally {
      setIsSearching(false);
      setSelectedShipping(null);
    }

    // setFilteredShippingRates(filteredData);
    // setSearchedPincode(pin);
  };

  useEffect(() => {
    if (pincode.length !== 6) return;

    const debounce = setTimeout(() => {
      shippingPlateformHandler(pincode);
    }, 500);

    return () => clearTimeout(debounce);
  }, [pincode]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  const paymentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const shippingData = {
      country: formData.get("country"),
      firstName: formData.get("first_name"),
      lastName: formData.get("last_name"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      phone: formData.get("phone"),
    };

    // Handle different billing details
    const billingData = {
      country: formData.get("billing_country"),
      firstName: formData.get("billing_first_name"),
      lastName: formData.get("billing_last_name"),
      address: formData.get("billing_address"),
      city: formData.get("billing_city"),
      state: formData.get("billing_state"),
      phone: formData.get("billing_phone"),
    };

    const data = {
      shipping: shippingData,
      billing: billing === "different" ? billingData : null,
      cartItems,
      discountAmount: discountAmount,
      couponCode: appliedCoupon?.code || null,
      subtotal: cartSubtotal,
      totalAmount: totalAmount + Number(selectedShipping?.rate || 0),
      updatesOnEmail,
      pincode,
      email: formData.get("email"),
      shippingFee: selectedShipping?.rate || 0,
      shippingPlatformId: selectedShipping?.courier_company_id,
      paymentMethod: "qr_code",
      shippingProvider: selectedShipping?.courier_name,
      expectedDelivery: selectedShipping?.etd,
    };
    console.log("checkout data", data);

    const response = await createOrder(data);
    if (response?.success) {
      setOpenQrModal(true);
      setCreatedOrder(response?.order);
    }
  };

  const couponHandler = (code: string) => {
    const coupon = coupons.find((c) => c.code === code.trim().toUpperCase());

    if (!coupon) {
      toast.add({
        title: "Invalid Coupon",
        description: "Please enter a valid coupon code.",
        type: "error",
      });
      return;
    }

    if (appliedCoupon?.code === coupon.code) {
      toast.add({
        title: "Already Applied",
        description: "This coupon is already applied.",
        type: "error",
      });
      return;
    }

    setAppliedCoupon(coupon);

    toast.add({
      title: "Coupon Applied",
      description: `${coupon.code} applied successfully!`,
      type: "success",
    });
  };

  return (
    <>
      {
        <PaymentDialog
          open={openQrModal}
          onOpenChange={setOpenQrModal}
          orderId={createdOrder?.id}
          amount={createdOrder?.totalAmount}
          upiId="9887700428-2@ibl"
          merchantName="Monu Goras Bhandar"
        />
      }
      <div className="flex w-full h-full flex-col md:flex-row  bg-white ">
        {/* LEFT SIDE - SCROLLABLE CHECKOUT FORM */}
        <main className="w-full px-4 py-8 sm:px-8  md:h-screen md:w-1/2 md:overflow-y-auto md:px-8 lg:px-12">
          <div className="mx-auto max-w-[676px]">
            <form
              onSubmit={paymentHandler}
              action=""
              id="checkout-form"
              className="mb-10"
            >
              {/* Contact */}
              <div className="mb-10">
                <Button type="button" onClick={() => router.push("/our-products")}>
                  Back
                </Button>
                <div className="my-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Contact</h2>
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address"
                  className={inputClass}
                />

                <label className="mt-4 flex items-center gap-3 text-sm">
                  <input
                    onChange={(e) => setUpdatesOnEmail(e.target.checked)}
                    type="checkbox"
                    className="h-5 w-5 accent-blue-600"
                  />
                  Email me regarding my order updates
                </label>
              </div>

              {/* Delivery */}
              <div className="mb-10">
                <h2 className="mb-4 text-2xl font-semibold">
                  Shipping Details
                </h2>

                <div className="mb-3 relative">
                  <label className="absolute left-4 top-2 text-xs text-gray-500">
                    Country/Region
                  </label>
                  <select
                    name="country"
                    className={`${inputClass} bg-blue-50 pt-5`}
                  >
                    <option>India</option>
                  </select>
                </div>

                <div className="mb-3 grid grid-cols-2 gap-3">
                  <input
                    name="first_name"
                    placeholder="First name"
                    className={inputClass}
                  />
                  <input
                    name="last_name"
                    placeholder="Last name"
                    className={inputClass}
                  />
                </div>

                <div className="mb-3">
                  <input
                    name="address"
                    placeholder="Address"
                    className={inputClass}
                  />
                </div>

                <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    name="city"
                    placeholder="City"
                    className={inputClass}
                  />
                  <select name="state" className={inputClass}>
                    <option value="">State</option>
                    <option>Rajasthan</option>
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Gujarat</option>
                  </select>
                  <input
                    placeholder="PIN code"
                    value={pincode}
                    maxLength={6}
                    inputMode="numeric"
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, ""))
                    }
                    className={inputClass}
                  />
                </div>

                <input
                  name="phone"
                  placeholder="Phone"
                  type="tel"
                  className={inputClass}
                />
              </div>

              {/* Shipping Method */}
              <div className="mb-10">
                <h3 className="mb-4 text-xl font-semibold">Shipping Method</h3>

                <div className="overflow-hidden rounded-2xl bg-gray-100">
                  {pincode.length !== 6 ? (
                    <p className="p-5 text-sm text-gray-500">
                      Enter your shipping address with pincode to view available shipping methods.
                    </p>
                  ) : searchedPincode !== pincode ? (
                    <p className="p-5 text-sm text-gray-500">
                      Searching shipping partners...
                    </p>
                  ) : filteredShippingRates.length > 0 ? (
                    filteredShippingRates.map((item: any, index: any) => (
                      <label
                        key={`${item.courier_company_id}-${index}`}
                        className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors ${
                          selectedShipping?.courier_company_id ===
                          item.courier_company_id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={
                              selectedShipping?.courier_company_id ===
                              item.courier_company_id
                            }
                            onChange={() => setSelectedShipping(item)}
                            className="mt-1 h-4 w-4 accent-blue-600"
                          />

                          <div className="min-w-0">
                            <p className="font-semibold text-sm">
                              {item.courier_name}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                              <span>⭐ {item.rating || "N/A"}</span>

                              <span>•</span>

                              <span>
                                {item.estimated_delivery_days} days delivery
                              </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-600">
                              Expected by {item.etd || "Date unavailable"}
                            </p>

                            {/* <div className="mt-2 flex flex-wrap gap-2">
                              {item.cod === 1 && (
                                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                                  COD Available
                                </span>
                              )}

                              {item.realtime_tracking === "Real Time" && (
                                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                  Live Tracking
                                </span>
                              )}
                            </div> */}
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-bold text-sm">
                            {formatPrice(item.rate)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Shipping charge
                          </p>
                        </div>
                      </label>
                    ))
                  ) : (
                    <p className="p-5 text-sm text-red-500">
                      No shipping partners available for this PIN code.
                    </p>
                  )}
                </div>
              </div>

              {/* Billing Address */}
              <div className="mb-10">
                <h3 className="mb-4 text-xl font-semibold">Billing Details</h3>

                <div className="overflow-hidden rounded-2xl border">
                  <label
                    className={`flex cursor-pointer items-center gap-3 border-b p-5 ${
                      billing === "same" ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="billing"
                      checked={billing === "same"}
                      onChange={() => setBilling("same")}
                      className="h-5 w-5 accent-blue-600"
                    />
                    Same as shipping address
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 p-5 ${
                      billing === "different" ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="billing"
                      checked={billing === "different"}
                      onChange={() => setBilling("different")}
                      className="h-5 w-5 accent-blue-600"
                    />
                    Use a different billing details
                  </label>

                  {billing === "different" && (
                    <>
                      <div className="p-2">
                        <div className="mb-3 grid grid-cols-2 gap-3">
                          <input
                            name="billing_first_name"
                            placeholder="First name"
                            className={inputClass}
                          />
                          <input
                            name="billing_last_name"
                            placeholder="Last name"
                            className={inputClass}
                          />
                        </div>
                        <div className="mb-3">
                          <input
                            name="billing_address"
                            placeholder="Address"
                            className={inputClass}
                          />
                        </div>

                        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            name="billing_city"
                            placeholder="City"
                            className={inputClass}
                          />
                          <select name="billing_state" className={inputClass}>
                            <option value="">State</option>
                            <option>Rajasthan</option>
                            <option>Maharashtra</option>
                            <option>Delhi</option>
                            <option>Gujarat</option>
                          </select>
                          {/* <input placeholder="PIN code" className={inputClass} /> */}
                        </div>

                        <input
                          name="billing_phone"
                          placeholder="Phone"
                          type="tel"
                          className={inputClass}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </form>

            {/* Pay Button */}
            <button
              type="submit"
              // id="pay-now-button"
              form="checkout-form"
              disabled={cartItems.length === 0 || !selectedShipping}
              className={`mb-8 w-full hidden sm:block rounded-xl bg-blue-600 py-5 text-lg font-semibold text-white transition hover:bg-blue-700 ${!selectedShipping && "opacity-35"}`}
            >
              Pay With UPI QR Code
            </button>

            <div className="border-t hidden md:block py-5 text-center text-xs text-gray-500">
              All rights reserved.
            </div>
          </div>
        </main>

        {/* RIGHT SIDE - FIXED ORDER SUMMARY */}
        <aside className=" w-full bg-[#f5f5f5] px-4 py-6 sm:px-8  md:right-0  md:w-1/2 md:overflow-y-auto md:border-l md:border-gray-200 md:px-8 lg:px-12">
          <div className="mx-auto max-w-[540px]">
            {/* Cart Items */}
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={item.bannerImage}
                      alt={item.title}
                      className="h-[84px] w-[84px] rounded-2xl border-2 border-white object-cover shadow-sm"
                    />

                    <span className="absolute -right-2 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-black px-2 text-xs font-semibold text-white">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-medium sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">{item.sku}</p>
                  </div>

                  <p className="shrink-0 text-sm font-medium sm:text-base">
                    {formatPrice(item.final_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-8 flex gap-2 rounded-xl border border-gray-300 bg-white p-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Discount code"
                className="min-w-0 flex-1 px-2 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => couponHandler(couponCode)}
                className="rounded-lg border bg-gray-50 px-4 py-3 text-sm font-medium"
              >
                Apply
              </button>
            </div>
            {appliedCoupon && (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-green-600">
                  {appliedCoupon.code} applied
                </span>

                <button
                  type="button"
                  onClick={() => setAppliedCoupon(null)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Price Summary */}
            <div className="mt-12 space-y-4 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>
                  Subtotal ·{" "}
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items
                </span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>- {formatPrice(discountAmount)}</span>
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-2">
                  Shipping
                  <CircleHelp size={17} className="text-gray-500" />
                </span>
                <span>
                  {selectedShipping?.rate
                    ? formatPrice(Number(selectedShipping?.rate || 0))
                    : "Calculated based on delivery location"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t pt-5">
                <span className="text-xl font-semibold">Total</span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">INR</span>
                  <span className="text-xl font-bold">
                    {formatPrice(
                      totalAmount + Number(selectedShipping?.rate || 0),
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 w-full">
              <button
                type="submit"
                // id="pay-now-mobile-button"
                form="checkout-form"
                disabled={cartItems.length === 0 || !selectedShipping || isSearching}
                className={`mb-8 w-full block sm:hidden rounded-xl bg-blue-600 py-5 text-lg font-semibold text-white transition hover:bg-blue-700 ${!selectedShipping && "opacity-35"}`}
              >
                Pay With UPI QR Code
              </button>
              <span className="text-xs text-gray-500">
                It uses UPI apps like BHIM, Paytm, Google Pay, PhonePe or any
                Banking UPI app to make payment.
              </span>

              <div className="hidden md:block py-5 text-center text-xs text-gray-500">
                All rights reserved.
              </div>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 text-xs text-gray-500">
              <LockKeyhole size={14} />
              Secure checkout
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
