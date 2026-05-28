"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Product, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import AdminFilters from "@/components/admin/AdminFilters";
import DataTable, { Column } from "@/components/admin/DataTable";
import Pagination from "@/components/ui/Pagination";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name: A-Z", value: "name_asc" },
  { label: "Name: Z-A", value: "name_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Stock: Low to High", value: "stock_asc" },
  { label: "Stock: High to Low", value: "stock_desc" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch categories
  useEffect(() => {
    api
      .get(API_ENDPOINTS.CATEGORIES)
      .then((res) => setCategories(res.data.data || []))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, [page, sort, search, statusFilter, categoryFilter, stockFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: ITEMS_PER_PAGE,
        sort,
      };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.isActive = statusFilter;

      const response = await api.get(API_ENDPOINTS.PRODUCTS, { params });
      let fetchedProducts = response.data.data || [];
      
      // Apply stock filter locally
      if (stockFilter === "in_stock") {
        fetchedProducts = fetchedProducts.filter((p: Product) => p.stock > 0);
      } else if (stockFilter === "out_of_stock") {
        fetchedProducts = fetchedProducts.filter((p: Product) => p.stock === 0);
      } else if (stockFilter === "low_stock") {
        fetchedProducts = fetchedProducts.filter((p: Product) => p.stock > 0 && p.stock <= 10);
      }

      setProducts(fetchedProducts);
      setTotalItems(response.data.pagination?.total || fetchedProducts.length);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(API_ENDPOINTS.ADMIN_PRODUCT_BY_ID(id));
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
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

  // Apply client-side sorting if sortKey is set
  const sortedProducts = useMemo(() => {
    if (!sortKey) return products;

    return [...products].sort((a, b) => {
      let aValue: any = (a as any)[sortKey];
      let bValue: any = (b as any)[sortKey];

      // Handle nested category name
      if (sortKey === "category") {
        aValue = typeof a.categoryId === "object" ? a.categoryId.name : "";
        bValue = typeof b.categoryId === "object" ? b.categoryId.name : "";
      }

      if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [products, sortKey, sortDirection]);

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Product",
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-3">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-brand-charcoal-light" />
            </div>
          )}
          <div>
            <p className="font-medium text-brand-charcoal">{product.name}</p>
            <p className="text-xs text-brand-charcoal-light">ID: {product._id.slice(-8)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (product) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-brand-emerald/10 text-brand-emerald text-xs font-medium">
          {typeof product.categoryId === "object" ? product.categoryId.name : "N/A"}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (product) => (
        <div>
          <p className="font-semibold text-brand-charcoal">{formatPrice(product.price)}</p>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <p className="text-xs text-brand-charcoal-light line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (product) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
            product.stock === 0
              ? "bg-red-100 text-red-800"
              : product.stock <= 10
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {product.stock} units
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (product) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
            product.isActive
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product._id}`}
            target="_blank"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4 text-brand-charcoal-medium" />
          </Link>
          <Link
            href={`/admin/products/${product._id}`}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </Link>
          <button
            onClick={() => handleDelete(product._id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
      className: "text-right",
    },
  ];

  const activeFilterCount = [search, statusFilter, categoryFilter, stockFilter].filter(Boolean).length;

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCategoryFilter("");
    setStockFilter("");
    setPage(1);
  };

  const handleExport = () => {
    // Export to CSV
    const headers = ["Name", "Category", "Price", "Stock", "Status"];
    const rows = products.map((p) => [
      p.name,
      typeof p.categoryId === "object" ? p.categoryId.name : "",
      p.price,
      p.stock,
      p.isActive ? "Active" : "Inactive",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Products exported successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">Products</h1>
          <p className="text-sm text-brand-charcoal-light mt-1">
            Manage your product inventory ({totalItems} total)
          </p>
        </div>
        <Link href="/admin/products/new" className="self-start sm:self-auto">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <AdminFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by product name, description..."
        sortValue={sort}
        onSortChange={setSort}
        sortOptions={SORT_OPTIONS}
        statusValue={statusFilter}
        onStatusChange={setStatusFilter}
        statusOptions={STATUS_OPTIONS}
        onExport={handleExport}
        activeFilterCount={activeFilterCount}
        onClearFilters={handleClearFilters}
        extraFilters={
          <>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald bg-white w-full sm:w-auto"
            >
              <option value="">All Stock</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock (≤10)</option>
            </select>
          </>
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={sortedProducts}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        loading={loading}
        emptyMessage="No products found. Try adjusting your filters or add a new product."
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
