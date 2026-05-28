"use client";

import React, { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
  Truck,
  CircleDot,
  Download,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import useOrders from "@/hooks/useOrders";
import useAuth from "@/hooks/useAuth";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import Invoice from "@/components/shared/Invoice";
import { downloadInvoice } from "@/lib/invoiceDownload";

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { isAuthenticated } = useAuth();
  const { order, isLoading, fetchOrderById } = useOrders();
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (id) fetchOrderById(id);
  }, [id, isAuthenticated, router, fetchOrderById]);

  if (isLoading) return <FullPageSpinner />;
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-brand-charcoal-medium">Order not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(
    (s) => s.key === order.status
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-cream-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>

          {/* Order Header */}
          <div className="flex flex-col gap-3 mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
                Order #{order.orderId}
              </h1>
              <p className="text-sm text-brand-charcoal-medium mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (invoiceRef.current) {
                    downloadInvoice(invoiceRef.current, order.orderId);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-brand-emerald text-white hover:bg-brand-emerald-dark transition-colors"
              >
                <Download className="w-4 h-4" />
                Invoice
              </button>
              <OrderStatusBadge status={order.status} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          </div>

          {/* Status Timeline */}
          {!isCancelled && (
            <Card padding="lg" className="mb-6">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center min-w-[80px] relative"
                    >
                      {idx > 0 && (
                        <div
                          className={`absolute top-5 -left-1/2 w-full h-0.5 -z-10 ${
                            idx <= currentStepIndex
                              ? "bg-brand-emerald"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted
                            ? "bg-brand-emerald text-white"
                            : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-brand-emerald/20" : ""}`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-medium text-center ${
                          isCompleted
                            ? "text-brand-emerald"
                            : "text-brand-charcoal-light"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {isCancelled && (
            <Card padding="lg" className="mb-6 border-l-4 border-red-500">
              <p className="text-red-600 font-medium">
                This order has been cancelled.
              </p>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-emerald" />
                Shipping Address
              </h3>
              <div className="text-sm text-brand-charcoal-medium space-y-1">
                <p className="font-medium text-brand-charcoal">
                  {order.address.fullName}
                </p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && (
                  <p>{order.address.addressLine2}</p>
                )}
                <p>
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.pincode}
                </p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </Card>

            {/* Payment Info */}
            <Card padding="lg">
              <h3 className="text-sm font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-emerald" />
                Payment Information
              </h3>
              <div className="text-sm text-brand-charcoal-medium space-y-2">
                <div className="flex justify-between">
                  <span>Method</span>
                  <span className="font-medium text-brand-charcoal capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                {order.paymentId && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="text-brand-charcoal font-mono text-xs">
                      {order.paymentId}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <Card padding="lg">
            <h3 className="text-sm font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-emerald" />
              Order Items
            </h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={
                        item.image ||
                        "/images/placeholder-product.svg"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-charcoal line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-brand-charcoal-light">
                      Qty: {item.quantity} x {formatPrice(item.price)}
                    </p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <div className="mt-1.5 flex items-center gap-1 flex-wrap">
                        <span className="text-xs text-brand-charcoal-light">✏️</span>
                        {Object.entries(item.customization).map(([key, val], i, arr) => (
                          <span key={key} className="text-xs text-brand-charcoal-medium">
                            <span className="font-medium">{val}</span>
                            {i < arr.length - 1 && <span className="text-brand-charcoal-light mx-1">·</span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-brand-charcoal shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-brand-charcoal">Total</span>
                <span className="text-brand-emerald">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div className="hidden">
          <div ref={invoiceRef}>
            <Invoice order={order} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
