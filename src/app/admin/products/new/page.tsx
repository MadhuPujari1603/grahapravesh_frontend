"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { KeyFeaturesEditor, SpecificationsEditor } from "@/components/admin/ProductExtrasEditor";
import { CustomizationFieldsEditor } from "@/components/admin/CustomizationFieldsEditor";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Category, KeyFeature, Specification, CustomizationField } from "@/types";
import toast from "react-hot-toast";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  comparePrice: z.coerce.number().optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  isFeatured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [customizationFields, setCustomizationFields] = useState<CustomizationField[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { isFeatured: false, stock: 0 },
  });

  useEffect(() => {
    api
      .get(API_ENDPOINTS.CATEGORIES)
      .then((res) => setCategories(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    // Validate extras
    const invalidFeature = keyFeatures.find(
      (f) => !(f.title || "").trim() || !(f.description || "").trim()
    );
    if (invalidFeature) {
      toast.error("Please fill in all key feature title and description fields.");
      return;
    }
    const invalidSpec = specifications.find(
      (s) => !(s.label || "").trim() || !(s.value || "").trim()
    );
    if (invalidSpec) {
      toast.error("Please fill in all specification label and value fields.");
      return;
    }

    // Validate customization fields before submitting
    if (isCustomizable && customizationFields.length > 0) {
      for (let i = 0; i < customizationFields.length; i++) {
        const cf = customizationFields[i];
        if (!cf.label.trim()) {
          toast.error(`Personalization field #${i + 1}: Label is required`);
          return;
        }
        if (!cf.fieldName.trim()) {
          toast.error(`Personalization field #${i + 1}: Field ID is required`);
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      if (data.comparePrice) formData.append("compareAtPrice", String(data.comparePrice));
      formData.append("categoryId", data.category);
      formData.append("stock", String(data.stock));
      formData.append("isFeatured", String(data.isFeatured || false));
      formData.append("keyFeatures", JSON.stringify(keyFeatures));
      formData.append("specifications", JSON.stringify(specifications));
      formData.append("isCustomizable", String(isCustomizable));
      formData.append("customizationFields", JSON.stringify(isCustomizable ? customizationFields : []));
      images.forEach((file) => formData.append("images", file));

      await api.post(API_ENDPOINTS.ADMIN_PRODUCTS, formData);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-brand-charcoal mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic info */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
                Product Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe your product..."
                    className="input-premium resize-none"
                    {...register("description")}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Price (INR)"
                  type="number"
                  placeholder="0"
                  error={errors.price?.message}
                  {...register("price")}
                />
                <Input
                  label="Compare at Price (INR)"
                  type="number"
                  placeholder="0"
                  helperText="Original price for showing discount"
                  error={errors.comparePrice?.message}
                  {...register("comparePrice")}
                />
              </div>
            </Card>

            {/* Images */}
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-brand-charcoal mb-4">
                Product Images
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-emerald hover:bg-green-50 transition-colors">
                  <Upload className="w-6 h-6 text-brand-charcoal-light mb-1" />
                  <span className="text-xs text-brand-charcoal-light">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </Card>

            {/* Key Features */}
            <Card padding="lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-brand-charcoal">Key Features</h2>
                <p className="text-sm text-brand-charcoal-medium mt-0.5">
                  Highlight what makes this product stand out. Shown as icon cards on the product page.
                </p>
              </div>
              <KeyFeaturesEditor value={keyFeatures} onChange={setKeyFeatures} />
            </Card>

            {/* Specifications */}
            <Card padding="lg">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-brand-charcoal">Specifications</h2>
                <p className="text-sm text-brand-charcoal-medium mt-0.5">
                  Technical details shown in a table on the product page (e.g. weight, material, dimensions).
                </p>
              </div>
              <SpecificationsEditor value={specifications} onChange={setSpecifications} />
            </Card>

            {/* Customization */}
            <Card padding="lg">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">Personalization</h2>
                    <p className="text-sm text-brand-charcoal-medium mt-0.5">
                      Let customers add custom text (name, flat number, etc.) for personalised products.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCustomizable(!isCustomizable)}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none shrink-0 ${
                      isCustomizable ? "bg-brand-emerald" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        isCustomizable ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {isCustomizable && (
                <CustomizationFieldsEditor
                  value={customizationFields}
                  onChange={setCustomizationFields}
                />
              )}
              {!isCustomizable && (
                <p className="text-sm text-brand-charcoal-light text-center py-4">
                  Toggle on to add personalization fields for this product.
                </p>
              )}
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-lg font-semibold text-brand-charcoal mb-4">Organization</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                    Category
                  </label>
                  <select className="input-premium" {...register("category")}>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                  )}
                </div>
                <Input
                  label="Stock Quantity"
                  type="number"
                  placeholder="0"
                  error={errors.stock?.message}
                  {...register("stock")}
                />
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-brand-emerald rounded"
                    {...register("isFeatured")}
                  />
                  <span className="text-sm font-medium text-brand-charcoal">Featured Product</span>
                </label>
              </div>
            </Card>

            {/* Preview panel */}
            {(keyFeatures.length > 0 || specifications.length > 0) && (
              <Card padding="lg">
                <h3 className="text-sm font-semibold text-brand-charcoal mb-3">
                  Preview
                </h3>
                {keyFeatures.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-brand-charcoal-light uppercase tracking-wider mb-2">
                      Key Features ({keyFeatures.length})
                    </p>
                    <div className="space-y-2">
                      {keyFeatures.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <span>{f.icon}</span>
                          <span className="font-medium text-brand-charcoal">{f.title || "Untitled"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {specifications.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-brand-charcoal-light uppercase tracking-wider mb-2">
                      Specifications ({specifications.length})
                    </p>
                    <div className="space-y-1.5">
                      {specifications.map((s, i) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <span className="text-brand-charcoal-light min-w-[80px]">{s.label || "—"}</span>
                          <span className="font-medium text-brand-charcoal">{s.value || "—"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            <Button type="submit" fullWidth size="lg" isLoading={submitting}>
              Create Product
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
