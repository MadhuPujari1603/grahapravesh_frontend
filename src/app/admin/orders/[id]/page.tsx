"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  UserIcon,
  Download,
  Printer,
  MessageCircle,
  Mail,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { Order, User } from "@/types";
import { formatPrice, formatDate, formatDateTime } from "@/lib/utils";
import Invoice from "@/components/shared/Invoice";
import { downloadInvoice } from "@/lib/invoiceDownload";
import { downloadProductionSheet } from "@/lib/productionSheet";
import {
  sendWhatsAppNotification,
  getStatusUpdateMessage,
} from "@/lib/whatsappNotify";

const WA_BUSINESS = "918762625888";
import toast from "react-hot-toast";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN_ORDER_BY_ID(id));
      setOrder(res.data.data);
    } catch {
      toast.error("Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    try {
      await api.put(API_ENDPOINTS.ADMIN_ORDER_STATUS(id), { status });
      toast.success("Order status updated — email sent to customer");
      fetchOrder();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Open WhatsApp Web with pre-filled message to customer
  const handleWhatsApp = () => {
    if (!order) return;
    const cust = typeof order.userId === "object" ? (order.userId as User) : null;
    const phone = cust?.phone || order.address?.phone;
    if (!phone) { toast.error("Customer phone number not available"); return; }
    const message = getStatusUpdateMessage({
      orderId: order.orderId,
      customerName: cust?.name || order.address?.fullName || "Customer",
      customerPhone: phone,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items,
    });
    sendWhatsAppNotification(phone, message);
    toast.success("WhatsApp opened — send the message to notify customer");
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
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex flex-col gap-3 mb-6">
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
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-4 rounded-lg border border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Invoice
          </button>
          <button
            onClick={() => {
              downloadProductionSheet({
                orderId: order.orderId,
                customerName: customer?.name || order.address?.fullName || "Customer",
                customerPhone: customer?.phone || order.address?.phone,
                address: order.address || {},
                items: order.items.map((item: any) => ({
                  name: item.name,
                  quantity: item.quantity,
                  price: item.price,
                  image: item.image,
                  customization: item.customization
                    ? Object.fromEntries(
                        item.customization instanceof Map
                          ? item.customization.entries()
                          : Object.entries(item.customization)
                      )
                    : undefined,
                })),
                createdAt: order.createdAt,
              });
            }}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-4 rounded-lg border border-brand-gold text-brand-gold-dark hover:bg-brand-gold hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Production
          </button>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="input-premium text-xs h-9 py-0 px-3"
          >
            {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* WhatsApp update button */}
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-4 rounded-lg bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
            title="Send WhatsApp update to customer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Info */}
        <Card padding="lg">
          <h3 className="text-sm font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-brand-emerald" />
            Customer
          </h3>
          {customer ? (
            <div className="text-sm text-brand-charcoal-medium space-y-1">
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
            Payment
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
                <span>Txn ID</span>
                <span className="font-mono text-xs text-brand-charcoal">
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
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <img
                          src={item.image || "/images/placeholder-product.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-brand-charcoal text-sm line-clamp-1">
                          {item.name}
                        </p>
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mb-1">
                              ✏️ Personalization
                            </p>
                            <div className="space-y-0.5">
                              {Object.entries(item.customization).map(([key, val]) => (
                                <p key={key} className="text-xs text-amber-900">
                                  <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                  <span className="text-amber-600 mx-1">→</span>
                                  <span className="font-semibold">{val}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center text-brand-charcoal-medium">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-right text-brand-charcoal-medium">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 text-right font-medium text-brand-charcoal">
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

      <div className="hidden">
        <div ref={invoiceRef}>
          <Invoice order={order} />
        </div>
      </div>
    </div>
  );
}
