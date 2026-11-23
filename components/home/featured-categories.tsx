import Container from "../layout/container";
import { Button } from "../ui/button";
import Link from "next/link";
import { getAllCategories } from "@/helper/category/action";
import CategoryCard from "../category/category-card";
import { Suspense } from "react";

async function CategoryListing() {
  const categories = await getAllCategories();
  return (
    <>
      <section className="pt-20">
        <Container className="space-y-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl space-y-3">
              <h2 className="font-display text-4xl font-semibold sm:text-5xl">
                SHOP BY <span className="text-[#A1351B]">CATEGORY</span>
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
            {categories?.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

export default function FeaturedCategories() {
  return (
    <div>
      <Suspense fallback={<p>Loading categories...</p>}>
        <CategoryListing />
      </Suspense>
    </div>
  );
}
