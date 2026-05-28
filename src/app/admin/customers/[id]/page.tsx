"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  IndianRupee,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Order, Address } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

interface CustomerDetail {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  addresses: Address[];
  createdAt: string;
}

export default function AdminCustomerDetailPage() {
  const { id } = useParams() as { id: string };
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get(`${API_ENDPOINTS.ADMIN_CUSTOMERS}/${id}`)
      .then((res) => {
        const data = res.data.data;
        setCustomer(data.customer);
        setOrders(data.orders || []);
        setStats(data.stats || { totalOrders: 0, totalSpent: 0 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <FullPageSpinner />;

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-brand-charcoal-medium">Customer not found</p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </Link>

      {/* Customer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-brand-emerald flex items-center justify-center shrink-0">
          <span className="text-white text-xl font-bold">
            {customer.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">
            {customer.name}
          </h1>
          <p className="text-sm text-brand-charcoal-medium">
            Customer since {formatDate(customer.createdAt)}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-brand-charcoal-light">Total Orders</p>
              <p className="text-xl font-bold text-brand-charcoal">
                {stats.totalOrders}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-brand-charcoal-light">Total Spent</p>
              <p className="text-xl font-bold text-brand-charcoal">
                {formatPrice(stats.totalSpent)}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-brand-charcoal-light">
                Saved Addresses
              </p>
              <p className="text-xl font-bold text-brand-charcoal">
                {customer.addresses?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Contact & Addresses */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card padding="lg">
            <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-brand-emerald" />
              Contact Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-brand-charcoal-medium">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-charcoal-medium">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{customer.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-charcoal-medium">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Joined {formatDate(customer.createdAt)}</span>
              </div>
            </div>
          </Card>

          {/* Addresses */}
          <Card padding="lg">
            <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-emerald" />
              Saved Addresses
            </h2>
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    className="p-3 bg-gray-50 rounded-lg text-sm text-brand-charcoal-medium"
                  >
                    <p className="font-medium text-brand-charcoal">
                      {addr.fullName}
                    </p>
                    <p>{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    <p>
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs mt-1">Phone: {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="inline-block mt-1 text-[10px] font-semibold text-brand-emerald uppercase">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-charcoal-light">
                No saved addresses
              </p>
            )}
          </Card>
        </div>

        {/* Right: Orders */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-brand-charcoal flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-emerald" />
                Order History ({orders.length})
              </h2>
            </div>

            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                        Order ID
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                        Date
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                        Status
                      </th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                        Payment
                      </th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-medium text-brand-charcoal hover:text-brand-emerald transition-colors"
                          >
                            #{order.orderId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-brand-charcoal-medium">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <PaymentStatusBadge status={order.paymentStatus} />
                            <span className="text-[10px] text-brand-charcoal-light capitalize">
                              {order.paymentMethod === "cod"
                                ? "Cash on Delivery"
                                : "Online"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-brand-charcoal">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-6 py-12 text-center text-brand-charcoal-light">
                No orders yet
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
