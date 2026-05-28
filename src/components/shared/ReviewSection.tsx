"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MessageSquarePlus, Star } from "lucide-react";
import StarRating from "./StarRating";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { Review } from "@/types";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  productId: string;
}

interface ReviewsResponse {
  data: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  averageRating: number;
  ratingDistribution: Record<string, number>;
}

const REVIEWS_PER_PAGE = 5;

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<
    Record<string, number>
  >({});

  const fetchReviews = useCallback(
    async (page: number = 1) => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `${API_ENDPOINTS.REVIEWS_PRODUCT(productId)}?page=${page}&limit=${REVIEWS_PER_PAGE}`
        );
        const responseData = res.data.data || {};
        setReviews(responseData.reviews || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalReviews(res.data.pagination?.total || 0);
        setAverageRating(responseData.averageRating || 0);
        setRatingDistribution(responseData.ratingDistribution || {});
      } catch {
        // Silently handle - reviews are non-critical
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage, fetchReviews]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReviewSuccess = () => {
    setShowForm(false);
    setCurrentPage(1);
    fetchReviews(1);
  };

  const maxDistributionCount = Math.max(
    ...Object.values(ratingDistribution).map(Number),
    1
  );

  return (
    <section className="mt-16 mb-8">
      <h2 className="heading-secondary mb-8">Customer Reviews</h2>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <Card padding="lg" className="sticky top-24">
              {totalReviews > 0 ? (
                <>
                  {/* Average rating */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-brand-charcoal mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <StarRating
                      rating={averageRating}
                      size="md"
                      className="justify-center mb-1"
                    />
                    <p className="text-sm text-brand-charcoal-medium">
                      Based on {totalReviews}{" "}
                      {totalReviews === 1 ? "review" : "reviews"}
                    </p>
                  </div>

                  {/* Distribution bars */}
                  <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = Number(ratingDistribution[star] || 0);
                      const percentage =
                        totalReviews > 0
                          ? (count / totalReviews) * 100
                          : 0;

                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs font-medium text-brand-charcoal w-3 text-right">
                            {star}
                          </span>
                          <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-brand-gold rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-brand-charcoal-light w-8 text-right">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-brand-charcoal-light mb-2">
                    0.0
                  </div>
                  <StarRating
                    rating={0}
                    size="md"
                    className="justify-center mb-1"
                  />
                  <p className="text-sm text-brand-charcoal-medium">
                    No reviews yet
                  </p>
                </div>
              )}

              {/* Write a Review button */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button
                  fullWidth
                  variant={showForm ? "ghost" : "primary"}
                  icon={<MessageSquarePlus className="w-4 h-4" />}
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? "Cancel" : "Write a Review"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            {/* Review Form */}
            {showForm && (
              <Card padding="lg" className="mb-6 border border-brand-emerald/20">
                <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
                  Write Your Review
                </h3>
                <ReviewForm
                  productId={productId}
                  onSuccess={handleReviewSuccess}
                />
              </Card>
            )}

            {/* Reviews */}
            {reviews.length > 0 ? (
              <Card padding="lg">
                {reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}

                {totalPages > 1 && (
                  <div className="pt-6 border-t border-gray-100">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </Card>
            ) : (
              !showForm && (
                <Card padding="lg">
                  <EmptyState
                    icon={<Star className="w-12 h-12" />}
                    title="Be the first to review"
                    description="Share your experience with this product and help other customers make informed decisions."
                    actionLabel="Write a Review"
                    onAction={() => setShowForm(true)}
                  />
                </Card>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}
