"use client";

import { useRef, useState } from "react";
import { Star, Upload, X, ImagePlus, MessageSquare, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "../ui/toast";
import { Textarea } from "../ui/textarea";
import { createProductReview } from "@/helper/review/action";
import { useRouter } from "next/navigation";

export default function ReviewForm({ setOpen, productId }: any) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [images, setImages] = useState<any>([]);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) return;

    const remainingSlots = 5 - images.length;

    if (remainingSlots <= 0) {
      toast.add({
        type: "error",
        title: "You can upload maximum 5 images.",
      });
      e.target.value = "";
      return;
    }

    if (selectedFiles.length > remainingSlots) {
      toast.add({
        type: "error",
        title: `You can upload only ${remainingSlots} more images.`,
      });
    }

    const validFiles = selectedFiles
      .slice(0, remainingSlots)
      .filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) {
      toast.add({
        type: "error",
        title: "Only image files are allowed.",
      });
      e.target.value = "";
      return;
    }

    try {
      setLoading(true)
      const uploadedUrls: any = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Image upload failed.");
        }

        uploadedUrls.push(data.url);
      }

      setImages((prev: any) => [...prev, ...uploadedUrls]);

      toast.add({
        type: "success",
        title: "Images uploaded successfully!",
        description: `${uploadedUrls.length} image(s) uploaded.`,
      });
    } catch (error) {
      console.error("Image upload error:", error);

      toast.add({
        type: "error",
        title: "Image upload failed.",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      e.target.value = "";
      setLoading(false)
    }
  };

  const removeImage = (index: number) => {
    setImages((prev: any) => prev.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        type: "error",
        title: "Please enter your name.",
      });
      return;
    }

    if (rating === 0) {
      toast.add({
        type: "error",
        title: "Please select a rating.",
      });
      return;
    }

    if (!feedback.trim()) {
      toast.add({
        type: "error",
        title: "Please write your feedback.",
      });
      return;
    }

    try {
      setLoading(true);
      const reviewData = {
        name: name.trim(),
        rating,
        feedback: feedback.trim(),
        images,
        productId: productId,
        submittedAt: new Date().toISOString(),
      };

      const response = await createProductReview(reviewData);
      if (response.status == 201) {
        toast.add({
          type: "success",
          title: "Thank you! Your review has been submitted.",
        });
      } else {
        toast.add({
          type: "error",
          title: response.message,
        });
      }
    } catch (error) {
      toast.add({
        type: "error",
        title: "Internal server error!",
      });
    } finally {
      setLoading(false);
    }

    setName("");
    setRating(0);
    setFeedback("");
    setImages([]);
    setHoverRating(0);
    setOpen(false);
    router.refresh()
  };

  return (
    <Card className="w-full rounded-2xl border shadow-sm">
      <CardHeader className="space-y-2 border-b bg-muted/30 px-5 py-6 sm:px-7">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <MessageSquare className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold sm:text-2xl">
            Write a Review
          </CardTitle>
        </div>

        <p className="text-sm text-muted-foreground">
          Share your experience with us. Your feedback helps us improve.
        </p>
      </CardHeader>

      <CardContent className="px-5 py-6 sm:px-7 sm:py-7">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="review-name">
              Your Name <span className="text-destructive">*</span>
            </Label>

            <div className="relative">
              <Input
                id="review-name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
                maxLength={100}
              />
            </div>
          </div>

          {/* Star Rating */}
          <div className="space-y-3">
            <Label>
              Your Rating <span className="text-destructive">*</span>
            </Label>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onFocus={() => setHoverRating(star)}
                    onBlur={() => setHoverRating(0)}
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={rating === star}
                    className="rounded-md p-1 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors sm:h-8 sm:w-8 ${
                        star <= (hoverRating || rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <span className="text-sm font-semibold text-foreground">
                {rating > 0 ? `${rating}/5` : "Select your rating"}
              </span>
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="review-feedback">
                Your Feedback <span className="text-destructive">*</span>
              </Label>
              <span className="text-xs text-muted-foreground">
                {feedback.length}/1000
              </span>
            </div>

            <Textarea
              id="review-feedback"
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
              className="min-h-32 "
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Upload Images (Optional)</Label>
              <span className="text-xs font-medium text-muted-foreground">
                {images.length}/5 images
              </span>
            </div>

            {images.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <ImagePlus className="h-6 w-6" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-semibold">
                    Click to upload images
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG, JPG, WEBP (Maximum 5 images)
                  </p>
                  {
                    loading && <p>Uploading...</p>
                  }
                </div>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {images.map((image: any, index: number) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="group relative aspect-square overflow-hidden rounded-xl border bg-muted"
                  >
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label="Remove image"
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white transition-colors hover:bg-destructive"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-xl text-sm font-semibold"
            >
              {loading ? "Submitting.." : "Submit Review"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-11 w-full mt-2 gap-2 rounded-xl text-sm font-semibold"
            >
              Back
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Thank you for taking the time to share your experience!
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
