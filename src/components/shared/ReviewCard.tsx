"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import StarRating from "./StarRating";
import Modal from "@/components/ui/Modal";
import { Review, User } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const user =
    typeof review.userId === "object"
      ? (review.userId as User)
      : { name: "Anonymous" };
  const userName = user.name || "Anonymous";

  return (
    <>
      <div className="border-b border-gray-100 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center text-sm font-semibold shrink-0">
            {getInitials(userName)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span className="text-sm font-semibold text-brand-charcoal">
                {userName}
              </span>
              {review.isVerifiedPurchase && (
                <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Purchase
                </span>
              )}
            </div>

            {/* Stars and date */}
            <div className="flex items-center gap-3 mb-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-xs text-brand-charcoal-light">
                {formatDate(review.createdAt)}
              </span>
            </div>

            {/* Title */}
            {review.title && (
              <h4 className="text-sm font-bold text-brand-charcoal mb-1">
                {review.title}
              </h4>
            )}

            {/* Comment */}
            <p className="text-sm text-brand-charcoal-medium leading-relaxed">
              {review.comment}
            </p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {review.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className="h-20 w-20 rounded-lg overflow-hidden shrink-0 border border-gray-200 hover:border-brand-emerald transition-colors"
                  >
                    <img
                      src={img}
                      alt={`Review image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size="xl"
      >
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Review image"
            className="w-full h-auto rounded-lg"
          />
        )}
      </Modal>
    </>
  );
}
