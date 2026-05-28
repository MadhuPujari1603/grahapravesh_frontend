"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, Phone, MapPin, DollarSign, ShoppingBag, Users } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import AdminFilters from "@/components/admin/AdminFilters";
import DataTable, { Column } from "@/components/admin/DataTable";
import Pagination from "@/components/ui/Pagination";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 15;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name: A-Z", value: "name_asc" },
  { label: "Name: Z-A", value: "name_desc" },
  { label: "Orders: High to Low", value: "orders_desc" },
  { label: "Orders: Low to High", value: "orders_asc" },
  { label: "Spent: High to Low", value: "spent_desc" },
  { label: "Spent: Low to High", value: "spent_asc" },
];

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  addresses: any[];
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchCustomers();
  }, [page, search, sort]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: ITEMS_PER_PAGE,
      };
      if (search) params.search = search;

      const response = await api.get(API_ENDPOINTS.ADMIN_CUSTOMERS, { params });
      const fetchedCustomers = response.data.data?.customers || response.data.data || [];
      
      setCustomers(fetchedCustomers);
      setTotalItems(response.data.data?.pagination?.total || response.data.pagination?.total || fetchedCustomers.length);
    } catch (error) {
      toast.error("Failed to load customers");
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

  const sortedCustomers = useMemo(() => {
    if (!sortKey) return customers;

    return [...customers].sort((a, b) => {
      let aValue: any = (a as any)[sortKey];
      let bValue: any = (b as any)[sortKey];

      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [customers, sortKey, sortDirection]);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Customer",
      sortable: true,
      render: (customer) => (
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-emerald flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-brand-charcoal">{customer.name}</p>
              <div className="flex items-center gap-1 text-xs text-brand-charcoal-light">
                <Mail className="w-3 h-3" />
                {customer.email}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Contact",
      render: (customer) => (
        <div className="space-y-1">
          {customer.phone && (
            <div className="flex items-center gap-1 text-sm text-brand-charcoal-medium">
              <Phone className="w-3 h-3" />
              {customer.phone}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-brand-charcoal-light">
            <MapPin className="w-3 h-3" />
            {customer.addresses?.length || 0} address(es)
          </div>
        </div>
      ),
    },
    {
      key: "orderCount",
      label: "Orders",
      sortable: true,
      render: (customer) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-sm font-medium">
          {customer.orderCount || 0}
        </span>
      ),
    },
    {
      key: "totalSpent",
      label: "Total Spent",
      sortable: true,
      render: (customer) => (
        <p className="font-semibold text-brand-emerald">
          {formatPrice(customer.totalSpent || 0)}
        </p>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      render: (customer) => (
        <p className="text-sm text-brand-charcoal-medium">
          {new Date(customer.createdAt).toLocaleDateString()}
        </p>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (customer) => (
        <div className="flex items-center gap-2 justify-end">
          <Link
            href={`/admin/customers/${customer._id}`}
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

  const handleClearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const handleExport = () => {
    const headers = ["Name", "Email", "Phone", "Orders", "Total Spent", "Joined"];
    const rows = customers.map((c) => [
      c.name,
      c.email,
      c.phone || "",
      c.orderCount || 0,
      c.totalSpent || 0,
      new Date(c.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Customers exported successfully");
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgOrderValue = customers.reduce((sum, c) => sum + (c.orderCount || 0), 0);
    const activeCustomers = customers.filter((c) => (c.orderCount || 0) > 0).length;

    return { totalRevenue, avgOrderValue, activeCustomers };
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">Customers</h1>
        <p className="text-sm text-brand-charcoal-light mt-1">
          Manage customer accounts and view purchase history ({totalItems} total)
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
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Total Customer Value</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <DollarSign className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-emerald-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Total Orders</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.avgOrderValue}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
        <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-white/50 overflow-hidden transition-all duration-200 backdrop-blur-sm hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-brand-charcoal-medium group-hover:text-brand-charcoal transition-colors duration-300">Active Customers</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent mt-1.5 group-hover:scale-105 transition-transform duration-300 origin-left">{stats.activeCustomers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/20 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Users className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-purple-600 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
        </div>
      </div>

      {/* Filters */}
      <AdminFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or phone..."
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        onExport={handleExport}
        activeFilterCount={search ? 1 : 0}
        onClearFilters={handleClearFilters}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedCustomers}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRowClick={(customer) => router.push(`/admin/customers/${customer._id}`)}
        loading={loading}
        emptyMessage="No customers found. Try adjusting your search."
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
