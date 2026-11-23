"use client";

import { useCartStore } from "@/store/cart-store";
import { toast } from "./ui/toast";
import { Button } from "./ui/button";
import { ShoppingCartPlus } from "lucide-react";

export default function AddToCartButton({ product }: any) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    console.log("product",product)
    addToCart({
      id: product.id,
      title: product.title,
      sku: product.sku,
      price: Number(product.price),
      final_price: Number(product.final_price),
      bannerImage: product.bannerImage,
      quantity: 1,
      weight:product.weight
    });

    toast.add({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        handleAddToCart();
      }}
      type="button"
      className=" h-[50px] mt-2 w-48 rounded-full bg-[#a83218] text-lg font-normal tracking-wide text-white hover:bg-[#902a15]"
    >
      <ShoppingCartPlus size={20} /> Add To Cart
    </Button>
  );
}
