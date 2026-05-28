"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Download, DollarSign, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { API_ENDPOINTS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, PAYMENT_STATUS_COLORS } from "@/lib/constants";
import { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import AdminFilters from "@/components/admin/AdminFilters";
import DataTable, { Column } from "@/components/admin/DataTable";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 15;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Amount: High to Low", value: "amount_desc" },
  { label: "Amount: Low to High", value: "amount_asc" },
];

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: "Cash on Delivery", value: "cod" },
  { label: "Razorpay", value: "razorpay" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchOrders();
  }, [page, sort, search, statusFilter, paymentStatusFilter, paymentMethodFilter, dateRange]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: ITEMS_PER_PAGE,
        sort,
      };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;

      const response = await api.get(API_ENDPOINTS.ADMIN_ORDERS, { params });
      let fetchedOrders = response.data.data || [];

      // Apply payment method filter locally
      if (paymentMethodFilter) {
        fetchedOrders = fetchedOrders.filter((o: Order) => o.paymentMethod === paymentMethodFilter);
      }

      // Apply date range filter locally
      if (dateRange.from) {
        fetchedOrders = fetchedOrders.filter((o: Order) => 
          new Date(o.createdAt) >= new Date(dateRange.from)
        );
      }
      if (dateRange.to) {
        fetchedOrders = fetchedOrders.filter((o: Order) => 
          new Date(o.createdAt) <= new Date(dateRange.to + "T23:59:59")
        );
      }

      setOrders(fetchedOrders);
      setTotalItems(response.data.pagination?.total || fetchedOrders.length);
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedOrders = useMemo(() => {
    if (!sortKey) return orders;

    return [...orders].sort((a, b) => {
      let aValue: any = (a as any)[sortKey];
      let bValue: any = (b as any)[sortKey];

      // Handle customer name
      if (sortKey === "customer") {
        aValue = typeof a.userId === "object" ? a.userId.name : "";
        bValue = typeof b.userId === "object" ? b.userId.name : "";
      }

      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [orders, sortKey, sortDirection]);

  const columns: Column<Order>[] = [
    {
      key: "orderId",
      label: "Order ID",
      sortable: true,
      render: (order) => (
        <div>
          <p className="font-semibold text-brand-charcoal">{order.orderId}</p>
          <p className="text-xs text-brand-charcoal-light">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Customer",
      sortable: true,
      render: (order) => (
        <div>
          <p className="font-medium text-brand-charcoal">
            {typeof order.userId === "object" ? order.userId.name : "N/A"}
          </p>
          <p className="text-xs text-brand-charcoal-light">
            {typeof order.userId === "object" ? order.userId.email : ""}
          </p>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Amount",
      sortable: true,
      render: (order) => (
        <p className="font-semibold text-brand-emerald">
          {formatPrice(order.totalAmount)}
        </p>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (order) => (
        <div>
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
            {order.paymentStatus.toUpperCase()}
          </span>
          <p className="text-xs text-brand-charcoal-light mt-1">
            {order.paymentMethod === "cod" ? "COD" : "Online"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (order) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (order) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/orders/${order._id}`}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Link>
        </div>
      ),
      className: "text-right",
    },
  ];

  const activeFilterCount = [
    search,
    statusFilter,
    paymentStatusFilter,
    paymentMethodFilter,
    dateRange.from,
    dateRange.to,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPaymentMethodFilter("");
    setDateRange({ from: "", to: "" });
    setPage(1);
  };

  const handleExport = () => {
    const headers = ["Order ID", "Customer", "Amount", "Payment Method", "Payment Status", "Order Status", "Date"];
    const rows = orders.map((o) => [
      o.orderId,
      typeof o.userId === "object" ? o.userId.name : "",
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.status,
      new Date(o.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Orders exported successfully");
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.totalAmount : 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "delivered").length;

    return { totalRevenue, pendingOrders, completedOrders };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">Orders</h1>
        <p className="text-sm text-brand-charcoal-light mt-1">
          Manage customer orders and fulfillment ({totalItems} total)
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Total Revenue</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Pending Orders</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Clock className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Completed Orders</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.completedOrders}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-500 to-green-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
      </div>

      {/* Filters */}
      <AdminFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by order ID, customer name, email..."
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
        activeFilterCount={activeFilterCount}
        onClearFilters={handleClearFilters}
        extraFilters={
          <>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white w-full sm:w-auto"
            >
              <option value="">All Payment Status</option>
              {PAYMENT_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white w-full sm:w-auto"
            >
              <option value="">All Payment Methods</option>
              {PAYMENT_METHOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedOrders}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(order) => router.push(`/admin/orders/${order._id}`)}
        loading={loading}
        emptyMessage="No orders found. Try adjusting your filters."
      />

      {/* Pagination */}
      {!loading && totalItems > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalItems / ITEMS_PER_PAGE)}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
