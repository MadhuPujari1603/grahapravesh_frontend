"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X, Star } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import toast from "react-hot-toast";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = !!editId;

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (editId) {
      api
        .get(API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(editId))
        .then((res) => {
          const cat = res.data.data;
          reset({ name: cat.name, description: cat.description || "" });
          if (cat.imageUrl) setImagePreview(cat.imageUrl);
          if (cat.isFeatured) setIsFeatured(true);
        })
        .catch(() => toast.error("Failed to load category"))
        .finally(() => setLoading(false));
    }
  }, [editId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (image) formData.append("image", image);
      formData.append("isFeatured", String(isFeatured));

      if (isEditing) {
        await api.put(
          API_ENDPOINTS.ADMIN_CATEGORY_BY_ID(editId!),
          formData
        );
        toast.success("Category updated successfully");
      } else {
        await api.post(API_ENDPOINTS.ADMIN_CATEGORIES, formData);
        toast.success("Category created successfully");
      }
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to save category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Categories
      </Link>

      <h1 className="text-2xl font-bold text-brand-charcoal mb-6">
        {isEditing ? "Edit Category" : "Add New Category"}
      </h1>

      <div className="max-w-xl">
        <Card padding="lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Category Name"
              placeholder="e.g., Electronics"
              error={errors.name?.message}
              {...register("name")}
            />

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                Description (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe this category..."
                className="input-premium resize-none"
                {...register("description")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                Category Image
              </label>
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand-emerald hover:bg-green-50 transition-colors">
                  <Upload className="w-8 h-8 text-brand-charcoal-light mb-2" />
                  <span className="text-sm text-brand-charcoal-light">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-amber-50/50">
              <div>
                <p className="text-sm font-semibold text-brand-charcoal flex items-center gap-2">
                  <Star className={`w-4 h-4 ${isFeatured ? "fill-amber-500 text-amber-500" : "text-brand-charcoal-light"}`} />
                  Featured Category
                </p>
                <p className="text-xs text-brand-charcoal-light mt-0.5">
                  Featured categories appear in the homepage scroll strip
                </p>
              </div>
              <Toggle
                checked={isFeatured}
                onChange={setIsFeatured}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" size="lg" isLoading={submitting}>
                {isEditing ? "Update Category" : "Create Category"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => router.push("/admin/categories")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
