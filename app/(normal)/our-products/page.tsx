import ProductListing from "@/components/products/product-listing";
import {getAllWebProducts } from "@/helper/product/action";

export default async function ProductsPage() {
  const products = await getAllWebProducts();

  return <ProductListing products={products} />;
}
