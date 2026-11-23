import { getAllProducts } from "@/helper/product/action"
import ProductTable from "./ProductTable";
import { Suspense } from "react";


async function ProductListing(){
  const products = await getAllProducts();
  return(
    <>
      <div className="w-full p-4">
        <ProductTable  products={products}/>
      </div>
    </>
  )
}
export default function page() {
  return (
    <div>
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductListing />
      </Suspense>
    </div>
  )
}
