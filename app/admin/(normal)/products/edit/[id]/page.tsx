import { getProductById } from "@/helper/product/action";
import ProductClient from "./ProductClient";
import { getAllTags } from "@/helper/tags/action";
import { getAllCategories } from "@/helper/category/action";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function GetAllInfo({ params }: PageProps) {
  const { id } = await params;
  const [productData, tagData, categoryData] = await Promise.all([
    getProductById(id),
    getAllTags(),
    getAllCategories(),
  ]);

  return (
    <>
      <ProductClient
        productInfo={productData}
        tagsData={tagData}
        categories={categoryData}
      />
    </>
  );
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <div>
        <Suspense fallback={<p>Loading...</p>}>
          <GetAllInfo params={params} />
        </Suspense>
      </div>
      ;
    </>
  );
}
