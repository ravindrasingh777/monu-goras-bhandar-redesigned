"use server";
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index";
import { categories, products } from "../../db/schema";
import { revalidatePath } from "next/cache";

export interface productDetails {
  title: string;
  category: string;
  sku: string;
  is_active: boolean;
  description: string;
  stock: number;
  length: string;
  width: string;
  weight?:any;
  height: string;
  tags: string[];
  bannerImage: string;
  remarks: string;
  price: string;
  final_price: string;
}

export async function createProduct(productInfo: productDetails) {
  try {
    const [product] = await db
      .insert(products)
      .values({
        title: productInfo.title,
        categoryId: productInfo.category,
        sku: productInfo.sku,
        is_active: productInfo.is_active,
        description: productInfo.description,
        stock: productInfo.stock,
        length: productInfo.length,
        width: productInfo.width,
        height: productInfo.height,
        tags: productInfo.tags,
        bannerImage: productInfo.bannerImage,
        remarks: productInfo.remarks,
        price: productInfo.price,
        final_price: productInfo.final_price,
      })
      .returning();
    return { status: 201, created_product: product };
  } catch (error) {
    console.log(error);
    return { status: 500, created_product: [] };
  }
}

export async function getAllProducts() {
  try {
    const data = await db
      .select({
        id: products.id,
        title: products.title,
        category: categories.name,
        sku: products.sku,
        stock: products.stock,
        bannerImage: products.bannerImage,
        price: products.price,
        final_price: products.final_price,
        is_active: products.is_active,
        created_at: products.createdAt
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(asc(products.createdAt));
    return data;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

export async function getAllWebProducts(bestSeller = false) {
  try {
    const data = await db
      .select({
        id: products.id,
        title: products.title,
        stock: products.stock,
        remarks: products.remarks,
        bannerImage: products.bannerImage,
        weight: products.weight,
        price: products.price,
        final_price: products.final_price,
        created_at: products.createdAt,
        sku: products.sku
      })
      .from(products)
      .where(bestSeller ? eq(products.remarks, "Best Seller") : undefined)
      .orderBy(asc(products.createdAt));
    return data;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

export async function getProductById(id:any){
    try {
        const data = await db.select().from(products).where(eq(products.id,id))
        return data[0];
    } catch (error) {
        console.log("error",error);
        return {}
    }
}



export async function updateProductById(id: string, data: any) {
  try {
    const [updatedProduct] = await db
      .update(products)
      .set({
        title: data.title,
        categoryId: data.categoryId,
        sku: data.sku,
        is_active: data.is_active,
        description: data.description,
        stock: data.stock,
        length: data.length,
        width: data.width,
        height: data.height,
        tags: data.tags,
        bannerImage: data.bannerImage,
        remarks: data.remarks,
        price: data.price,
        final_price: data.final_price,
      })
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    revalidatePath("/admin/products");

    return {
      success: true,
      data: updatedProduct,
    };
  } catch (error) {
    console.error("Update product error:", error);

    return {
      success: false,
      message: "Failed to update product",
    };
  }
}


export async function getAllProductsByCategory(category: string) {
  try {
    const [categoryData] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, category));

    if (!categoryData) {
      return [];
    }
    const data = await db
      .select()
      .from(products)
      .where(eq(products.categoryId, categoryData.id));
    return data;
  } catch (error) {
    console.log("error", error);
    return {};
  }
}
