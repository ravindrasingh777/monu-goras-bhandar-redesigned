import Link from "next/link";
import Container from "@/components/layout/container";
import ProductCard from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { getAllWebProducts } from "@/helper/product/action";
import { Suspense } from "react";

async function ProductListing() {
  const bestSeller = true;
  const products = await getAllWebProducts(bestSeller);
  return (
    <section className="py-20">
      <Container className="space-y-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl space-y-3">
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">
              OUR <span className="text-[#A1351B]">BESTSELLER</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Pure cow milk, bilona ghee, chaach, shrikhand and sweets.
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="self-start sm:self-auto"
          >
            <Link href="/our-products">View all products</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products?.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export default function FeaturedProducts() {
  return (
    <div>
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductListing />
      </Suspense>
    </div>
  );
}
