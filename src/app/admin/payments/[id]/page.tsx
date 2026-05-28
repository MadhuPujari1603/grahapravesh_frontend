"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  Package,
  MapPin,
  User as UserIcon,
  Receipt,
  Clock,
  CheckCircle2,
  IndianRupee,
  Hash,
  ExternalLink,
  Download,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Order, User } from "@/types";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import Invoice from "@/components/shared/Invoice";
import { downloadInvoice } from "@/lib/invoiceDownload";
import {
  sendWhatsAppNotification,
  getPaymentUpdateMessage,
} from "@/lib/whatsappNotify";
import toast from "react-hot-toast";

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN_ORDER_BY_ID(id));
      const data = res.data.data;
      setOrder(data);
      setNewPaymentStatus(data.paymentStatus);
    } catch {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handlePaymentStatusUpdate = async () => {
    if (!newPaymentStatus || newPaymentStatus === order?.paymentStatus) return;
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${id}/payment-status`, {
        paymentStatus: newPaymentStatus,
      });
      toast.success("Payment status updated");

      const updatedOrder = res.data.data;
      const cust = typeof updatedOrder.userId === "object" ? updatedOrder.userId : null;
      if (cust?.phone) {
        const message = getPaymentUpdateMessage(
          {
            orderId: updatedOrder.orderId,
            customerName: cust.name,
            customerPhone: cust.phone,
            totalAmount: updatedOrder.totalAmount,
            status: updatedOrder.status,
            items: updatedOrder.items,
          },
          newPaymentStatus
        );
        sendWhatsAppNotification(cust.phone, message);
      }

      fetchOrder();
    } catch {
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <FullPageSpinner />;

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-charcoal-medium">Order not found</p>
      </div>
    );
  }

  const customer =
    typeof order.userId === "object" ? (order.userId as User) : null;

  return (
    <div>
      {/* Back Link */}
      <Link
        href="/admin/payments"
        className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Payments
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            Payment for Order #{order.orderId}
          </h1>
          <p className="text-sm text-brand-charcoal-medium mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => {
              if (invoiceRef.current) {
                downloadInvoice(invoiceRef.current, order.orderId);
              }
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-brand-emerald text-white hover:bg-brand-emerald-dark transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 text-brand-charcoal capitalize">
            <CreditCard className="w-3.5 h-3.5" />
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay"}
          </span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Status Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-emerald" />
              Payment Status
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-brand-charcoal-medium">
                Current Status:
              </span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>

            {order.paymentMethod === "cod" ? (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="input-premium text-sm py-2 flex-1 max-w-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handlePaymentStatusUpdate}
                  isLoading={updating}
                  disabled={
                    newPaymentStatus === order.paymentStatus || updating
                  }
                >
                  Update
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                {order.paymentId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-charcoal-medium">
                      Payment ID
                    </span>
                    <span className="font-mono text-xs text-brand-charcoal bg-gray-50 px-2 py-1 rounded">
                      {order.paymentId}
                    </span>
                  </div>
                )}
                {(order as any).razorpayOrderId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-charcoal-medium">
                      Razorpay Order ID
                    </span>
                    <span className="font-mono text-xs text-brand-charcoal bg-gray-50 px-2 py-1 rounded">
                      {(order as any).razorpayOrderId}
                    </span>
                  </div>
                )}
                <p className="text-xs text-brand-charcoal-medium italic">
                  Online payment statuses are managed by the payment gateway.
                </p>
              </div>
            )}
          </Card>

          {/* Order Items Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-emerald" />
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Product
                    </th>
                    <th className="text-center py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Qty
                    </th>
                    <th className="text-right py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Price
                    </th>
                    <th className="text-right py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <img
                              src={
                                item.image ||
                                "/images/placeholder-product.svg"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium text-brand-charcoal line-clamp-1">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-brand-charcoal-medium">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-brand-charcoal-medium">
                        {formatPrice(item.price)}
                      </td>
                      <td className="py-4 text-right font-medium text-brand-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 max-w-xs ml-auto">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-brand-emerald">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Timeline / Invoice Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-emerald" />
              Payment Summary
            </h3>

            <div className="bg-brand-cream rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-brand-charcoal-medium">
                    <Clock className="w-4 h-4" />
                    Order Placed
                  </div>
                  <span className="text-brand-charcoal font-medium">
                    {formatDateTime(order.createdAt)}
                  </span>
                </div>

                <div className="border-t border-gray-200" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-brand-charcoal-medium">
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </div>
                  <span className="text-brand-charcoal font-medium capitalize">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Razorpay"}
                  </span>
                </div>

                <div className="border-t border-gray-200" />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-brand-charcoal-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Payment Status
                  </div>
                  <PaymentStatusBadge status={order.paymentStatus} />
                </div>

                {order.paymentId && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-brand-charcoal-medium">
                        <Hash className="w-4 h-4" />
                        Transaction ID
                      </div>
                      <span className="font-mono text-xs text-brand-charcoal bg-white px-2 py-1 rounded">
                        {order.paymentId}
                      </span>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-brand-charcoal font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    Total Amount
                  </div>
                  <span className="text-lg font-bold text-brand-emerald">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {order.updatedAt && order.updatedAt !== order.createdAt && (
              <p className="text-xs text-brand-charcoal-medium mt-3">
                Last updated: {formatDateTime(order.updatedAt)}
              </p>
            )}
          </Card>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-emerald" />
              Customer
            </h3>
            {customer ? (
              <div className="text-sm text-brand-charcoal-medium space-y-2">
                <p className="font-medium text-brand-charcoal">
                  {customer.name}
                </p>
                <p>{customer.email}</p>
                {customer.phone && <p>{customer.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-brand-charcoal-light">
                Customer info not available
              </p>
            )}
          </Card>

          {/* Shipping Address Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
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

          {/* Order Status Card */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-emerald" />
              Order Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-brand-charcoal-medium">
                  Status:
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <Link
                href={`/admin/orders/${order._id}`}
                className="inline-flex items-center gap-1.5 text-sm text-brand-emerald hover:underline font-medium"
              >
                View Order Details
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="hidden">
        <div ref={invoiceRef}>
          <Invoice order={order} />
        </div>
      </div>
    </div>
  );
}
