"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDate,
  formatDimensions,
  type Availability,
  type Product,
} from "../../data/productformat";
import { CalendarDays, ImageIcon, MessageSquare, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import ReviewForm from "./ReviewForm";

type ProductTabsProps = {
  product: Product;
  categoryName?: string | null;
  availability: Availability;
  reviews: any;
};

type Review = {
  id: string;
  userName: string;
  rating: number;
  feedback: string;
  createdAt: string | Date;
  images?: {
    id: string;
    imageUrl?: string;
    url?: string;
  }[];
};

export function ProductTabs({
  product,
  categoryName,
  availability,
  reviews,
}: ProductTabsProps) {
  const [openWriteReviewModel, setOpenWriteReviewModel] = useState(false);
  const paragraphs = (product.long_description ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const specs: [string, string][] = [
    ["SKU", product.sku],
    ["Category", categoryName ?? "—"],
    ["Dimensions", formatDimensions(product)],
    ["Availability", availability.label],
    ["Tags", product.tags.join(", ") || "—"],
    ["Listed on", formatDate(product.createdAt)],
    ["Last updated", formatDate(product.updatedAt)],
  ];

  const averageRating = reviews.length
    ? reviews.reduce((sum: any, review: Review) => sum + review.rating, 0) /
      reviews.length
    : 0;

  const formatDateToReview = (date: string | Date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <>
      {openWriteReviewModel ? (
        <ReviewForm
          setOpen={setOpenWriteReviewModel}
          productId={product.id}
        />
      ) : (
        <Tabs
          defaultValue="reviews"
          className="gap-6 flex flex-col w-full"
        >
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="w-full space-y-4 text-base leading-relaxed text-muted-foreground"
          >
            {paragraphs.length > 0 ? (
              paragraphs.map((text, index) => (
                <p dangerouslySetInnerHTML={{ __html: text }} key={index} />
              ))
            ) : (
              <p>No detailed description yet.</p>
            )}
          </TabsContent>

          <TabsContent
            value="specifications"
            className="w-full space-y-4 text-base leading-relaxed text-muted-foreground"
          >
            <Table>
              <TableBody>
                {specs.map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell className="w-40 font-medium text-foreground">
                      {label}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent
            value="reviews"
            className="w-full space-y-6 text-base leading-relaxed text-muted-foreground"
          >
            {/* Rating Summary */}
            <div className="rounded-2xl border bg-card p-5 sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customer Reviews
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      {averageRating.toFixed(1)}
                    </span>

                    <div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(averageRating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Based on {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {reviews.length} Reviews
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Customer feedback
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2  border-primary/30 bg-background text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => {
                  setOpenWriteReviewModel(true);
                }}
              >
                <MessageSquare className="h-4 w-4" />
                Write a review
              </Button>
            </div>

            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews?.map((review: Review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border bg-card p-5 transition-colors hover:border-primary/30 sm:p-6"
                  >
                    {/* Customer Details */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-bold text-primary">
                          {review.userName?.charAt(0)?.toUpperCase() ?? "C"}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-foreground">
                            {review.userName}
                          </h3>

                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {formatDateToReview(review.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span className="text-sm font-bold tabular-nums text-foreground">
                          {review.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / 5
                        </span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="mt-4 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Feedback */}
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-foreground/80">
                      {review.feedback}
                    </p>

                    {/* Review Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="mt-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                          Customer Photos
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {review.images.map((image) => (
                            <img
                              key={image.id}
                              src={image.imageUrl ?? image.url}
                              alt="Customer review"
                              className="h-20 w-20 rounded-xl border object-cover sm:h-24 sm:w-24"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-5 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <MessageSquare className="h-7 w-7 text-muted-foreground" />
                </div>

                <h3 className="mt-4 font-semibold text-foreground">
                  No Reviews Yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Be the first to share your experience with this product.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </>
  );
}
