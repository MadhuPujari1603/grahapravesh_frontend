"use client";

import React, { useEffect, useState } from "react";
import { Truck, Save, ToggleLeft, ToggleRight, Info } from "lucide-react";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface ShippingSettings {
  _id: string;
  deliveryCharge: number;
  freeShippingThreshold: number;
  isFreeShippingEnabled: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ShippingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("");
  const [isFreeShippingEnabled, setIsFreeShippingEnabled] = useState(true);

  useEffect(() => {
    api
      .get(API_ENDPOINTS.SHIPPING_SETTINGS)
      .then((res) => {
        const data: ShippingSettings = res.data.data;
        setSettings(data);
        setDeliveryCharge(String(data.deliveryCharge));
        setFreeShippingThreshold(String(data.freeShippingThreshold));
        setIsFreeShippingEnabled(data.isFreeShippingEnabled);
      })
      .catch(() => toast.error("Failed to load shipping settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const charge = Number(deliveryCharge);
    const threshold = Number(freeShippingThreshold);

    if (isNaN(charge) || charge < 0) {
      toast.error("Delivery charge must be 0 or more");
      return;
    }
    if (isFreeShippingEnabled && (isNaN(threshold) || threshold < 0)) {
      toast.error("Free shipping threshold must be 0 or more");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(API_ENDPOINTS.ADMIN_SHIPPING_SETTINGS, {
        deliveryCharge: charge,
        freeShippingThreshold: threshold,
        isFreeShippingEnabled,
      });
      setSettings(res.data.data);
      toast.success("Shipping settings saved!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const previewCharge =
    isFreeShippingEnabled && 500 >= Number(freeShippingThreshold)
      ? 0
      : Number(deliveryCharge);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal">
          Store Settings
        </h1>
        <p className="text-sm text-brand-charcoal-medium mt-1">
          Manage delivery charges shown to customers at checkout
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.55)",
          boxShadow: "0 2px 16px 0 rgba(10,61,46,0.08)",
        }}
      >
        {/* Card header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="w-9 h-9 rounded-xl bg-brand-emerald flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-brand-charcoal text-sm">Delivery Charges</p>
            <p className="text-xs text-brand-charcoal-light">
              These values apply to all orders at cart &amp; checkout
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Delivery charge */}
          <div>
            <label className="block text-sm font-semibold text-brand-charcoal mb-1.5">
              Delivery Charge (₹)
            </label>
            <p className="text-xs text-brand-charcoal-light mb-2">
              Flat fee charged when the order doesn't qualify for free shipping.
              Set to <strong>0</strong> to make all delivery free.
            </p>
            <div className="relative w-48">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal-light font-semibold">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Free shipping toggle */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-charcoal mb-0.5">
                Free Shipping Above a Threshold
              </p>
              <p className="text-xs text-brand-charcoal-light">
                When enabled, orders above the threshold get free delivery.
              </p>
            </div>
            <button
              onClick={() => setIsFreeShippingEnabled((p) => !p)}
              className="shrink-0 mt-0.5"
              title="Toggle free shipping"
            >
              {isFreeShippingEnabled ? (
                <ToggleRight className="w-8 h-8 text-brand-emerald" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-brand-charcoal-light" />
              )}
            </button>
          </div>

          {/* Threshold input */}
          {isFreeShippingEnabled && (
            <div>
              <label className="block text-sm font-semibold text-brand-charcoal mb-1.5">
                Free Shipping Threshold (₹)
              </label>
              <p className="text-xs text-brand-charcoal-light mb-2">
                Orders with a subtotal at or above this amount get free delivery.
              </p>
              <div className="relative w-48">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal-light font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={freeShippingThreshold}
                  onChange={(e) => setFreeShippingThreshold(e.target.value)}
                  className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition"
                />
              </div>
            </div>
          )}

          {/* Preview box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed space-y-1">
              <p className="font-semibold">Live preview:</p>
              {isFreeShippingEnabled ? (
                <>
                  <p>
                    • Orders <strong>below ₹{freeShippingThreshold || "—"}</strong> → delivery charge:{" "}
                    <strong>{Number(deliveryCharge) === 0 ? "Free" : `₹${deliveryCharge}`}</strong>
                  </p>
                  <p>
                    • Orders <strong>₹{freeShippingThreshold || "—"} and above</strong> → delivery:{" "}
                    <strong className="text-green-700">Free</strong>
                  </p>
                </>
              ) : (
                <p>
                  • All orders → delivery charge:{" "}
                  <strong>{Number(deliveryCharge) === 0 ? "Free" : `₹${deliveryCharge}`}</strong>
                </p>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-emerald hover:bg-brand-emerald-dark text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
