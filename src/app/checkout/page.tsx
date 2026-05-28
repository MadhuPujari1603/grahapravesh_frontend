"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, MapPin, CreditCard, Banknote, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Address } from "@/types";
import toast from "react-hot-toast";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any>(null);
  const [placing, setPlacing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [isAuthenticated, items.length, router, orderSuccess]);

  // Load saved addresses from user profile
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get(API_ENDPOINTS.AUTH_PROFILE)
        .then((res) => {
          const addresses = res.data.data?.addresses || [];
          setSavedAddresses(addresses);
          if (addresses.length > 0) {
            const defaultAddr =
              addresses.find((a: Address) => a.isDefault) || addresses[0];
            setSelectedAddress(defaultAddr);
          } else {
            setShowNewAddress(true);
          }
        })
        .catch(() => {
          setShowNewAddress(true);
        });
    }
  }, [isAuthenticated]);

  const total = cartTotal();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  const handleAddressSubmit = async (data: AddressFormData) => {
    try {
      const res = await api.post(API_ENDPOINTS.USER_ADDRESSES, data);
      const updatedAddresses = res.data.data || [];
      setSavedAddresses(updatedAddresses);
      // Select the newly added address (last one)
      const newAddr = updatedAddresses[updatedAddresses.length - 1];
      setSelectedAddress(newAddr);
      setShowNewAddress(false);
      reset();
      toast.success("Address saved");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  // ── Dynamically load Razorpay SDK ──
  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  // ── COD: straight to order ──
  const placeCodOrder = async () => {
    setPlacing(true);
    try {
      const res = await api.post(API_ENDPOINTS.ORDERS, {
        shippingAddress: selectedAddress,
        paymentMethod: "cod",
      });
      setSuccessOrder(res.data.data);
      setOrderSuccess(true);
      await clearCart();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  // ── Razorpay: create → popup → verify ──
  const placeRazorpayOrder = async () => {
    setPlacing(true);
    try {
      // 1. Load SDK
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load payment gateway. Check your connection.");
        setPlacing(false);
        return;
      }

      // 2. Create Razorpay order on backend
      const payRes = await api.post(API_ENDPOINTS.PAYMENT_CREATE, { amount: grandTotal });
      const { razorpayOrderId, keyId, amount: rzpAmount } = payRes.data.data;

      // 3. Create our internal Order (paymentStatus = pending until verified)
      const orderRes = await api.post(API_ENDPOINTS.ORDERS, {
        shippingAddress: selectedAddress,
        paymentMethod: "razorpay",
      });
      const order = orderRes.data.data;

      // 4. Open Razorpay checkout popup
      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: rzpAmount,
        currency: "INR",
        name: "Graha Pravesh",
        description: "Premium Home Essentials",
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#0a3d2e" },
        handler: async (response: any) => {
          try {
            // 5. Verify signature — backend also sets Order.paymentStatus = paid
            await api.post(API_ENDPOINTS.PAYMENT_VERIFY, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            setSuccessOrder({ ...order, paymentStatus: "paid" });
            setOrderSuccess(true);
            await clearCart();
          } catch {
            toast.error(
              "Payment verification failed. Contact support with Order ID: " +
                order.orderId
            );
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled. Your order was not placed.");
            setPlacing(false);
          },
        },
      });
      rzp.open();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to initiate payment");
      setPlacing(false);
    }
  };

  // ── Dispatcher ──
  const placeOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select or add a shipping address");
      return;
    }
    if (paymentMethod === "cod") {
      placeCodOrder();
    } else {
      placeRazorpayOrder();
    }
  };

  if (orderSuccess && successOrder) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-brand-cream-light">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center shadow-lg animate-fade-in">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-brand-charcoal mb-2">
                Thank You for Your Order!
              </h1>
              <p className="text-brand-charcoal-medium">
                Your order has been placed successfully
              </p>
            </div>

            {/* Order Card */}
            <Card padding="none" className="overflow-hidden mb-6">
              {/* Card Header */}
              <div className="bg-brand-emerald-dark px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-200 text-xs uppercase tracking-wider">
                      Order Number
                    </p>
                    <p className="text-white text-lg font-bold mt-0.5">
                      #{successOrder.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-200 text-xs uppercase tracking-wider">
                      Total Amount
                    </p>
                    <p className="text-brand-gold text-xl font-bold mt-0.5">
                      {formatPrice(successOrder.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider mb-3">
                  Items Ordered
                </p>
                <div className="space-y-3">
                  {successOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                          <img
                            src={item.image || "/images/placeholder-product.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-brand-charcoal line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-brand-charcoal-light">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-brand-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details Grid */}
              <div className="px-6 py-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider mb-1">
                    Payment Method
                  </p>
                  <p className="text-sm font-medium text-brand-charcoal">
                    {successOrder.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider mb-1">
                    Order Status
                  </p>
                  <p className="text-sm font-medium text-brand-charcoal capitalize">
                    {successOrder.status}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-brand-charcoal-light uppercase tracking-wider mb-1">
                    Shipping Address
                  </p>
                  <p className="text-sm text-brand-charcoal">
                    {successOrder.address?.fullName},{" "}
                    {successOrder.address?.addressLine1},{" "}
                    {successOrder.address?.city},{" "}
                    {successOrder.address?.state} -{" "}
                    {successOrder.address?.pincode}
                  </p>
                </div>
              </div>

              {/* Gold accent bar */}
              <div className="h-1 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light" />
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                fullWidth
                size="lg"
                onClick={() => router.push("/orders")}
                className="bg-brand-emerald-dark hover:bg-brand-emerald"
              >
                Go to My Orders
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="ghost"
                onClick={() => router.push("/")}
                className="border border-gray-300"
              >
                Continue Shopping
              </Button>
            </div>

            <p className="text-center text-xs text-brand-charcoal-light mt-6">
              A confirmation email will be sent to your registered email address
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-brand-cream-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-brand-charcoal-medium hover:text-brand-emerald transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card padding="lg">
                <h2 className="text-base font-semibold text-brand-charcoal mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-emerald" />
                  Shipping Address
                </h2>

                {savedAddresses.length > 0 && !showNewAddress && (
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = selectedAddress?._id === addr._id;
                      return (
                      <label
                        key={addr._id || idx}
                        className={`block p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "border-brand-emerald bg-brand-emerald/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="address"
                            checked={isSelected}
                            onChange={() => setSelectedAddress(addr)}
                            className="mt-1 accent-brand-emerald"
                          />
                          <div>
                            <p className="font-medium text-sm text-brand-charcoal">
                              {addr.fullName}
                            </p>
                            <p className="text-sm text-brand-charcoal-medium">
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p className="text-sm text-brand-charcoal-medium">
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                            <p className="text-sm text-brand-charcoal-light">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                      </label>
                      );
                    })}
                    <button
                      onClick={() => setShowNewAddress(true)}
                      className="text-sm font-medium text-brand-emerald hover:text-brand-emerald-light transition-colors"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {showNewAddress && (
                  <form
                    onSubmit={handleSubmit(handleAddressSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.fullName?.message}
                        {...register("fullName")}
                      />
                      <Input
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        error={errors.phone?.message}
                        {...register("phone")}
                      />
                    </div>
                    <Input
                      label="Address Line 1"
                      placeholder="Street, Building"
                      error={errors.addressLine1?.message}
                      {...register("addressLine1")}
                    />
                    <Input
                      label="Address Line 2 (Optional)"
                      placeholder="Apartment, Floor"
                      {...register("addressLine2")}
                    />
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        placeholder="Mumbai"
                        error={errors.city?.message}
                        {...register("city")}
                      />
                      <Input
                        label="State"
                        placeholder="Maharashtra"
                        error={errors.state?.message}
                        {...register("state")}
                      />
                      <Input
                        label="Pincode"
                        placeholder="400001"
                        error={errors.pincode?.message}
                        {...register("pincode")}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" size="md">
                        Save Address
                      </Button>
                      {savedAddresses.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setShowNewAddress(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </Card>

              {/* Payment Method */}
              <Card padding="lg">
                <h2 className="text-base font-semibold text-brand-charcoal mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-brand-emerald" />
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "cod"
                        ? "border-brand-emerald bg-brand-emerald/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-brand-emerald"
                    />
                    <Banknote className="w-6 h-6 text-brand-charcoal-medium" />
                    <div>
                      <p className="font-medium text-sm text-brand-charcoal">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-brand-charcoal-light">
                        Pay when your order is delivered
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                      paymentMethod === "razorpay"
                        ? "border-brand-emerald bg-brand-emerald/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "razorpay"}
                      onChange={() => setPaymentMethod("razorpay")}
                      className="accent-brand-emerald"
                    />
                    <CreditCard className="w-6 h-6 text-brand-charcoal-medium" />
                    <div>
                      <p className="font-medium text-sm text-brand-charcoal">
                        Pay Now (Online)
                      </p>
                      <p className="text-xs text-brand-charcoal-light">
                        UPI, Credit/Debit Card, Net Banking
                      </p>
                    </div>
                  </label>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card padding="lg" className="lg:sticky lg:top-24">
                <h3 className="text-base font-semibold text-brand-charcoal mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-4">
                  {items.map((item) => {
                    const product = item.productId;
                    if (!product || !product._id) return null;
                    return (
                      <div key={product._id} className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-brand-charcoal-medium line-clamp-1 flex-1 mr-2">
                            {product.name} x {item.quantity}
                          </span>
                          <span className="font-medium text-brand-charcoal shrink-0">
                            {formatPrice(product.price * item.quantity)}
                          </span>
                        </div>
                        {item.customization && Object.keys(item.customization).length > 0 && (
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className="text-xs text-brand-charcoal-light">✏️</span>
                            {Object.entries(item.customization).map(([key, val], i, arr) => (
                              <span key={key} className="text-xs text-brand-charcoal-medium">
                                <span className="font-medium">{val}</span>
                                {i < arr.length - 1 && <span className="text-brand-charcoal-light mx-1">·</span>}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-charcoal-medium">Subtotal</span>
                    <span className="text-brand-charcoal">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-charcoal-medium">Shipping</span>
                    <span className="text-green-600 font-medium">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-charcoal-medium">Payment</span>
                    <span className="text-brand-charcoal capitalize">
                      {paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-brand-charcoal">
                      Total
                    </span>
                    <span className="font-bold text-lg text-brand-emerald">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  className="mt-6"
                  onClick={placeOrder}
                  isLoading={placing}
                  disabled={!selectedAddress}
                >
                  {paymentMethod === "cod"
                    ? "Place Order (COD)"
                    : "Pay & Place Order"}
                </Button>

                <p className="text-[11px] text-brand-charcoal-light text-center mt-3">
                  By placing this order, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
