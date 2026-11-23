import { Suspense } from "react";
import CategoryTable from "./CategoryTable";
import { getAllCategories } from "@/helper/category/action";

async function CategoryListing() {
  const categories = await getAllCategories();
  return (
    <>
      <div className="w-full p-4">
        <CategoryTable categories={categories} />
      </div>
    </>
  );
}

export default function page() {
  return (
    <div>
      <Suspense fallback={<p>Loading categories...</p>}>
        <CategoryListing />
      </Suspense>
    </div>
  );
}
