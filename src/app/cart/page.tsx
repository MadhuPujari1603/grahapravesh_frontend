"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuantitySelector from "@/components/shared/QuantitySelector";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getCart, cartTotal } =
    useCart();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [deliveryCharge, setDeliveryCharge] = React.useState(0);
  const [freeThreshold, setFreeThreshold] = React.useState(999);
  const [freeShippingEnabled, setFreeShippingEnabled] = React.useState(true);

  useEffect(() => {
    if (isAuthenticated) getCart();
  }, [isAuthenticated, getCart]);

  useEffect(() => {
    setMounted(true);
    api.get(API_ENDPOINTS.SHIPPING_SETTINGS).then((res) => {
      const d = res.data.data;
      setDeliveryCharge(d.deliveryCharge ?? 99);
      setFreeThreshold(d.freeShippingThreshold ?? 999);
      setFreeShippingEnabled(d.isFreeShippingEnabled ?? true);
    }).catch(() => {
      setDeliveryCharge(99);
    });
  }, []);

  const total = cartTotal();
  const shipping = mounted ? (freeShippingEnabled && total >= freeThreshold ? 0 : deliveryCharge) : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<ShoppingBag className="w-16 h-16" />}
            title="Your Cart is Empty"
            description="Looks like you haven't added any products to your cart yet. Explore our collection to find something you love."
            actionLabel="Start Shopping"
            onAction={() => (window.location.href = "/products")}
          />
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
              Shopping Cart
            </h1>
            <button
              onClick={() => clearCart()}
              className="text-sm text-brand-charcoal-light hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.productId;
                if (!product || !product._id) return null;

                const imageUrl =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "/images/placeholder-product.svg";

                return (
                  <div
                    key={product._id}
                    className="rounded-xl border p-4 sm:p-5 flex gap-4" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}
                  >
                    {/* Image */}
                    <Link
                      href={`/products/${product._id}`}
                      className="shrink-0"
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-sm sm:text-base font-semibold text-brand-charcoal hover:text-brand-emerald transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      {item.customization && Object.keys(item.customization).length > 0 && (
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          <span className="text-xs text-brand-charcoal-light">✏️</span>
                          {Object.entries(item.customization).map(([key, val], i, arr) => (
                            <span key={key} className="text-xs text-brand-charcoal-medium">
                              <span className="font-medium">{val}</span>
                              {i < arr.length - 1 && <span className="text-brand-charcoal-light mx-1">·</span>}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-brand-emerald font-bold mt-1">
                        {formatPrice(product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          onChange={(qty) => updateQuantity(product._id, qty)}
                          max={product.stock}
                          size="sm"
                        />
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-brand-charcoal">
                            {formatPrice(product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(product._id)}
                            className="p-2.5 rounded-lg text-brand-charcoal-light hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div>
              <div className="rounded-xl border p-5 lg:sticky lg:top-24" style={{ background: 'rgba(255,255,255,0.70)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.55)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
                <h3 className="text-base font-semibold text-brand-charcoal mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-charcoal-medium">
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-brand-charcoal">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-charcoal-medium">Shipping</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : "font-medium text-brand-charcoal"}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {freeShippingEnabled && total < freeThreshold && (
                    <p className="text-xs text-brand-charcoal-light">
                      Add {formatPrice(freeThreshold - total)} more for free shipping
                    </p>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-brand-charcoal">
                      Total
                    </span>
                    <span className="font-bold text-xl text-brand-emerald">
                      {formatPrice(total + shipping)}
                    </span>
                  </div>
                </div>

                <Link href={isAuthenticated ? "/checkout" : "/auth/login"}>
                  <Button
                    fullWidth
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
                  </Button>
                </Link>

                <Link
                  href="/products"
                  className="block text-center text-sm text-brand-charcoal-medium hover:text-brand-emerald mt-4 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
