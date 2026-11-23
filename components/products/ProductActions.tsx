"use client";

import { useState, type ComponentType } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BadgeCheck, Check, Heart, Leaf, Minus, Plus, Share2, ShieldCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Availability, Product } from "../../data/productformat";
import AddToCartButton from "../AddToCartButton";
import Link from "next/link";
import { whatsappLink } from "@/data/site";

type ProductActionsProps = {
  product: Product;
  quantity: number;
  maxQty: number;
  onQuantityChange: (quantity: number) => void;
  availability: Availability;
  added: boolean;
  // onAddToCart: () => void;
  whatsappHref?: any;
};

// Edit these to match your real promises
const TRUST_POINTS: { icon: ComponentType<{ className?: string }>; label: string }[] = [
  { icon: Leaf, label: "Farm fresh" },
  { icon: ShieldCheck, label: "Hygienically packed" },
  { icon: BadgeCheck, label: "Quality checked" },
  { icon: MdOutlineLocalShipping, label: "Delivered across India" },
];

export function ProductActions({
  product,
  quantity,
  maxQty,
  onQuantityChange,
  availability,
  added,
  // onAddToCart,
  whatsappHref,
}: ProductActionsProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const canBuy = availability.purchasable;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // Share sheet closed or clipboard blocked: nothing to do
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-3">
        <div className="flex w-36 shrink-0 items-center justify-between rounded-full border border-input bg-card p-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Decrease quantity"
            disabled={!canBuy || quantity <= 1}
            onClick={() => onQuantityChange(quantity - 1)}
          >
            <Minus />
          </Button>
          <span className="font-semibold tabular-nums" aria-live="polite">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Increase quantity"
            disabled={!canBuy || quantity >= maxQty}
            onClick={() => onQuantityChange(quantity + 1)}
          >
            <Plus />
          </Button>
        </div>

        {/* <Button size="lg" className="h-12 flex-1 rounded-full text-base" disabled={!canBuy} onClick={onAddToCart}>
          {added ? <Check /> : <ShoppingCart />}
          {!canBuy ? "Unavailable" : added ? "Added to cart" : "Add to cart"}
        </Button> */}
        <AddToCartButton product={product} />
      </div>

      <div className="flex gap-3">
        {canBuy  && (
           <Button variant="outline" size="lg" className="h-12 flex-1 text-green-500 border-green-500 rounded-full">
              <Link className="inline-flex items-center justify-center gap-2" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="text-[#25D366]" /> Order on WhatsApp
              </Link>
            </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-full"
          aria-pressed={wishlisted}
          aria-label="Save to wishlist"
          onClick={() => setWishlisted((value) => !value)}
        >
          <Heart className={wishlisted ? "fill-primary text-primary" : undefined} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-12 rounded-full"
          aria-label="Share product"
          onClick={handleShare}
        >
          <Share2 />
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm sm:grid-cols-4">
        {TRUST_POINTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2">
            <Icon className="size-5 shrink-0 text-primary" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}