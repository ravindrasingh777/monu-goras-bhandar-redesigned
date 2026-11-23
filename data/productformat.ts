import { Check, Info, XCircle, type LucideIcon } from "lucide-react";
import type { products } from "@/db/schema";

export type Product = typeof products.$inferSelect;

// Store settings: adjust to your business
export const CURRENCY = "INR";
export const LOCALE = "en-IN";
export const TIME_ZONE = "Asia/Kolkata";
export const DIMENSION_UNIT = "cm";
export const LOW_STOCK_LIMIT = 5;
export const MAX_QTY = 10;

// Prices are stored as text, so strip symbols and commas before parsing
const toAmount = (value?: string | null) => {
  const amount = Number(value?.replace(/[^\d.]/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (value: Date | string) =>
  new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(new Date(value));

export const formatDimensions = (p: Pick<Product, "length" | "width" | "height">) => {
  const parts = [p.length, p.width, p.height].map((part) => part.trim());
  const hasUnit = parts.some((part) => /[a-z]/i.test(part));
  return parts.join(" × ") + (hasUnit ? "" : ` ${DIMENSION_UNIT}`);
};

// final_price is the selling price; price is the MRP, shown struck through
export const getPricing = (p: Pick<Product, "price" | "final_price">) => {
  const mrp = toAmount(p.price);
  const amount = toAmount(p.final_price) ?? mrp;
  const hasOffer = mrp !== null && amount !== null && mrp > amount;

  return {
    amount,
    label: amount !== null ? formatPrice(amount) : p.final_price || p.price,
    original: hasOffer ? formatPrice(mrp) : null,
    discount: hasOffer ? Math.round(((mrp - amount) / mrp) * 100) : 0,
  };
};

export type Pricing = ReturnType<typeof getPricing>;

export type Availability = {
  label: string;
  tone: string;
  Icon: LucideIcon;
  purchasable: boolean;
};

export const getAvailability = (p: Pick<Product, "is_active" | "stock">): Availability => {
  if (!p.is_active) {
    return { label: "Currently unavailable", tone: "text-destructive", Icon: XCircle, purchasable: false };
  }
  if (p.stock <= 0) {
    return { label: "Out of stock", tone: "text-destructive", Icon: XCircle, purchasable: false };
  }
  if (p.stock <= LOW_STOCK_LIMIT) {
    return { label: `Only ${p.stock} left`, tone: "text-accent-foreground", Icon: Info, purchasable: true };
  }
  return { label: "In stock", tone: "text-emerald-700", Icon: Check, purchasable: true };
};