import ProductListing from "@/components/products/product-listing";
import {getAllProductsByCategory } from "@/helper/product/action";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getAllProductsByCategory(slug);

  return (
    <div>
      <ProductListing products={products} />
    </div>
  );
}
