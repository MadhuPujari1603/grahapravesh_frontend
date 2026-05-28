"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/ui/Badge";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS, ORDER_STATUS_LABELS } from "@/lib/constants";
import { DashboardStats } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.ADMIN_DASHBOARD)
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <FullPageSpinner />;

  const statCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/20",
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-gradient-to-br from-brand-emerald to-brand-emerald-dark",
      shadow: "shadow-emerald-500/20",
    },
    {
      label: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/20",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      gradient: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100/50",
      iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
      shadow: "shadow-amber-500/20",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">Dashboard</h1>
        <p className="text-sm text-brand-charcoal-medium mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={card.label}
            className={`group relative rounded-xl p-5 border overflow-hidden transition-all duration-200`}
            style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)', animationDelay: `${index * 100}ms` }}
          >
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            <div className="relative flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">
                  {card.label}
                </p>
                <p className={`text-xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left`}>
                  {card.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} ${card.shadow} shadow-lg text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
              >
                <card.icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border overflow-hidden" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white group-hover:from-brand-emerald/5 group-hover:to-transparent transition-colors duration-500">
              <h2 className="text-base font-semibold text-brand-charcoal flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-emerald" />
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-sm text-brand-emerald hover:text-brand-emerald-dark transition-all duration-300 hover:gap-2 group/link"
              >
                View All <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Order
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Status
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-brand-charcoal-light uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.slice(0, 5).map((order, index) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-brand-emerald/5 hover:to-transparent transition-all duration-300 group/row"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="font-medium text-brand-charcoal hover:text-brand-emerald transition-colors group-hover/row:translate-x-1 inline-block transform duration-300"
                          >
                            #{order.orderId}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-brand-charcoal-medium group-hover/row:text-brand-charcoal transition-colors duration-300">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-brand-emerald group-hover/row:scale-105 inline-block transform transition-transform duration-300">
                          {formatPrice(order.totalAmount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-brand-charcoal-light"
                      >
                        No recent orders
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="rounded-xl border p-5" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
          <h2 className="text-lg font-semibold text-brand-charcoal mb-5 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-emerald-dark flex items-center justify-center shadow-lg shadow-brand-emerald/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="group-hover:text-brand-emerald-dark transition-colors duration-300">Orders by Status</span>
          </h2>

          {stats?.ordersByStatus ? (
            <div className="space-y-4">
              {Object.entries(stats.ordersByStatus).map(([status, count], index) => {
                const total = Object.values(stats.ordersByStatus).reduce(
                  (a, b) => a + b,
                  0
                );
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colorMap: Record<string, { bar: string; gradient: string; shadow: string }> = {
                  pending: { bar: "bg-yellow-400", gradient: "from-yellow-400 to-yellow-500", shadow: "shadow-yellow-400/30" },
                  confirmed: { bar: "bg-blue-400", gradient: "from-blue-400 to-blue-500", shadow: "shadow-blue-400/30" },
                  processing: { bar: "bg-purple-400", gradient: "from-purple-400 to-purple-500", shadow: "shadow-purple-400/30" },
                  shipped: { bar: "bg-indigo-400", gradient: "from-indigo-400 to-indigo-500", shadow: "shadow-indigo-400/30" },
                  delivered: { bar: "bg-green-400", gradient: "from-green-400 to-green-500", shadow: "shadow-green-400/30" },
                  cancelled: { bar: "bg-red-400", gradient: "from-red-400 to-red-500", shadow: "shadow-red-400/30" },
                };
                const colors = colorMap[status] || { bar: "bg-gray-400", gradient: "from-gray-400 to-gray-500", shadow: "shadow-gray-400/30" };

                return (
                  <div key={status} className="group/chart" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-brand-charcoal-medium capitalize group-hover/chart:text-brand-charcoal transition-colors duration-300 font-medium">
                        {ORDER_STATUS_LABELS[status] || status}
                      </span>
                      <span className="font-bold text-brand-charcoal group-hover/chart:scale-110 inline-block transform transition-transform duration-300">
                        {count}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.shadow} transition-all duration-1000 ease-out group-hover/chart:scale-105 origin-left`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-brand-charcoal-light">
                No data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
