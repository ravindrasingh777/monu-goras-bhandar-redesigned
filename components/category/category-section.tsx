
import { getAllCategories } from "@/helper/category/action";
import CategoryListing from "./CategoryListing";

export default async function CategorySection() {
  const categories = await getAllCategories();

  return <CategoryListing categories={categories} />;
}