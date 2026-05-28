"use client";

import React from "react";
import { Shield, Lock, Eye, Database, Mail, FileText } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, phone number, delivery address)",
        "Payment information (processed securely through Razorpay)",
        "Order history and purchase behavior",
        "Device and browser information",
        "Cookies and usage data for improving user experience"
      ]
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        "Process and fulfill your orders",
        "Send order confirmations and shipping updates",
        "Provide customer support and respond to inquiries",
        "Send promotional emails (with your consent)",
        "Improve our website and services",
        "Prevent fraud and ensure platform security"
      ]
    },
    {
      icon: Shield,
      title: "Data Protection & Security",
      content: [
        "All payment transactions are encrypted using SSL technology",
        "We use industry-standard security measures to protect your data",
        "Your payment information is never stored on our servers",
        "Regular security audits and updates",
        "Restricted access to personal information (authorized personnel only)"
      ]
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        "We DO NOT sell your personal information to third parties",
        "Share minimal data with shipping partners for order delivery",
        "Share data with payment processors (Razorpay) for transactions",
        "May disclose information if required by law or legal process",
        "Anonymous usage statistics may be shared for analytics"
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-brand-cream-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-emerald-100">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-xs text-emerald-200 mt-2">
            Last updated: April 18, 2026
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm mb-8">
          <p className="text-sm text-brand-charcoal-medium leading-relaxed">
            Welcome to Graha Pravesh ("we," "us," or "our"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from our store.
          </p>
          <p className="text-sm text-brand-charcoal-medium leading-relaxed mt-4">
            By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </div>

        {/* Main Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-brand-emerald/5 to-transparent px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-emerald" />
                    </div>
                    <h2 className="text-lg font-semibold text-brand-charcoal">
                      {section.title}
                    </h2>
                  </div>
                </div>
                <div className="px-6 py-5">
                  <ul className="space-y-2.5">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-2 shrink-0" />
                        <span className="text-sm text-brand-charcoal-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Sections */}
        <div className="space-y-6 mt-6">
          {/* Cookies */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-brand-charcoal mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-emerald" />
              Cookies and Tracking
            </h2>
            <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookies through your browser settings.
            </p>
            <p className="text-sm text-brand-charcoal-medium leading-relaxed">
              Types of cookies we use: Essential cookies (required for website functionality), Analytics cookies (Google Analytics), and Preference cookies (remember your settings).
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-brand-charcoal mb-3">
              Your Rights
            </h2>
            <div className="space-y-2">
              <p className="text-sm text-brand-charcoal-medium flex items-start gap-2">
                <span className="text-brand-emerald font-bold">•</span>
                <span><strong>Access:</strong> Request a copy of your personal data</span>
              </p>
              <p className="text-sm text-brand-charcoal-medium flex items-start gap-2">
                <span className="text-brand-emerald font-bold">•</span>
                <span><strong>Correction:</strong> Update or correct inaccurate information</span>
              </p>
              <p className="text-sm text-brand-charcoal-medium flex items-start gap-2">
                <span className="text-brand-emerald font-bold">•</span>
                <span><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</span>
              </p>
              <p className="text-sm text-brand-charcoal-medium flex items-start gap-2">
                <span className="text-brand-emerald font-bold">•</span>
                <span><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time</span>
              </p>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-brand-charcoal mb-3">
              Third-Party Services
            </h2>
            <p className="text-sm text-brand-charcoal-medium leading-relaxed mb-3">
              We use trusted third-party services to provide our platform:
            </p>
            <ul className="space-y-2 text-sm text-brand-charcoal-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <strong>Razorpay:</strong> Payment processing (PCI DSS compliant)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <strong>Shipping Partners:</strong> Order delivery and logistics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <strong>Email Service:</strong> Transactional and promotional emails
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <strong>Analytics:</strong> Website performance and user behavior
              </li>
            </ul>
          </div>

          {/* Data Retention */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-brand-charcoal mb-3">
              Data Retention
            </h2>
            <p className="text-sm text-brand-charcoal-medium leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order data is typically retained for 3-5 years for accounting and tax purposes.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-brand-charcoal mb-3">
              Children's Privacy
            </h2>
            <p className="text-sm text-brand-charcoal-medium leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected data from a child, please contact us immediately.
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
                Questions About Our Privacy Policy?
              </h2>
              <p className="text-sm text-brand-charcoal-medium mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm text-brand-charcoal-medium">
                <p><strong>Email:</strong> privacy@grahapravesh.in</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Premium Avenue, Mumbai, Maharashtra 400001</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary text-xs">
                  Contact Us
                </Link>
                <Link href="/terms" className="btn-secondary text-xs">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Updates Notice */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-900">
            <strong>Note:</strong> We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
          </p>
        </div>
      </div>
    </div>
  );
}
