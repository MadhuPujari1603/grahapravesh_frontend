"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { FullPageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import useOrders from "@/hooks/useOrders";
import useAuth from "@/hooks/useAuth";
import { formatPrice, formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { orders, isLoading, pagination, fetchMyOrders } = useOrders();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchMyOrders();
  }, [isAuthenticated, router, fetchMyOrders]);

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-cream-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-8">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <EmptyState
              icon={<Package className="w-16 h-16" />}
              title="No Orders Yet"
              description="You haven't placed any orders yet. Start shopping to see your orders here."
              actionLabel="Shop Now"
              onAction={() => router.push("/products")}
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order._id} padding="none" hover>
                  <Link href={`/orders/${order._id}`} className="block p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-xs text-brand-charcoal-light mb-1">
                          Order #{order.orderId}
                        </p>
                        <p className="text-sm text-brand-charcoal-medium">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={order.status} />
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-3 mb-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0"
                        >
                          <img
                            src={
                              item.image ||
                              "/images/placeholder-product.svg"
                            }
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <span className="text-xs text-brand-charcoal-light">
                          +{order.items.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-emerald">
                        {formatPrice(order.totalAmount)}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </Card>
              ))}

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(page) => fetchMyOrders(page)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
