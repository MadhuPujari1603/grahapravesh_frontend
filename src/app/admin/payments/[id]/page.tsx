"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CreditCard, Package, MapPin, User as UserIcon,
  Receipt, Clock, CheckCircle2, IndianRupee, Hash,
  ExternalLink, Download, ShieldCheck, AlertTriangle,
  Truck, ShoppingBag, Copy, Check, MessageCircle,
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
import { sendWhatsAppNotification, getPaymentUpdateMessage } from "@/lib/whatsappNotify";
import toast from "react-hot-toast";

interface PaymentRecord {
  _id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  createdAt: string;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-2 p-1 rounded text-brand-charcoal-light hover:text-brand-emerald transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function InfoRow({ label, value, mono = false, copyable = false }: {
  label: string; value: React.ReactNode; mono?: boolean; copyable?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-brand-charcoal-light font-medium">{label}</span>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-semibold text-brand-charcoal ${mono ? "font-mono text-xs bg-gray-50 px-2 py-0.5 rounded" : ""}`}>
          {value}
        </span>
        {copyable && typeof value === "string" && <CopyButton value={value} />}
      </div>
    </div>
  );
}

export default function AdminPaymentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN_ORDER_BY_ID(id));
      const data = res.data.data;
      setOrder(data);
      setNewPaymentStatus(data.paymentStatus);

      // fetch Razorpay payment record if online payment
      if (data.paymentMethod === "razorpay") {
        api.get(API_ENDPOINTS.PAYMENT_BY_ORDER(data._id))
          .then((r) => setPayment(r.data.data))
          .catch(() => {});
      }
    } catch {
      toast.error("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) fetchData(); }, [id]);

  const handlePaymentStatusUpdate = async () => {
    if (!newPaymentStatus || newPaymentStatus === order?.paymentStatus) return;
    setUpdating(true);
    try {
      const res = await api.put(`/orders/${id}/payment-status`, { paymentStatus: newPaymentStatus });
      toast.success("Payment status updated");
      const updatedOrder = res.data.data;
      const cust = typeof updatedOrder.userId === "object" ? updatedOrder.userId : null;
      if (cust?.phone) {
        sendWhatsAppNotification(cust.phone, getPaymentUpdateMessage({
          orderId: updatedOrder.orderId, customerName: cust.name,
          customerPhone: cust.phone, totalAmount: updatedOrder.totalAmount,
          status: updatedOrder.status, items: updatedOrder.items,
        }, newPaymentStatus));
      }
      fetchData();
    } catch {
      toast.error("Failed to update payment status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <FullPageSpinner />;
  if (!order) return <div className="text-center py-12"><p className="text-brand-charcoal-medium">Order not found</p></div>;

  const customer = typeof order.userId === "object" ? (order.userId as User) : null;
  const o = order as any;
  const itemsSubtotal: number = o.itemsSubtotal ?? order.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
  const deliveryCharge: number = o.deliveryCharge ?? (order.totalAmount - itemsSubtotal);
  const isOnline = order.paymentMethod === "razorpay";
  const razorpayPaymentId = order.paymentId || payment?.razorpayPaymentId;
  const razorpayOrderId = (o.razorpayOrderId) || payment?.razorpayOrderId;

  return (
    <div>
      {/* Hidden invoice for download */}
      <div className="hidden"><div ref={invoiceRef}><Invoice order={order} /></div></div>

      {/* Back */}
      <Link href="/admin/payments" className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Payments
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Payment — #{order.orderId}</h1>
          <p className="text-sm text-brand-charcoal-medium mt-1">{formatDateTime(order.createdAt)}</p>
          <div className="flex items-center gap-2 mt-2">
            <PaymentStatusBadge status={order.paymentStatus} />
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
        <button
          onClick={() => invoiceRef.current && downloadInvoice(invoiceRef.current, order.orderId)}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-brand-emerald text-white hover:bg-brand-emerald-dark transition-colors self-start shrink-0"
        >
          <Download className="w-4 h-4" /> Download Invoice
        </button>
        <button
          onClick={() => {
            const phone = customer?.phone || order.address?.phone;
            if (!phone) { toast.error("Customer phone not available"); return; }
            const msg = getPaymentUpdateMessage({
              orderId: order.orderId,
              customerName: customer?.name || order.address?.fullName || "Customer",
              customerPhone: phone,
              totalAmount: order.totalAmount,
              status: order.status,
              items: order.items,
            }, order.paymentStatus);
            sendWhatsAppNotification(phone, msg);
            toast.success("WhatsApp opened — send the message to notify customer");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors self-start shrink-0"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: 2/3 ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ─── Amount Breakdown ─── */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-brand-emerald" />
              Amount Breakdown
            </h3>
            <div className="space-y-0">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 py-3 border-b border-gray-50">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.image || "/images/placeholder-product.svg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-charcoal line-clamp-1">{item.name}</p>
                    {item.customization && Object.keys(item.customization).length > 0 && (
                      <p className="text-xs text-brand-charcoal-light mt-0.5">
                        {Object.entries(item.customization).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                      </p>
                    )}
                    <p className="text-xs text-brand-charcoal-light">Qty {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <span className="text-sm font-semibold text-brand-charcoal shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              {/* Subtotal row */}
              <div className="flex justify-between items-center py-2.5 text-sm">
                <span className="flex items-center gap-1.5 text-brand-charcoal-medium">
                  <ShoppingBag className="w-3.5 h-3.5" /> Items Subtotal
                </span>
                <span className="font-medium text-brand-charcoal">{formatPrice(itemsSubtotal)}</span>
              </div>

              {/* Delivery row */}
              <div className="flex justify-between items-center py-2.5 text-sm border-t border-gray-50">
                <span className="flex items-center gap-1.5 text-brand-charcoal-medium">
                  <Truck className="w-3.5 h-3.5" /> Delivery Charge
                </span>
                <span className={`font-medium ${deliveryCharge === 0 ? "text-green-600" : "text-brand-charcoal"}`}>
                  {deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}
                </span>
              </div>

              {/* Total row */}
              <div className="flex justify-between items-center py-3 border-t-2 border-brand-charcoal mt-1">
                <span className="text-base font-bold text-brand-charcoal">Total Paid</span>
                <span className="text-xl font-black text-brand-emerald">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </Card>

          {/* ─── Razorpay Proof (online payments only) ─── */}
          {isOnline && (
            <Card padding="lg">
              <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-emerald" />
                Razorpay Payment Proof
              </h3>

              {/* Verification status banner */}
              {payment?.status === "paid" || order.paymentStatus === "paid" ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Payment Verified</p>
                    <p className="text-xs text-green-600">HMAC signature verified by server. This payment is authentic.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800 font-medium">Payment not yet verified or failed.</p>
                </div>
              )}

              <div className="space-y-0">
                <InfoRow label="Payment Method" value="Razorpay (Online)" />
                <InfoRow label="Amount Charged" value={`${formatPrice(payment?.amount ?? order.totalAmount)} (${payment?.currency ?? "INR"})`} />
                {razorpayPaymentId && (
                  <InfoRow label="Razorpay Payment ID" value={razorpayPaymentId} mono copyable />
                )}
                {razorpayOrderId && (
                  <InfoRow label="Razorpay Order ID" value={razorpayOrderId} mono copyable />
                )}
                {payment?.razorpaySignature && (
                  <InfoRow label="Signature" value={payment.razorpaySignature.slice(0, 24) + "…"} mono />
                )}
                {payment?.createdAt && (
                  <InfoRow label="Payment Recorded" value={formatDateTime(payment.createdAt)} />
                )}
              </div>

              {/* Deep link to Razorpay dashboard */}
              {razorpayPaymentId && (
                <a
                  href={`https://dashboard.razorpay.com/app/payments/${razorpayPaymentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-emerald border border-brand-emerald/30 hover:bg-brand-emerald/5 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View in Razorpay Dashboard
                </a>
              )}
            </Card>
          )}

          {/* ─── COD Payment Update ─── */}
          {!isOnline && (
            <Card padding="lg">
              <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-emerald" />
                Cash on Delivery — Update Payment
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="input-premium text-sm py-2 flex-1 max-w-xs"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid (collected)</option>
                  <option value="refunded">Refunded</option>
                </select>
                <Button size="sm" onClick={handlePaymentStatusUpdate} isLoading={updating}
                  disabled={newPaymentStatus === order.paymentStatus || updating}>
                  Update
                </Button>
              </div>
            </Card>
          )}

          {/* ─── Timeline ─── */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-emerald" />
              Timeline
            </h3>
            <div className="space-y-0 bg-brand-cream rounded-xl p-4">
              <InfoRow label="Order Placed" value={formatDateTime(order.createdAt)} />
              <InfoRow label="Payment Method" value={isOnline ? "Razorpay (Online)" : "Cash on Delivery"} />
              <InfoRow label="Payment Status" value={<PaymentStatusBadge status={order.paymentStatus} />} />
              <InfoRow label="Order Status" value={<OrderStatusBadge status={order.status} />} />
              {order.updatedAt !== order.createdAt && (
                <InfoRow label="Last Updated" value={formatDateTime(order.updatedAt)} />
              )}
            </div>
          </Card>
        </div>

        {/* ── Right: 1/3 ── */}
        <div className="space-y-6">
          {/* Customer */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-emerald" /> Customer
            </h3>
            {customer ? (
              <div className="space-y-1.5 text-sm">
                <p className="font-semibold text-brand-charcoal">{customer.name}</p>
                <p className="text-brand-charcoal-medium">{customer.email}</p>
                {customer.phone && <p className="text-brand-charcoal-medium">{customer.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-brand-charcoal-light">Not available</p>
            )}
          </Card>

          {/* Shipping Address */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-emerald" /> Delivery Address
            </h3>
            <div className="text-sm text-brand-charcoal-medium space-y-1">
              <p className="font-semibold text-brand-charcoal">{order.address.fullName}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
              <p className="text-brand-charcoal">📞 {order.address.phone}</p>
            </div>
          </Card>

          {/* Order link */}
          <Card padding="lg">
            <h3 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-brand-emerald" /> Order
            </h3>
            <p className="text-sm text-brand-charcoal-medium mb-2">#{order.orderId}</p>
            <Link href={`/admin/orders/${order._id}`} className="inline-flex items-center gap-1.5 text-sm text-brand-emerald hover:underline font-medium">
              View Order Details <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </Card>

          {/* Quick amount summary box */}
          <div className="rounded-2xl overflow-hidden border border-brand-emerald/20 bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3">Amount Collected</p>
            <p className="text-3xl font-black tracking-tight">{formatPrice(order.totalAmount)}</p>
            <div className="mt-3 space-y-1 text-xs text-emerald-200">
              <div className="flex justify-between">
                <span>Items</span><span>{formatPrice(itemsSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? "Free" : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-500/30 pt-1 font-bold text-white">
                <span>Total</span><span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
            <div className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              order.paymentStatus === "paid" ? "bg-green-400/20 text-green-200" :
              order.paymentStatus === "pending" ? "bg-amber-400/20 text-amber-200" :
              "bg-red-400/20 text-red-200"
            }`}>
              {order.paymentStatus === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
