import CategorySection from "@/components/category/category-section";
import CategorySkeleton from "@/components/category/category-skeleton";
import { Suspense } from "react";


export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 lg:p-16">
      <h1 className="text-5xl font-bold">Our products</h1>

      <p className="mt-4 text-gray-600">
        Cow milk, bilona ghee, chaach, shrikhand
        and sweets from Goras Bhandar.
      </p>

      <div className="mt-10">
        <Suspense fallback={<CategorySkeleton />}>
          <CategorySection />
        </Suspense>
      </div>

      <div className="mt-10">{children}</div>
    </section>
  );
}