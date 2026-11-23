import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "../AddToCartButton";

type MobileBuyBarProps = {
  product:any;
  quantity: number;
  total: string;
  canBuy: boolean;
  added: boolean;
  // onAddToCart: () => void;
};

export function MobileBuyBar({product, quantity, total, canBuy, added }: MobileBuyBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Total for {quantity}</p>
          <p className="truncate text-xl font-bold text-primary">{total}</p>
        </div>
        {/* <Button size="lg" className="h-12 flex-1 rounded-full" disabled={!canBuy} onClick={onAddToCart}>
          {added ? <Check /> : <ShoppingCart />}
          {!canBuy ? "Unavailable" : added ? "Added" : "Add to cart"}
        </Button> */}
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}