"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Edit3,
  X,
  Plus,
  Trash2,
  Save,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { FullPageSpinner } from "@/components/ui/Spinner";
import useAuth from "@/hooks/useAuth";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Address, Order } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
import Link from "next/link";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Pincode is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, getProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
    reset: resetAddress,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    fetchProfile();
    fetchOrders();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(API_ENDPOINTS.AUTH_PROFILE);
      const data = res.data.data;
      setProfile(data);
      setAddresses(data.addresses || []);
      resetProfile({ name: data.name, phone: data.phone || "" });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get(`${API_ENDPOINTS.ORDERS}?page=1&limit=5`);
      setRecentOrders(res.data.data || []);
    } catch {
      // silent
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    setSavingProfile(true);
    try {
      await api.put(API_ENDPOINTS.AUTH_PROFILE, data);
      toast.success("Profile updated successfully");
      setEditingProfile(false);
      fetchProfile();
      getProfile();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    setSavingAddress(true);
    try {
      const res = await api.post(API_ENDPOINTS.USER_ADDRESSES, data);
      setAddresses(res.data.data || []);
      setShowAddAddress(false);
      resetAddress();
      toast.success("Address added successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  const deleteAddress = async (index: number) => {
    try {
      const res = await api.delete(`${API_ENDPOINTS.USER_ADDRESSES}/${index}`);
      setAddresses(res.data.data || []);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <FullPageSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-cream-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          {/* Profile Header */}
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-emerald-dark to-brand-emerald flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {profile?.name
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
                {profile?.name}
              </h1>
              <p className="text-sm text-brand-charcoal-medium">
                {profile?.email}
              </p>
              <p className="text-xs text-brand-charcoal-light mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Member since {formatDate(profile?.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-brand-charcoal flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-emerald" />
                    Personal Information
                  </h2>
                  {!editingProfile && (
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-lg border border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-white transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {editingProfile ? (
                  <form
                    onSubmit={handleProfileSubmit(onProfileSubmit)}
                    className="space-y-4"
                  >
                    <Input
                      label="Full Name"
                      icon={<User className="w-4 h-4" />}
                      error={profileErrors.name?.message}
                      {...registerProfile("name")}
                    />
                    <div>
                      <label className="block text-sm font-medium text-brand-charcoal mb-1.5">
                        Email Address
                      </label>
                      <div className="input-premium bg-gray-50 text-brand-charcoal-light cursor-not-allowed flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile?.email}
                      </div>
                      <p className="text-xs text-brand-charcoal-light mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <Input
                      label="Phone Number"
                      icon={<Phone className="w-4 h-4" />}
                      error={profileErrors.phone?.message}
                      {...registerProfile("phone")}
                    />
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        size="sm"
                        isLoading={savingProfile}
                      >
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingProfile(false);
                          resetProfile({
                            name: profile?.name,
                            phone: profile?.phone || "",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-4 h-4 text-brand-charcoal-light shrink-0" />
                      <div>
                        <p className="text-xs text-brand-charcoal-light">
                          Full Name
                        </p>
                        <p className="text-sm font-medium text-brand-charcoal">
                          {profile?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-4 h-4 text-brand-charcoal-light shrink-0" />
                      <div>
                        <p className="text-xs text-brand-charcoal-light">
                          Email Address
                        </p>
                        <p className="text-sm font-medium text-brand-charcoal">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-brand-charcoal-light shrink-0" />
                      <div>
                        <p className="text-xs text-brand-charcoal-light">
                          Phone Number
                        </p>
                        <p className="text-sm font-medium text-brand-charcoal">
                          {profile?.phone || "Not added"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              {/* Saved Addresses */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-brand-charcoal flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-emerald" />
                    Saved Addresses
                  </h2>
                  {!showAddAddress && (
                    <button
                      onClick={() => setShowAddAddress(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-lg border border-brand-emerald text-brand-emerald hover:bg-brand-emerald hover:text-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New
                    </button>
                  )}
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <div className="border border-brand-emerald/20 rounded-xl p-5 mb-5 bg-brand-emerald/5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-brand-charcoal">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => {
                          setShowAddAddress(false);
                          resetAddress();
                        }}
                        className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4 text-brand-charcoal-medium" />
                      </button>
                    </div>
                    <form
                      onSubmit={handleAddressSubmit(onAddressSubmit)}
                      className="space-y-3"
                    >
                      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
                        <Input
                          label="Full Name"
                          placeholder="Recipient name"
                          error={addressErrors.fullName?.message}
                          {...registerAddress("fullName")}
                        />
                        <Input
                          label="Phone"
                          placeholder="10-digit phone"
                          error={addressErrors.phone?.message}
                          {...registerAddress("phone")}
                        />
                      </div>
                      <Input
                        label="Address Line 1"
                        placeholder="Street, Building"
                        error={addressErrors.addressLine1?.message}
                        {...registerAddress("addressLine1")}
                      />
                      <Input
                        label="Address Line 2 (Optional)"
                        placeholder="Apartment, Floor"
                        {...registerAddress("addressLine2")}
                      />
                      <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3">
                        <Input
                          label="City"
                          placeholder="City"
                          error={addressErrors.city?.message}
                          {...registerAddress("city")}
                        />
                        <Input
                          label="State"
                          placeholder="State"
                          error={addressErrors.state?.message}
                          {...registerAddress("state")}
                        />
                        <Input
                          label="Pincode"
                          placeholder="Pincode"
                          error={addressErrors.pincode?.message}
                          {...registerAddress("pincode")}
                        />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <Button
                          type="submit"
                          size="sm"
                          isLoading={savingAddress}
                        >
                          Save Address
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowAddAddress(false);
                            resetAddress();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="space-y-3">
                    {addresses.map((addr, idx) => (
                      <div
                        key={addr._id || idx}
                        className="flex items-start justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-cream flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-brand-emerald" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-brand-charcoal">
                              {addr.fullName}
                              {addr.isDefault && (
                                <span className="ml-2 text-[10px] font-semibold text-brand-emerald bg-green-50 px-2 py-0.5 rounded-full uppercase">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-brand-charcoal-medium mt-0.5">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p className="text-sm text-brand-charcoal-medium">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-xs text-brand-charcoal-light mt-1">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAddress(idx)}
                          className="p-2 rounded-lg text-brand-charcoal-light hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-10 h-10 text-brand-charcoal-light mx-auto mb-3" />
                    <p className="text-sm text-brand-charcoal-medium">
                      No saved addresses
                    </p>
                    <p className="text-xs text-brand-charcoal-light mt-1">
                      Add an address to make checkout faster
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card padding="lg">
                <h2 className="text-base font-semibold text-brand-charcoal mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-emerald" />
                  My Activity
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-brand-cream rounded-xl">
                    <p className="text-xl font-bold text-brand-charcoal">
                      {recentOrders.length}
                    </p>
                    <p className="text-xs text-brand-charcoal-medium mt-0.5">
                      Orders
                    </p>
                  </div>
                  <div className="text-center p-3 bg-brand-cream rounded-xl">
                    <p className="text-xl font-bold text-brand-charcoal">
                      {addresses.length}
                    </p>
                    <p className="text-xs text-brand-charcoal-medium mt-0.5">
                      Addresses
                    </p>
                  </div>
                </div>
              </Card>

              {/* Recent Orders */}
              <Card padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-brand-charcoal">
                    Recent Orders
                  </h2>
                  <Link
                    href="/orders"
                    className="text-xs font-semibold text-brand-emerald hover:text-brand-emerald-light transition-colors"
                  >
                    View All
                  </Link>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <Link
                        key={order._id}
                        href={`/orders/${order._id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-brand-charcoal">
                            #{order.orderId}
                          </p>
                          <p className="text-[11px] text-brand-charcoal-light mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-brand-charcoal">
                            {formatPrice(order.totalAmount)}
                          </p>
                          <div className="mt-1">
                            <OrderStatusBadge status={order.status} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-brand-charcoal-light">
                      No orders yet
                    </p>
                    <Link
                      href="/products"
                      className="text-xs font-semibold text-brand-emerald hover:underline mt-1 inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
