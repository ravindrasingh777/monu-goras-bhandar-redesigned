import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, productReviewImages, productReviews, products } from "@/db/schema";
import { ProductDetails } from "@/components/products/ProductDetails";
import { getProductReviews } from "@/helper/review/action";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cached per request, so generateMetadata and the page share one query
const getProduct = cache(async (id: string) => {
  if (!UUID_PATTERN.test(id)) return null;

  const [row] = await db
    .select({ product: products, categoryName: categories.name})
    .from(products)
    .leftJoin(categories, eq(categories.id, products.categoryId))
    .where(eq(products.id, id))

  return row ?? null;
});

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const row = await getProduct(id);

  if (!row) return { title: "Product not found" };

  return {
    title: row.product.title,
    description: row.product.description ?? undefined,
  };
}

async function GetProductInfo({ params }: PageProps) {
  const { id } = await params;
  const row = await getProduct(id);
  const reviews = await getProductReviews(id);
  if (!row) notFound();

  return (
    <div className={font.className}>
      <ProductDetails product={row?.product} categoryName={row?.categoryName} reviews={reviews} />
    </div>
  );
}

export default function ProductPage({ params }: PageProps) {
  return (
    <div>
      <Suspense fallback={<p>Loading product details...</p>}>
        <GetProductInfo params={params} />
      </Suspense>
    </div>
  );
}
