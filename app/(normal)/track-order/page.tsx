"use client";

import { useState } from "react";
import { getOrderByOrderId } from "@/helper/order/action";
import OrderReceived from "@/components/OrderReceived";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkOrderHandler = async () => {
    if (!orderId.trim()) {
      setError("Please enter your order ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await getOrderByOrderId(orderId.trim());

      if (!response.success || !response.order) {
        setError("Order not found. Please check your order ID.");
        return;
      }

      setOrder(response.order);
    } catch (error) {
      console.error("Order tracking error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <div className="mb-8 space-y-3 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <PackageSearch className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Track Your Order
        </h1>

        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          Enter your order ID below to check your order status, delivery
          progress, and other important details.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter your order ID"
          className="h-11 w-full rounded-lg border px-4 outline-none focus:ring-2 focus:ring-primary"
        />

        <Button
          onClick={checkOrderHandler}
          disabled={loading}
          className="h-11 inline-flex rounded-lg bg-primary px-6 font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Checking..." : "Check Your Order"}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {order && <OrderReceived order={order} />}
    </div>
  );
}
