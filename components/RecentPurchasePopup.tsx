"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllRecentPurchaseOrders } from "@/helper/order/action";

export default function RecentPurchasePopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any>([]);

  // Fetch recent orders
  useEffect(() => {
    let isMounted = true;

    const fetchRecentOrders = async () => {
      try {
        const response = await getAllRecentPurchaseOrders();

        if (isMounted) {
          setRecentOrders(response?.data || []);
          console.log("response", response);
        }
      } catch (error) {
        console.error("Failed to fetch recent purchases:", error);
      }
    };

    fetchRecentOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const purchase = recentOrders[index];

  // Show popup after 8 seconds
  useEffect(() => {
    if (dismissed || visible || !recentOrders.length) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 8000);

    return () => clearTimeout(showTimer);
  }, [index, dismissed, visible, recentOrders.length]);

  // Hide after 4 seconds and show next order
  useEffect(() => {
    if (!visible || !recentOrders.length) return;

    const hideTimer = setTimeout(() => {
      setVisible(false);

      setIndex((prev) => (prev + 1) % recentOrders.length);
    }, 4000);

    return () => clearTimeout(hideTimer);
  }, [visible, recentOrders.length]);

  if (!purchase || dismissed) return null;

  return (
    <div
      className={`
    fixed bottom-4 left-3 right-3 sm:left-5 sm:right-auto
    z-[9999] w-auto max-w-[410px]
    transition-all duration-500 ease-out
    ${
      visible
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-8 opacity-0"
    }
  `}
      aria-live="polite"
      aria-atomic="true"
    >
      <Card className="relative overflow-hidden rounded-2xl border border-[#e3e8df] bg-[#fbf8f2] text-[#1c2a22] shadow-[0_12px_40px_rgba(28,42,34,0.14)]">
        {/* Top accent line */}
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#A1351B] via-[#d9a441] to-[#A1351B]" />

        <CardContent className="p-3.5 sm:p-4">
          <div className="flex items-start gap-3">
            {/* Product Image */}
            <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl border border-[#e3e8df] bg-white sm:h-[88px] sm:w-[88px]">
              <Image
                src={purchase.image || "/images/placeholder.png"}
                alt={purchase.productName}
                fill
                sizes="88px"
                className="object-contain p-1.5"
              />
            </div>

            {/* Purchase Information */}
            <div className="min-w-0 flex-1 pt-0.5">
              {/* Verified Purchase */}
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#eef2ec]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3 w-3 text-[#477052]"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="m5 12 4 4L19 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-[1.3px] text-[#477052]">
                  Recent Purchase
                </span>
              </div>

              {/* Product Name */}
              <h3 className="line-clamp-2 font-display text-base leading-snug text-[#1c2a22] sm:text-lg">
                {purchase.productName}
              </h3>

              {/* Customer Details */}
              <p className="mt-1.5 text-xs leading-relaxed text-[#5b6b61] sm:text-sm">
                Purchased by{" "}
                <span className="font-semibold text-[#A1351B]">
                  {purchase.customerName}
                </span>
              </p>

              <div className="mt-1 flex items-center gap-1 text-[11px] text-[#5b6b61]">
                <MapPin className="h-3 w-3 text-[#A1351B]" />
                <span>{purchase.city}</span>
              </div>
            </div>

            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setVisible(false);
                setDismissed(true);
              }}
              aria-label="Close purchase notification"
              className="absolute right-2 top-2 h-7 w-7 rounded-full text-[#5b6b61] hover:bg-[#eef2ec] hover:text-[#A1351B]"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          
        </CardContent>
      </Card>
    </div>
  );
}
