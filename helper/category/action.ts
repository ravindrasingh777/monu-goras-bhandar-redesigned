"use server";
import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { categories } from "../../db/schema";

interface categoryDetails {
  name: string;
  slug: string;
  bannerImage: string;
  is_active: boolean;
}

export async function getAllCategories() {
  try {
    const data = await db.select().from(categories);
    return data;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

export async function createCategory(categoryInfo: categoryDetails) {
  try {
    const [cateogry] = await db
      .insert(categories)
      .values({
        name: categoryInfo.name,
        slug: categoryInfo.slug,
        bannerImage: categoryInfo.bannerImage,
        is_active: categoryInfo.is_active,
      })
      .returning();
    return { status: 201, created_category: cateogry };
  } catch (error) {
    console.log(error);
    return { status: 500, created_category: [] };
  }
}

export async function updateCategory(id:string,categoryInfo: categoryDetails) {
  try {
    const [updatedProduct] = await db
      .update(categories)
      .set({
        name: categoryInfo.name,
        slug: categoryInfo.slug,
        bannerImage: categoryInfo.bannerImage,
        is_active: categoryInfo.is_active,
      })
      .where(eq(categories.id, id))
      .returning();
    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update product",
    };
  }
}
