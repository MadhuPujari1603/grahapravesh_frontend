"use client";

import React, { useState } from "react";
import { ChevronDown, Search, HelpCircle, Package, CreditCard, Truck, RefreshCw, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  { category: "Orders & Shipping", question: "How long does delivery take?", answer: "Standard delivery takes 5-7 business days across India. Express shipping (2-3 days) is available in metro cities. You'll receive tracking information once your order is dispatched." },
  { category: "Orders & Shipping", question: "Do you ship internationally?", answer: "Currently, we only ship within India. We're working on expanding our services to international locations. Subscribe to our newsletter to stay updated." },
  { category: "Orders & Shipping", question: "Can I track my order?", answer: "Yes! Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track your order from your account dashboard under 'My Orders'." },
  { category: "Orders & Shipping", question: "What if my product arrives damaged?", answer: "We take great care in packaging. If you receive a damaged product, please contact us within 48 hours with photos. We'll arrange a replacement or full refund immediately." },
  { category: "Payments", question: "What payment methods do you accept?", answer: "We accept UPI, Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). All online payments are processed through secure Razorpay gateway." },
  { category: "Payments", question: "Is it safe to use my credit card?", answer: "Absolutely! We use Razorpay's PCI DSS compliant payment gateway. Your card details are encrypted and never stored on our servers." },
  { category: "Payments", question: "Do you offer EMI options?", answer: "Yes, we offer EMI on purchases above ₹5,000 through major credit cards and digital wallets. EMI options are available at checkout." },
  { category: "Returns & Refunds", question: "What is your return policy?", answer: "We offer a 7-day return policy on most products. Items must be unused, in original packaging with tags intact. Refunds are processed within 5-7 business days." },
  { category: "Returns & Refunds", question: "How do I initiate a return?", answer: "Go to 'My Orders', select the order, and click 'Return Item'. Choose your reason and our team will arrange pickup. You can also contact customer support for assistance." },
  { category: "Returns & Refunds", question: "When will I receive my refund?", answer: "Refunds are initiated once we receive and inspect the returned product (2-3 days). The amount will be credited to your original payment method within 5-7 business days." },
  { category: "Products", question: "Are your products authentic?", answer: "Yes, 100%! We source directly from manufacturers and authorized distributors. Every product comes with authenticity guarantee and warranty where applicable." },
  { category: "Products", question: "Do products come with warranty?", answer: "Most of our products come with manufacturer warranty ranging from 6 months to 2 years. Warranty details are mentioned on each product page." },
  { category: "Products", question: "Can I request a product that's out of stock?", answer: "Yes! Click 'Notify Me' on the product page. We'll email you when it's back in stock. You can also contact us for estimated restock dates." },
  { category: "Account", question: "How do I create an account?", answer: "Click 'Sign Up' in the top right corner, enter your details, verify your email/phone, and you're all set! You can also sign up during checkout." },
  { category: "Account", question: "I forgot my password. What should I do?", answer: "Click 'Forgot Password' on the login page, enter your registered email, and follow the reset link sent to your inbox. Contact support if you need help." },
  { category: "Account", question: "How do I change my delivery address?", answer: "Go to 'My Profile' → 'Addresses' to add, edit or delete addresses. You can also add a new address during checkout." },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const filteredFAQs = faqs.filter(faq => {
    if (!searchQuery) { return selectedCategory === "All" || faq.category === selectedCategory; }
    const query = searchQuery.toLowerCase();
    const matchesSearch = faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query) || faq.category.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const categoryIcons: Record<string, any> = { "Orders & Shipping": Truck, "Payments": CreditCard, "Returns & Refunds": RefreshCw, "Products": Package, "Account": Shield };

  return (
    <div className="min-h-screen bg-brand-cream-light">
      <section className="bg-gradient-to-br from-brand-emerald-dark to-brand-emerald text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto relative">
            <Link href="/" className="absolute left-0 top-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 text-white text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4"><HelpCircle className="w-8 h-8" /></div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
            <p className="text-sm text-emerald-100">Find quick answers to common questions about our products, shipping, returns, and more.</p>
          </div>
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for answers..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-brand-charcoal text-sm border-0 focus:outline-none focus:ring-2 focus:ring-white/30 placeholder:text-gray-400" />
            </div>
          </div>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category] || HelpCircle;
            return (<button key={category} onClick={() => setSelectedCategory(category)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === category ? "bg-brand-emerald text-white shadow-sm" : "bg-white text-brand-charcoal-medium border border-gray-200 hover:border-brand-emerald hover:text-brand-emerald"}`}>{category !== "All" && <Icon className="w-4 h-4" />}{category}</button>);
          })}
        </div>
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                  <div className="flex-1 pr-4"><span className="inline-block px-2 py-0.5 rounded-md bg-brand-emerald/10 text-brand-emerald text-2xs font-medium mb-2">{faq.category}</span><h3 className="text-sm font-semibold text-brand-charcoal">{faq.question}</h3></div>
                  <ChevronDown className={`w-5 h-5 text-brand-charcoal-medium transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
                </button>
                {openIndex === index && (<div className="px-6 pb-4 border-t border-gray-100 pt-4 animate-slide-down"><p className="text-sm text-brand-charcoal-medium leading-relaxed">{faq.answer}</p></div>)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4"><Search className="w-8 h-8 text-brand-charcoal-light" /></div>
            <h3 className="text-lg font-semibold text-brand-charcoal mb-2">No results found</h3>
            <p className="text-sm text-brand-charcoal-light">Try adjusting your search or browse all FAQs</p>
          </div>
        )}
        <div className="mt-12 bg-gradient-to-br from-brand-emerald/5 to-brand-gold/5 rounded-xl border border-brand-emerald/10 p-8 text-center">
          <h2 className="text-xl font-semibold text-brand-charcoal mb-2">Still have questions?</h2>
          <p className="text-sm text-brand-charcoal-medium mb-6">Can't find what you're looking for? Our customer support team is here to help.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/contact" className="btn-primary inline-flex items-center gap-2"><HelpCircle className="w-4 h-4" />Contact Support</a>
            <a href="tel:+919876543210" className="btn-secondary inline-flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>Call Us</a>
          </div>
        </div>
      </div>
    </div>
  );
}
