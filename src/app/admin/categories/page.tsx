"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Grid3X3, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Category } from "@/types";
import toast from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ADMIN_CATEGORIES);
      setCategories(res.data.data || []);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleFeatured = async (id: string) => {
    try {
      await api.patch(API_ENDPOINTS.CATEGORY_TOGGLE_FEATURED(id));
      toast.success("Category updated");
      fetchCategories();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(deleteId));
      toast.success("Category deleted");
      setDeleteId(null);
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal">Categories</h1>
          <p className="text-sm text-brand-charcoal-medium mt-1">
            Manage product categories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button icon={<Plus className="w-4 h-4" />}>Add Category</Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={<Grid3X3 className="w-16 h-16" />}
          title="No Categories"
          description="Create your first category to organize your products."
          actionLabel="Add Category"
          onAction={() => (window.location.href = "/admin/categories/new")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category._id} padding="none" hover>
              <div className="relative h-40 overflow-hidden rounded-t-xl bg-gray-100">
                <img
                  src={
                    category.imageUrl ||
                    "/images/placeholder-category.svg"
                  }
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <p className="text-xs text-white/80">
                      {category.productCount} products
                    </p>
                  )}
                </div>
              </div>
                <div className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-charcoal-medium line-clamp-1">
                    {category.description || "No description"}
                  </p>
                  {category.isFeatured && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1">
                      <Star className="w-2.5 h-2.5 fill-amber-500" /> Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-4">
                  <button
                    onClick={() => handleToggleFeatured(category._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      category.isFeatured
                        ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                        : "text-brand-charcoal-light hover:text-amber-500 hover:bg-amber-50"
                    }`}
                    title={category.isFeatured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className={`w-4 h-4 ${category.isFeatured ? "fill-amber-500" : ""}`} />
                  </button>
                  <Link href={`/admin/categories/new?edit=${category._id}`}>
                    <button className="p-2 rounded-lg text-brand-charcoal-light hover:text-brand-emerald hover:bg-green-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteId(category._id)}
                    className="p-2 rounded-lg text-brand-charcoal-light hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Category"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-brand-charcoal-medium">
          Are you sure you want to delete this category? Products in this
          category will be uncategorized.
        </p>
      </Modal>
    </div>
  );
}
