"use server";
import { db } from "@/db";
import {
  orderAddresses,
  orderItems,
  orders,
  paymentDetails,
  shippingDetails,
} from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export const createOrder = async (data: any) => {
  return await db.transaction(async (tx) => {
    // 1. Validate required data
    if (!data?.cartItems?.length) {
      throw new Error("Order must contain at least one item.");
    }

    if (!data.paymentMethod) {
      throw new Error("Payment method is required.");
    }

    // 2. Create order
    const [newOrder] = await tx
      .insert(orders)
      .values({
        orderNumber: `ORD-${Date.now()}`,
        email: data.email,
        phone: data.shipping.phone,
        updatesOnEmail: data.updatesOnEmail ?? false,
        subtotal: String(data.subtotal),
        discountAmount: String(data.discountAmount ?? 0),
        shippingFee: String(data.shippingFee ?? 0),
        taxAmount: String(data.taxAmount ?? 0),
        totalAmount: String(data.totalAmount),
        couponCode: data.couponCode || null,
      })
      .returning();

    // 3. Prepare shipping address
    const shippingAddress = {
      orderId: newOrder.id,
      addressType: "shipping" as const,
      country: data.shipping.country,
      firstName: data.shipping.firstName,
      lastName: data.shipping.lastName,
      address: data.shipping.address,
      apartment: data.shipping.apartment ?? null,
      city: data.shipping.city,
      state: data.shipping.state,
      pincode: data.shipping.pincode ?? data.pincode,
      phone: data.shipping.phone,
    };

    // 4. Prepare billing address
    const billingDetails = data.billing ?? data.shipping;

    const billingAddress = {
      orderId: newOrder.id,
      addressType: "billing" as const,
      country: billingDetails.country ?? data.shipping.country,
      firstName: billingDetails.firstName,
      lastName: billingDetails.lastName,
      address: billingDetails.address,
      apartment: billingDetails.apartment ?? null,
      city: billingDetails.city,
      state: billingDetails.state,
      pincode: billingDetails.pincode ?? data.pincode ?? data.shipping.pincode,
      phone: billingDetails.phone ?? data.shipping.phone,
    };

    // 5. Insert shipping and billing addresses
    const createdAddresses = await tx
      .insert(orderAddresses)
      .values([shippingAddress, billingAddress])
      .returning();

    // 6. Prepare order items
    const orderItemsData = data?.cartItems.map((item: any) => ({
      orderId: newOrder.id,

      productId: item.id || null,

      productName: item.title,
      productImage: item.bannerImage || null,
      sku: item.sku || null,

      quantity: Number(item.quantity),

      unitPrice: String(item.price),

      totalPrice: String(Number(item.final_price) * Number(item.quantity)),
    }));

    // 7. Insert order items
    const createdOrderItems = await tx
      .insert(orderItems)
      .values(orderItemsData)
      .returning();

    // 8. Insert payment details
    const [createdPayment] = await tx
      .insert(paymentDetails)
      .values({
        orderId: newOrder.id,

        paymentMethod: data.paymentMethod,

        paymentStatus: "pending",

        amount: String(data.totalAmount),

        transactionId: null,
        paymentImage: null,

        nameOfSender: null,

        paymentVerified: false,
        verifiedBy: null,
        verifiedAt: null,

        paymentGateway: null,
        gatewayPaymentId: null,
      })
      .returning();

    // 9. Insert shipping details
    const [createdShipping] = await tx
      .insert(shippingDetails)
      .values({
        orderId: newOrder.id,

        shippingProvider: data.shippingProvider || null,

        shippingMethod: data.shippingMethod || "Standard",
        // This is courier_company_id
        shippingPlatformId: data.shippingPlatformId,

        trackingNumber: null,
        trackingUrl: null,

        shippingCost: String(data.shippingFee ?? 0),

        shipmentStatus: "pending",

        expectedDelivery: data.expectedDelivery,
        shippedAt: null,
        deliveredAt: null,
      })
      .returning();

    // 10. Return complete order details
    return {
      success: true,

      order: {
        ...newOrder,

        addresses: createdAddresses,

        items: createdOrderItems,

        payment: createdPayment,

        shipping: createdShipping,
      },
    };
  });
};

export const deleteOrder = async (orderId: string) => {
  try {
    const deletedOrder = await db
      .delete(orders)
      .where(eq(orders.id, orderId))
      .returning();

    return {
      success: true,
      data: deletedOrder,
    };
  } catch (error) {
    console.error("Delete order error:", error);

    return {
      success: false,
      message: "Failed to delete order",
    };
  }
};

export const updateOrderDetails = async (data: any) => {
  try {
    const [updatedPayment] = await db
      .update(paymentDetails)
      .set({
        transactionId: data.transactionId,
        paymentImage: data.paymentImage,
        nameOfSender: data.nameOfSender,
        updatedAt: new Date(),
      })
      .where(eq(paymentDetails.orderId, data.orderId))
      .returning();

    if (!updatedPayment) {
      return {
        success: false,
        message: "Payment details not found.",
      };
    }

    return {
      success: true,
      message: "Payment details updated successfully.",
      payment: updatedPayment,
    };
  } catch (error) {
    console.error("Update payment details error:", error);

    return {
      success: false,
      message: "Failed to update payment details.",
    };
  }
};

export const getOrderByOrderId = async (orderId: string) => {
  try {
    if (!orderId) {
      return {
        success: false,
        message: "Order ID is required.",
        order: null,
      };
    }

    // 1. Get main order
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      return {
        success: false,
        message: "Order not found.",
        order: null,
      };
    }

    // 2. Fetch all related order details
    const [addresses, items, payments, shipments] = await Promise.all([
      db
        .select()
        .from(orderAddresses)
        .where(eq(orderAddresses.orderId, order.id)),

      db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),

      db
        .select()
        .from(paymentDetails)
        .where(eq(paymentDetails.orderId, order.id)),

      db
        .select()
        .from(shippingDetails)
        .where(eq(shippingDetails.orderId, order.id)),
    ]);

    // 3. Return complete order
    return {
      success: true,
      message: "Order fetched successfully.",
      order: {
        ...order,

        addresses,

        shippingAddress: addresses.find(
          (address) => address.addressType === "shipping",
        ),

        billingAddress: addresses.find(
          (address) => address.addressType === "billing",
        ),

        items,

        payments,

        payment: payments[0] ?? null,

        shipments,

        shipping: shipments[0] ?? null,
      },
    };
  } catch (error) {
    console.error("Get order details error:", error);

    return {
      success: false,
      message: "Failed to fetch order details.",
      order: null,
    };
  }
};

export const getAllRecentPurchaseOrders = async () => {
  try {
    const recentPurchases = await db
      .select({
        id: orderItems.id,
        orderId: orders.id,

        productName: orderItems.productName,
        image: orderItems.productImage,
        quantity: orderItems.quantity,

        customerName: orderAddresses.firstName,
        lastName: orderAddresses.lastName,
        city: orderAddresses.city,

        createdAt: orders.createdAt,
      })
      .from(orders)
      .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
      .leftJoin(
        orderAddresses,
        and(
          eq(orderAddresses.orderId, orders.id),
          eq(orderAddresses.addressType, "billing"),
        ),
      )
      .orderBy(desc(orders.createdAt))
      .limit(10);

    const items = recentPurchases.map((item) => ({
      id: item.id,
      productName: item.productName,
      image: item.image,
      quantity: item.quantity,
      customerName: `${item.customerName} ${item.lastName || ""}`.trim(),
      city: item.city,
      createdAt: item.createdAt,
    }));

    return {
      success: true,
      message: "Recently purchased orders fetched Successfully.",
      data: items,
    };
  } catch (error) {
    console.error("Error fetching recent purchases:", error);
    throw error;
  }
};
