"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { MAX_QTY, formatPrice, getAvailability, getPricing, type Product } from "../../data/productformat";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductActions } from "./ProductActions";
import { ProductTabs } from "./ProductTabs";
import { MobileBuyBar } from "./MobileBuyBar";
import { whatsappLink } from "@/data/site";
import { toast } from "../ui/toast";

type ProductDetailsProps = {
  product: Product;
  categoryName?: string | null;
};

export function ProductDetails({ product, categoryName }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const availability = getAvailability(product);
  const pricing = getPricing(product);
  const maxQty = Math.max(1, Math.min(product.stock, MAX_QTY));
  const total = pricing.amount !== null ? formatPrice(pricing.amount * quantity) : pricing.label;

  // const handleAddToCart = () => {
  //   if (!availability.purchasable) return;
  //   setAdded(true);
  //   localStorage.setItem("cart", JSON.stringify({ product: product, quantity }));
  //   toast.add({
  //     type: "success",
  //     title: `${product.title} added to cart!`,
  //     description: "You can view your cart to proceed to checkout.",
  //   });
  //   setTimeout(() => setAdded(false), 1800);
  // };

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink >
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink >
                <Link href="/our-products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[60vw] truncate">{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
          <ProductGallery product={product} discount={pricing.discount} availability={availability} />

          <div className="flex flex-col gap-8">
            <ProductInfo
              product={product}
              categoryName={categoryName}
              pricing={pricing}
              availability={availability}
            />
            <ProductActions
              product={product}
              quantity={quantity}
              maxQty={maxQty}
              onQuantityChange={setQuantity}
              availability={availability}
              added={added}
              // onAddToCart={handleAddToCart}
              whatsappHref={whatsappLink}
            />
          </div>
        </div>

        <Separator className="my-14" />

        <ProductTabs product={product} categoryName={categoryName} availability={availability} />
      </div>

      <MobileBuyBar
        product={product}
        quantity={quantity}
        total={total}
        canBuy={availability.purchasable}
        added={added}
        // onAddToCart={handleAddToCart}
      />
    </div>
  );
}