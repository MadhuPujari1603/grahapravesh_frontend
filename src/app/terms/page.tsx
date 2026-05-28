"use client";

import React from "react";
import { FileText, ShoppingBag, Shield, AlertCircle, Scale, Mail } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-brand-cream-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-sm text-emerald-100">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-xs text-emerald-200 mt-2">
            Last updated: April 18, 2026
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-4">
            Agreement to Terms
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-4">
            Welcome to Graha Pravesh. By accessing our website at grahapravesh.in and purchasing products from our store, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            If you do not agree with any part of these terms, you must not use our services. These terms apply to all visitors, users, and customers of our platform.
          </p>
        </div>

        {/* Use of Service */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-emerald/5 to-transparent px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-emerald" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Use of Service
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Eligibility</h3>
              <p className="text-sm text-brand-charcoal-medium">
                You must be at least 18 years old to make purchases on our platform. By using our service, you represent that you meet this age requirement and have the legal capacity to enter into a binding contract.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Account Responsibilities</h3>
              <ul className="space-y-2 text-sm text-brand-charcoal-medium">
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>Provide accurate and complete information during registration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>Maintain the security of your account credentials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>Notify us immediately of any unauthorized access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>You are responsible for all activities under your account</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Orders & Payments */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-brand-emerald/5 to-transparent px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-brand-emerald" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Orders & Payments
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Order Acceptance</h3>
              <p className="text-sm text-brand-charcoal-medium">
                All orders are subject to acceptance and product availability. We reserve the right to refuse or cancel any order for any reason, including product unavailability, pricing errors, or suspected fraudulent activity.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Pricing</h3>
              <p className="text-sm text-brand-charcoal-medium mb-2">
                All prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise. We reserve the right to change prices at any time without notice.
              </p>
              <p className="text-sm text-brand-charcoal-medium">
                In case of a pricing error, we will contact you to confirm whether you want to proceed with the order at the correct price or cancel it.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-charcoal mb-2">Payment Terms</h3>
              <ul className="space-y-2 text-sm text-brand-charcoal-medium">
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>Payment must be received before order processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>We accept UPI, Cards, Net Banking, and COD</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>All online payments are processed through Razorpay (secure)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-emerald mt-0.5">•</span>
                  <span>COD orders may be subject to verification calls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Information */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-emerald" />
            Product Information & Accuracy
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            Product colors may vary slightly due to screen settings. Actual product dimensions may have minor variations. We reserve the right to correct any errors, inaccuracies, or omissions.
          </p>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Shipping & Delivery
          </h2>
          <ul className="space-y-2.5 text-sm text-brand-charcoal-medium">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
              <span>Standard delivery: 5-7 business days across India</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
              <span>Express delivery available in select metro cities (2-3 days)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
              <span>Delivery times are estimates and may vary due to unforeseen circumstances</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
              <span>Risk of loss passes to you upon delivery to the carrier</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
              <span>Free shipping on orders above ₹1,999 (standard delivery)</span>
            </li>
          </ul>
        </div>

        {/* Returns & Refunds */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Returns & Refunds
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            Please refer to our <Link href="/refund-policy" className="text-brand-emerald hover:underline font-medium">Refund Policy</Link> for detailed information about returns, exchanges, and refunds.
          </p>
          <p className="text-sm text-brand-charcoal-medium">
            Summary: 7-day return policy on most items, products must be unused with original packaging.
          </p>
        </div>

        {/* Prohibited Uses */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-50 to-transparent px-6 py-4 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-brand-charcoal">
                Prohibited Uses
              </h2>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-brand-charcoal-medium mb-3">You may not use our platform to:</p>
            <ul className="space-y-2 text-sm text-brand-charcoal-medium">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Violate any laws or regulations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Engage in fraudulent activities or payment disputes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Transmit malware, viruses, or harmful code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Collect user data without authorization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Impersonate others or provide false information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-0.5">✕</span>
                <span>Interfere with the proper functioning of our platform</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Intellectual Property
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            All content on this website, including text, graphics, logos, images, and software, is the property of Graha Pravesh and protected by Indian and international copyright laws.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            You may not reproduce, distribute, modify, or create derivative works without our express written permission.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Limitation of Liability
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            To the fullest extent permitted by law, Graha Pravesh shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            Our total liability for any claim shall not exceed the amount paid by you for the product or service in question.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Governing Law & Dispute Resolution
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            We encourage you to contact us first to resolve any issues amicably before pursuing legal action.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-base font-semibold text-brand-charcoal mb-3">
            Changes to Terms
          </h2>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            We reserve the right to update or modify these Terms at any time without prior notice. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the updated Terms.
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-brand-emerald/5 to-brand-gold/5 rounded-xl border border-brand-emerald/10 p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-brand-emerald" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-brand-charcoal mb-2">
                Questions About These Terms?
              </h2>
              <p className="text-sm text-brand-charcoal-medium mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-sm text-brand-charcoal-medium mb-4">
                <p><strong>Email:</strong> legal@grahapravesh.in</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Premium Avenue, Mumbai, Maharashtra 400001</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary text-xs">
                  Contact Us
                </Link>
                <Link href="/privacy-policy" className="btn-secondary text-xs">
                  Privacy Policy
                </Link>
                <Link href="/refund-policy" className="btn-secondary text-xs">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
