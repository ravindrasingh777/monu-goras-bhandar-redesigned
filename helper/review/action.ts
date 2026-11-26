"use server"

import { db } from "@/db";
import { productReviewImages, productReviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getProductReviews(id: string) {
  try {
    const data = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        userName: productReviews.userName,
        isActive: productReviews.isActive,
        rating: productReviews.rating,
        feedback: productReviews.feedback,
        createdAt:productReviews.createdAt,
        image: productReviewImages,
      })
      .from(productReviews)
      .leftJoin(
        productReviewImages,
        eq(productReviewImages.reviewId, productReviews.id),
      )
      .where(eq(productReviews.productId, id));

    const reviewMap = new Map();

    for (const row of data) {
      if (!reviewMap.has(row.id)) {
        reviewMap.set(row.id, {
          id: row.id,
          productId: row.productId,
          userName: row.userName,
          isActive: row.isActive,
          rating: row.rating,
          feedback: row.feedback,
          createdAt:row.createdAt,
          images: [],
        });
      }

      if (row.image) {
        reviewMap.get(row.id).images.push(row.image);
      }
    }

    const reviews = Array.from(reviewMap.values());

    return reviews;
  } catch (error) {
    console.log("error", error);
    return [];
  }
}

export async function createProductReview(reviewData: any) {
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Create review
      const [review] = await tx
        .insert(productReviews)
        .values({
          productId: reviewData.productId,
          userName: reviewData.name,
          rating: reviewData.rating,
          feedback: reviewData.feedback,
        })
        .returning({
          reviewId: productReviews.id,
        });

      if (!review?.reviewId) {
        throw new Error("Review ID not found!");
      }

      // 2. Insert review images
      if (reviewData.images?.length > 0) {
        await tx.insert(productReviewImages).values(
          reviewData.images.map((image: string) => ({
            reviewId: review.reviewId,
            imageUrl: image,
          }))
        );
      }

      return review.reviewId;
    });

    // 3. Success response
    return {
      status: 201,
      message: "Review created successfully.",
      reviewId: result,
    };

  } catch (error) {
    console.error("Create Product Review Error:", error);

    return {
      status: 500,
      message: "Review creation failed!",
    };
  }
}

