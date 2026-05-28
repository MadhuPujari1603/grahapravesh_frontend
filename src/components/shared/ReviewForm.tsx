"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, X } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Review } from "@/types";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";

const reviewSchema = z.object({
  title: z.string().optional(),
  comment: z
    .string()
    .min(5, "Comment must be at least 5 characters")
    .max(1000, "Comment must be less than 1000 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  existingReview?: Review;
}

export default function ReviewForm({
  productId,
  onSuccess,
  existingReview,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [ratingError, setRatingError] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    existingReview?.images || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: existingReview?.title || "",
      comment: existingReview?.comment || "",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = images.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      setRatingError("Please select a rating");
      return;
    }
    setRatingError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("productId", productId);
      formData.append("rating", rating.toString());
      formData.append("comment", data.comment);
      if (data.title) {
        formData.append("title", data.title);
      }
      images.forEach((img) => {
        formData.append("images", img);
      });

      if (existingReview) {
        await api.put(
          API_ENDPOINTS.REVIEW_BY_ID(existingReview._id),
          formData
        );
        toast.success("Review updated successfully");
      } else {
        await api.post(API_ENDPOINTS.REVIEWS_CREATE, formData);
        toast.success("Review submitted successfully");
      }

      onSuccess?.();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium text-brand-charcoal mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onChange={(r) => {
            setRating(r);
            setRatingError("");
          }}
        />
        {ratingError && (
          <p className="mt-1 text-xs text-red-500">{ratingError}</p>
        )}
      </div>

      {/* Title */}
      <Input
        label="Title (optional)"
        placeholder="Summarize your experience"
        {...register("title")}
        error={errors.title?.message}
      />

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("comment")}
          placeholder="Tell us about your experience with this product..."
          rows={4}
          className="input-premium w-full resize-none"
        />
        {errors.comment && (
          <p className="mt-1 text-xs text-red-500">{errors.comment.message}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-brand-charcoal mb-2">
          Photos (optional, max 5)
        </label>

        <div className="flex flex-wrap gap-3">
          {imagePreviews.map((preview, i) => (
            <div key={i} className="relative h-20 w-20 group">
              <img
                src={preview}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {imagePreviews.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-brand-charcoal-light hover:border-brand-emerald hover:text-brand-emerald transition-colors"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px] mt-1">Add</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <Button type="submit" isLoading={isSubmitting} size="lg">
        {existingReview ? "Update Review" : "Submit Review"}
      </Button>
    </form>
  );
}
