"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, IndianRupee, CheckCircle, Clock, XCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import { PaymentStatusBadge } from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    codOrders: 0,
    paidOrders: 0,
    pendingOrders: 0,
  });

  const fetchOrders = async (pg: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get(
        `${API_ENDPOINTS.ADMIN_ORDERS}?page=${pg}&limit=15`
      );
      const allOrders: Order[] = res.data.data || [];
      setOrders(allOrders);
      setTotalPages(res.data.pagination?.totalPages || 1);

      // Calculate stats from current page (for display)
      const cod = allOrders.filter((o) => o.paymentMethod === "cod").length;
      const paid = allOrders.filter((o) => o.paymentStatus === "paid").length;
      const pending = allOrders.filter((o) => o.paymentStatus === "pending").length;
      const revenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      setStats({ totalRevenue: revenue, codOrders: cod, paidOrders: paid, pendingOrders: pending });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-charcoal">Payments</h1>
        <p className="text-sm text-brand-charcoal-medium mt-1">
          Track all order payments
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Page Revenue</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <IndianRupee className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">COD Orders</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.codOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <CreditCard className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Paid</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.paidOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 to-green-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Pending</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Clock className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-xl border overflow-hidden backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Order
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Method
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-brand-charcoal uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order, index) => {
                const customer =
                  typeof order.userId === "object"
                    ? (order.userId as any)
                    : null;
                return (
                  <tr
                    key={order._id}
                    className="hover:bg-gradient-to-r hover:from-brand-emerald/5 hover:via-transparent hover:to-transparent transition-all duration-300 group/row border-l-2 border-transparent hover:border-brand-emerald"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/payments/${order._id}`}
                        className="font-medium text-brand-charcoal hover:text-brand-emerald transition-colors group-hover/row:translate-x-1 inline-block transform duration-300"
                      >
                        #{order.orderId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-brand-charcoal-medium group-hover/row:text-brand-charcoal transition-colors duration-300">
                      {customer?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-brand-charcoal-medium group-hover/row:text-brand-charcoal transition-colors duration-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-brand-charcoal capitalize group-hover/row:bg-gray-200 transition-colors duration-300">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : "Online"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-brand-emerald group-hover/row:scale-105 inline-block transform transition-transform duration-300">
                      {formatPrice(order.totalAmount)}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-3">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-brand-charcoal-light">No payments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
