"use client";

import React from "react";
import { RefreshCw, Package, CreditCard, Truck, Clock, CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-brand-cream-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Refund & Return Policy</h1>
          <p className="text-sm text-emerald-100">
            Your satisfaction is our priority. Learn about our hassle-free return and refund process.
          </p>
          <p className="text-xs text-emerald-200 mt-2">
            Last updated: April 18, 2026
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-4">
            Our Commitment to You
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-4">
            At Graha Pravesh, we want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a straightforward 7-day return policy on most products.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            This policy outlines the conditions, process, and timelines for returns, exchanges, and refunds.
          </p>
        </div>

        {/* Return Eligibility */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-emerald/5 to-transparent px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-brand-emerald" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Return Eligibility
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-emerald" />
                7-Day Return Window
              </h3>
              <p className="text-sm text-brand-charcoal-medium">
                You can return most items within 7 days of delivery. The return window starts from the day you receive the product.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Eligible Products Must Be:</h3>
              <ul className="space-y-2 text-sm text-brand-charcoal-medium">
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">✓</span>
                  <span><strong>Unused and unwashed</strong> - In original condition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">✓</span>
                  <span><strong>Original packaging</strong> - With all tags, labels, and accessories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">✓</span>
                  <span><strong>Invoice included</strong> - Original invoice or packing slip</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">✓</span>
                  <span><strong>No damage</strong> - Free from scratches, stains, or alterations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-50 to-transparent px-6 py-4 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Non-Returnable Items
              </h2>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-brand-charcoal-medium mb-3">The following items cannot be returned:</p>
            <ul className="space-y-2 text-sm text-brand-charcoal-medium">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Products on sale or clearance (Final Sale items)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Customized or personalized products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Opened or used consumable items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Items marked as "Non-Returnable" on product page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Gift cards and vouchers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-emerald/5 to-transparent px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-brand-emerald" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                How to Return an Item
              </h2>
            </div>
          </div>
          <div className="px-6 py-5">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-emerald text-white text-sm font-bold shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal mb-1">
                    Initiate Return Request
                  </h3>
                  <p className="text-sm text-brand-charcoal-medium">
                    Log in to your account, go to "My Orders", select the order, and click "Return Item". Choose your reason for return and submit the request.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-emerald text-white text-sm font-bold shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal mb-1">
                    Approval & Pickup
                  </h3>
                  <p className="text-sm text-brand-charcoal-medium">
                    Once approved (usually within 24 hours), we'll arrange a pickup from your address. You'll receive pickup details via email and SMS.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-emerald text-white text-sm font-bold shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal mb-1">
                    Pack the Item
                  </h3>
                  <p className="text-sm text-brand-charcoal-medium">
                    Securely pack the product in its original packaging with all tags and accessories. Include the invoice.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-emerald text-white text-sm font-bold shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-charcoal mb-1">
                    Quality Check & Refund
                  </h3>
                  <p className="text-sm text-brand-charcoal-medium">
                    Once we receive the item, our team will inspect it (2-3 days). If approved, refund will be initiated within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refund Process */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-gold/10 to-transparent px-6 py-4 border-b border-brand-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-gold-dark" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Refund Timeline
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Online Payments (UPI, Cards, Net Banking)</h3>
              <p className="text-sm text-brand-charcoal-medium mb-2">
                Refunds are credited to your original payment method:
              </p>
              <ul className="space-y-1.5 text-sm text-brand-charcoal-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span><strong>UPI:</strong> 1-3 business days</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span><strong>Credit/Debit Cards:</strong> 5-7 business days</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  <span><strong>Net Banking:</strong> 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Cash on Delivery (COD)</h3>
              <p className="text-sm text-brand-charcoal-medium">
                For COD orders, refund will be processed via bank transfer to your registered bank account. Please provide your bank details when initiating the return. Processing time: 7-10 business days.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900">
                <strong>Note:</strong> Actual credit time depends on your bank/payment provider. If you don't receive your refund within the stated timeline, please contact your bank first, then reach out to us.
              </p>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-emerald" />
            Exchanges
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            Currently, we don't offer direct exchanges. If you'd like a different size or color, please return the original item for a refund and place a new order.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            We're working on implementing an exchange feature. Subscribe to our newsletter to stay updated!
          </p>
        </div>

        {/* Damaged/Defective Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-transparent px-6 py-4 border-b border-orange-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Damaged or Defective Products
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3">
            <p className="text-sm text-brand-charcoal-medium">
              If you receive a damaged or defective product, please contact us within <strong>48 hours of delivery</strong> with:
            </p>
            <ul className="space-y-2 text-sm text-brand-charcoal-medium">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Clear photos of the damaged/defective item</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Order number and product details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Brief description of the issue</span>
              </li>
            </ul>
            <p className="text-sm text-brand-charcoal-medium pt-2">
              We'll arrange a replacement or full refund immediately. Shipping charges for return will be borne by us.
            </p>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Return Shipping Charges
          </h2>
          <div className="space-y-2 text-sm text-brand-charcoal-medium">
            <p className="flex items-start gap-2">
              <span className="text-brand-emerald font-bold">✓</span>
              <span><strong>Free pickup</strong> for damaged/defective products</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-brand-emerald font-bold">✓</span>
              <span><strong>Free pickup</strong> if we made an error (wrong item sent)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-brand-charcoal-light font-bold">•</span>
              <span><strong>Customer bears return shipping</strong> for change of mind/size issues</span>
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-brand-emerald/5 to-brand-gold/5 rounded-xl border border-brand-emerald/10 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-brand-emerald" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-brand-charcoal mb-2">
                Need Help with Returns?
              </h2>
              <p className="text-sm text-brand-charcoal-medium mb-4">
                Our customer support team is here to assist you with any return or refund queries:
              </p>
              <div className="space-y-2 text-sm text-brand-charcoal-medium mb-4">
                <p><strong>Email:</strong> returns@grahapravesh.in</p>
                <p><strong>Phone:</strong> +91 98765 43210 (Mon-Sat, 10AM-7PM)</p>
                <p><strong>WhatsApp:</strong> +91 98765 43210</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary text-xs">
                  Contact Support
                </Link>
                <Link href="/faq" className="btn-secondary text-xs">
                  View FAQs
                </Link>
                <a href="/orders" className="btn-secondary text-xs">
                  My Orders
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-900">
            <strong>Note:</strong> This policy may be updated from time to time. Any changes will be posted on this page. We recommend reviewing this policy periodically.
          </p>
        </div>
      </div>
    </div>
  );
}
