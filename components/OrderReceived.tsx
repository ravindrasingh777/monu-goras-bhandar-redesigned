
"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Package,
  MapPin,
  CreditCard,
  Truck,
  CalendarDays,
  ShoppingBag,
  ArrowRight,
  ReceiptText,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  order: any;
}

const formatCurrency = (value: any) =>
  `₹${Number(value ?? 0).toFixed(2)}`;

const formatDate = (value: any) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
    case "delivered":
    case "verified":
      return "bg-green-100 text-green-700 border-green-200";

    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "failed":
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";

    case "shipped":
    case "out_for_delivery":
      return "bg-blue-100 text-blue-700 border-blue-200";

    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const AddressCard = ({
  title,
  address,
}: {
  title: string;
  address: any;
}) => {
  if (!address) return null;

  return (
    <Card className="h-full shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">
          {address.firstName} {address.lastName}
        </p>

        <p>{address.address}</p>

        {address.apartment && <p>{address.apartment}</p>}

        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>

        <p>{address.country}</p>

        <div className="flex items-center gap-2 pt-2 text-foreground">
          <Phone className="h-4 w-4" />
          {address.phone}
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderReceived({ order }: Props) {
  const payment = order.payment;
  const shipping = order.shipping;

  const isPaymentVerified =
    payment?.paymentVerified || payment?.paymentStatus === "paid";

  return (
    <main className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Thank You For Your Order!
          </h1>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your order has been received successfully.
            We will notify you when your order is processed.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              Order #{order.orderNumber}
            </Badge>

            <Badge
              variant="outline"
              className={`px-3 py-1 text-sm capitalize ${getStatusColor(
                payment?.paymentStatus
              )}`}
            >
              Payment: {payment?.paymentStatus || "Pending"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left Section */}
          <div className="space-y-6 lg:col-span-2">

            {/* Order Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ReceiptText className="h-5 w-5 text-blue-600" />
                  Order Information
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order Number
                    </p>
                    <p className="mt-1 font-semibold">
                      {order.orderNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order Date
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Email Address
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium break-all">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {order.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {order.phone}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Ordered Products ({order.items?.length || 0})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="h-20 w-20 rounded-lg border object-cover shrink-0"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-semibold">
                          {item.productName}
                        </h3>

                        {item.sku && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            SKU: {item.sku}
                          </p>
                        )}

                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold sm:text-right">
                      {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <AddressCard
                title="Shipping Address"
                address={order.shippingAddress}
              />

              <AddressCard
                title="Billing Address"
                address={order.billingAddress}
              />
            </div>

            {/* Payment Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Details
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Payment Method
                  </span>
                  <span className="font-semibold capitalize">
                    {payment?.paymentMethod || "Not available"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Payment Status
                  </span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(
                      payment?.paymentStatus
                    )}`}
                  >
                    {payment?.paymentStatus || "Pending"}
                  </Badge>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Transaction ID
                  </span>
                  <span className="font-medium text-right break-all">
                    {payment?.transactionId || "Not submitted"}
                  </span>
                </div>

                {payment?.nameOfSender && (
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Sender Name
                    </span>
                    <span className="font-medium">
                      {payment.nameOfSender}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Verification
                  </span>
                  <Badge
                    variant="outline"
                    className={
                      isPaymentVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {isPaymentVerified ? "Verified" : "Awaiting verification"}
                  </Badge>
                </div>

                {payment?.paymentImage && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Payment Screenshot
                    </p>
                    <a
                      href={payment.paymentImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      View payment screenshot
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  Shipping Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Shipping Provider
                  </span>
                  <span className="font-medium">
                    {shipping?.shippingProvider || "Not assigned"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Shipping Method
                  </span>
                  <span className="font-medium">
                    {shipping?.shippingMethod || "Standard"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Tracking Number
                  </span>
                  <span className="font-medium break-all text-right">
                    {shipping?.trackingNumber || "Not available yet"}
                  </span>
                </div>

                <div className="flex justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Shipment Status
                  </span>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(
                      shipping?.shipmentStatus
                    )}`}
                  >
                    {shipping?.shipmentStatus || "Pending"}
                  </Badge>
                </div>

                {shipping?.expectedDelivery && (
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Expected Delivery
                    </span>
                    <span className="font-medium">
                      {formatDate(shipping.expectedDelivery)}
                    </span>
                  </div>
                )}

                {shipping?.trackingUrl && (
                  <Button variant="outline" className="w-full">
                    <a
                      href={shipping.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Track Your Order
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>
                    <span className="font-medium">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount
                    </span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(order.discountAmount)}
                    </span>
                  </div>

                  {order.couponCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Coupon
                      </span>
                      <Badge variant="secondary">
                        {order.couponCode}
                      </Badge>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Shipping Fee
                    </span>
                    <span className="font-medium">
                      {formatCurrency(order.shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Tax
                    </span>
                    <span className="font-medium">
                      {formatCurrency(order.taxAmount)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>

                  <Separator />

                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                      <Clock className="h-4 w-4" />
                      Order Status
                    </div>

                    <p className="mt-2 text-sm text-blue-600">
                      {isPaymentVerified
                        ? "Your payment has been verified. Your order will be processed soon."
                        : "Your order is received. Payment verification is pending."}
                    </p>
                  </div>

                  <Button size="lg">
                    <Link className="inline-flex items-center justify-center gap-2" href="/our-products">
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
