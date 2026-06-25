"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Truck,
  RefreshCw,
  Headphones,
  Send,
  Star,
  CheckCircle,
  MapPin,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shared/ProductCard";
import CategoryCard from "@/components/shared/CategoryCard";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Product, Category } from "@/types";
import toast from "react-hot-toast";
import Image from "next/image";
// framer-motion loaded async — not on the critical path
import { motion } from "framer-motion";
import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";

/* ─────────────────────────────────────────
   Static data
───────────────────────────────────────── */
const PROMISE = [
  {
    icon: Shield,
    title: "Premium Quality",
    desc: "Every product is carefully vetted to meet our exacting quality standards.",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "Complimentary shipping on all orders above ₹999, pan India.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "Not satisfied? Return within 7 days for a full refund, no questions asked.",
  },
  {
    icon: Headphones,
    title: "24 / 7 Support",
    desc: "Our dedicated team is always here to help you, any time of day.",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    city: "Bengaluru",
    text: "Absolutely love my wooden nameplate. The quality is stunning — it's become the centrepiece of our entrance.",
    initials: "PS",
  },
  {
    name: "Rahul Mehta",
    city: "Mumbai",
    text: "Every product feels handpicked and premium. The packaging alone left a lasting impression on me.",
    initials: "RM",
  },
  {
    name: "Sneha Patil",
    city: "Pune",
    text: "Ordered as a housewarming gift. My friends were blown away. Will definitely be ordering for my own home soon!",
    initials: "SP",
  },
];

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSending, setContactSending] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.allSettled([
          api.get(API_ENDPOINTS.PRODUCTS_FEATURED),
          api.get(API_ENDPOINTS.CATEGORIES),
        ]);
        if (productsRes.status === "fulfilled")
          setFeaturedProducts(productsRes.value.data.data || []);
        if (categoriesRes.status === "fulfilled") {
          const all: Category[] = categoriesRes.value.data.data || [];
          // show featured first, then rest; fallback to all if none featured
          const featured = all.filter((c) => c.isFeatured);
          setCategories(featured.length > 0 ? featured : all);
        }
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) return;
    setContactSending(true);
    try {
      await api.post(API_ENDPOINTS.CONTACT_SUBMIT, {
        name: contactForm.name.trim(),
        email: contactForm.email.trim() || undefined,
        phone: contactForm.phone.trim(),
        message: contactForm.message.trim(),
      });
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setContactSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* ═══════════════════════════════════════════
            HERO
        ═══════════════════════════════════════════ */}
        <section className="relative min-h-[94vh] flex items-center justify-center overflow-hidden bg-brand-emerald-dark">

          {/* ── layered background ── */}
          {/* soft gold glow at centre */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,rgba(201,168,76,0.11),transparent)]" />
          {/* darken bottom edge */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(5,29,20,0.75),transparent)]" />
          {/* fine grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          {/* concentric rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] rounded-full border border-brand-gold/[0.07] pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full border border-brand-gold/[0.06] pointer-events-none" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-brand-gold/[0.05] pointer-events-none" />
          {/* corner bracket TL */}
          <div className="absolute top-8 left-8 pointer-events-none opacity-25">
            <div className="w-7 h-px bg-brand-gold" />
            <div className="w-px h-7 bg-brand-gold mt-0" />
          </div>
          {/* corner bracket TR */}
          <div className="absolute top-8 right-8 pointer-events-none opacity-25 flex flex-col items-end">
            <div className="w-7 h-px bg-brand-gold" />
            <div className="w-px h-7 bg-brand-gold" />
          </div>
          {/* corner bracket BL */}
          <div className="absolute bottom-8 left-8 pointer-events-none opacity-25 flex flex-col justify-end">
            <div className="w-px h-7 bg-brand-gold" />
            <div className="w-7 h-px bg-brand-gold" />
          </div>
          {/* corner bracket BR */}
          <div className="absolute bottom-8 right-8 pointer-events-none opacity-25 flex flex-col items-end justify-end">
            <div className="w-px h-7 bg-brand-gold" />
            <div className="w-7 h-px bg-brand-gold" />
          </div>

          {/* ── content ── */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">

              {/* eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="inline-flex items-center gap-2.5 border border-brand-gold/30 bg-brand-gold/8 rounded-full px-5 py-2 mb-9"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <span className="text-brand-gold text-[11px] font-bold uppercase tracking-[0.24em]">
                  Premium Collection
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              </motion.div>

              {/* headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                className="text-[1.75rem] sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-[-0.02em] mb-5 break-words"
              >
                Where Every{" "}
                <span className="relative inline-block">
                  <span className="text-brand-gold">Dream Home</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="5"
                    viewBox="0 0 300 5"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 2.5 Q75 0.5 150 2.5 Q225 4.5 300 2.5"
                      stroke="#c9a84c"
                      strokeWidth="1.5"
                      strokeOpacity="0.5"
                      fill="none"
                    />
                  </svg>
                </span>{" "}
                Begins
              </motion.h1>

              {/* ornamental divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.65, delay: 0.3 }}
                className="flex items-center gap-3 mb-7"
              >
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-brand-gold/40" />
                <div className="w-1 h-1 rounded-full bg-brand-gold/60" />
                <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                <div className="w-1 h-1 rounded-full bg-brand-gold/60" />
                <div className="w-16 h-px bg-gradient-to-l from-transparent to-brand-gold/40" />
              </motion.div>

              {/* subtext */}
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.38 }}
                className="text-[1.0625rem] text-emerald-200/80 leading-[1.8] mb-7 max-w-[36rem]"
              >
                Curated collections of premium home essentials, handpicked for
                those who appreciate quality, elegance, and the art of beautiful
                living.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.5 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-10"
              >
                <Link href="/products">
                  <button className="group inline-flex items-center gap-2.5 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-[0.8125rem] px-8 py-[0.9rem] rounded-xl transition-all duration-350 shadow-lg shadow-brand-gold/25 hover:shadow-brand-gold/45 hover:scale-[1.025] active:scale-[0.98]">
                    Shop Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
                <Link href="/products?view=categories">
                  <button className="inline-flex items-center gap-2 text-white/75 hover:text-white text-[0.8125rem] font-medium underline underline-offset-4 decoration-white/25 hover:decoration-white/60 transition-all duration-300">
                    Explore Categories
                  </button>
                </Link>
              </motion.div>

              {/* social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.68 }}
                className="flex flex-wrap items-center justify-center gap-10 sm:gap-16"
              >
                {[
                  { val: "5,000+", label: "Happy Customers" },
                  { val: "4.9 ★", label: "Average Rating" },
                  { val: "100%", label: "Genuine Products" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-1">
                    <span className="text-[1.375rem] font-bold text-white tracking-tight leading-none">
                      {s.val}
                    </span>
                    <span className="text-[10px] text-emerald-300/60 uppercase tracking-[0.18em]">
                      {s.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* scroll hint */}
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-28 pointer-events-none">
            <span className="text-[10px] text-white uppercase tracking-[0.28em]">
              Scroll
            </span>
            <div className="w-px h-9 bg-gradient-to-b from-white/70 to-transparent" />
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            WHY GRAHA PRAVESH
        ═══════════════════════════════════════════ */}
        <section className="py-10 lg:py-14 bg-brand-cream-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-10">
              <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">
                Why Graha Pravesh
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-snug mb-2">
                The Graha Pravesh Promise
              </h2>
              <p className="text-sm text-brand-charcoal-light max-w-md mx-auto leading-relaxed">
                Every order is backed by our unwavering commitment to quality, care, and customer delight.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Shield,
                  title: "Premium Quality",
                  desc: "Every product is carefully vetted to meet our exacting quality standards.",
                  color: "text-brand-emerald",
                  bg: "bg-brand-emerald/8",
                },
                {
                  icon: Truck,
                  title: "Free Shipping",
                  desc: "Complimentary shipping on all orders above ₹999, pan India.",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: RefreshCw,
                  title: "Easy Returns",
                  desc: "Not satisfied? Return within 7 days for a full refund, no questions asked.",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  icon: Headphones,
                  title: "24 / 7 Support",
                  desc: "Our dedicated team is always here to help you, any time of day.",
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div
                  key={title}
                  className="rounded-xl p-5 border backdrop-blur-sm hover:shadow-md transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}
                >
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <p className="text-sm font-semibold text-brand-charcoal mb-1">{title}</p>
                  <p className="text-xs text-brand-charcoal-light leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SHOP BY CATEGORY
        ═══════════════════════════════════════════ */}
        <section className="py-10 lg:py-14 bg-white">
          <div className="max-w-7xl mx-auto">

            {/* section header */}
            <ScrollReveal className="mb-8 text-center px-4 sm:px-6 lg:px-8">
              <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">
                Our Collections
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-snug mb-4">
                Shop by Category
              </h2>
              <p className="text-sm text-brand-charcoal-light max-w-sm mx-auto leading-relaxed">
                Discover curated ranges crafted for every room and every mood in your home.
              </p>
            </ScrollReveal>

            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : categories.length > 0 ? (
              <>
                {/* ── Mobile: horizontal round-bubble scroll ── */}
                <div className="sm:hidden px-4">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {categories.map((category) => {
                      const imgUrl = category.imageUrl || "/images/placeholder-category.svg";
                      return (
                        <Link
                          key={category._id}
                          href={`/products?category=${category._id}`}
                          className="flex flex-col items-center gap-2 shrink-0 snap-start"
                        >
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-emerald/20 shadow-md bg-gradient-to-br from-gray-100 to-gray-200 active:scale-95 transition-transform">
                            <Image
                              src={imgUrl}
                              alt={category.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 rounded-full bg-brand-emerald/10" />
                          </div>
                          <span className="text-[11px] font-semibold text-brand-charcoal text-center leading-tight max-w-[72px] line-clamp-2">
                            {category.name}
                          </span>
                        </Link>
                      );
                    })}
                    {/* View all bubble */}
                    <Link
                      href="/products"
                      className="flex flex-col items-center gap-2 shrink-0 snap-start"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-brand-emerald/30 flex items-center justify-center bg-brand-emerald/5 active:scale-95 transition-transform">
                        <ArrowRight className="w-5 h-5 text-brand-emerald" />
                      </div>
                      <span className="text-[11px] font-semibold text-brand-emerald text-center">View All</span>
                    </Link>
                  </div>
                </div>

                {/* ── Desktop: grid ── */}
                <div className="hidden sm:block px-6 lg:px-8">
                  <StaggerContainer
                    className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    staggerDelay={0.08}
                  >
                    {categories.slice(0, 8).map((category) => (
                      <StaggerItem key={category._id}>
                        <CategoryCard category={category} />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>

                  <div className="text-center mt-12">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-brand-emerald uppercase tracking-[0.18em] border-b border-brand-emerald/30 hover:border-brand-emerald pb-0.5 transition-all duration-300 group"
                    >
                      View All Categories
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center text-brand-charcoal-light text-sm py-12">
                Categories coming soon.
              </p>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            FEATURED PRODUCTS
        ═══════════════════════════════════════════ */}
        <section className="py-10 lg:py-14 bg-brand-cream-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* section header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <ScrollReveal>
                <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">
                  Handpicked for you
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-snug mb-2">
                  Featured Products
                </h2>
                <p className="text-sm text-brand-charcoal-light max-w-sm leading-relaxed">
                  Our most loved pieces — curated for beauty, quality and lasting
                  value.
                </p>
              </ScrollReveal>

              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-brand-emerald uppercase tracking-[0.18em] border-b border-brand-emerald/30 hover:border-brand-emerald pb-0.5 transition-all duration-300 group shrink-0"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-24">
                <Spinner size="lg" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <>
                <StaggerContainer
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-7"
                  staggerDelay={0.08}
                >
                  {featuredProducts.slice(0, 4).map((product, idx) => (
                    <StaggerItem key={product._id}>
                      <ProductCard product={product} priority={idx < 4} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="sm:hidden mt-10 text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-emerald uppercase tracking-[0.18em] border-b border-brand-emerald/30 pb-0.5"
                  >
                    View All Products <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-center text-brand-charcoal-light text-sm py-20">
                Featured products coming soon.
              </p>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            ABOUT TEASER
        ═══════════════════════════════════════════ */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">Our Story</p>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3">
                Every Nameplate Tells a Story
              </h2>
              <p className="text-sm text-brand-charcoal-medium max-w-xl mx-auto leading-relaxed mb-6">
                35 years of hand-crafted wooden nameplates by master artisan Rajesh Nayak — built with patience, pride and genuine love for the craft.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-emerald hover:text-brand-emerald-light transition-colors group"
              >
                Want to know more about us?
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </ScrollReveal>
          </div>
        </section>



        {/* ═══════════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════════ */}
        <section className="py-10 lg:py-14 bg-brand-cream-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <ScrollReveal className="text-center mb-8">
              <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">
                Customer Stories
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-snug mb-4">
                Loved Across India
              </h2>
              <p className="text-sm text-brand-charcoal-light max-w-sm mx-auto leading-relaxed">
                Real words from the families who trust Graha Pravesh to make
                their homes beautiful.
              </p>
            </ScrollReveal>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              staggerDelay={0.1}
            >
              {TESTIMONIALS.map((t) => (
                <StaggerItem key={t.name}>
                  <div className="group rounded-xl p-6 hover:shadow-md transition-all duration-200 flex flex-col gap-5 h-full border backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
                    {/* stars */}
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className="w-3.5 h-3.5 fill-brand-gold text-brand-gold"
                        />
                      ))}
                    </div>
                    {/* quote */}
                    <p className="text-[0.875rem] text-brand-charcoal-medium leading-[1.75] flex-1 italic">
                      "{t.text}"
                    </p>
                    {/* author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-brand-emerald flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-charcoal leading-none">
                          {t.name}
                        </p>
                        <p className="text-xs text-brand-charcoal-light mt-1">
                          {t.city}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            NEWSLETTER
        ═══════════════════════════════════════════ */}
        <section className="py-10 lg:py-14 bg-brand-emerald-dark relative overflow-hidden">
          {/* layered depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(201,168,76,0.09),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(5,29,20,0.6),transparent)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />

          <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              {/* eyebrow */}
              <div className="text-center mb-8">
                <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.28em] mb-4">
                  Get In Touch
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  Contact Us
                </h2>
                <p className="text-sm text-emerald-200/70 leading-relaxed max-w-md mx-auto">
                  Have a question or want to place a custom order? We'd love to hear from you.
                </p>
              </div>

              {/* Glass contact form */}
              <form
                onSubmit={handleContact}
                className="space-y-3 rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.06) inset",
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-200/70 uppercase tracking-wider mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ramesh Babu"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-emerald-300/50 focus:outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", outline: "none" }}
                      onFocus={e => e.currentTarget.style.border = "1px solid rgba(201,168,76,0.60)"}
                      onBlur={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)"}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-200/70 uppercase tracking-wider mb-1.5">Email Address <span className="text-emerald-300/40 normal-case">(optional)</span></label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="hello@example.com"
                      className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-emerald-300/50 focus:outline-none transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                      onFocus={e => e.currentTarget.style.border = "1px solid rgba(201,168,76,0.60)"}
                      onBlur={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)"}
                    />
                  </div>
                </div>

                {/* Phone number */}
                <div>
                  <label className="block text-[11px] font-semibold text-emerald-200/70 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    placeholder="98765 43210"
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-emerald-300/50 focus:outline-none transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                    onFocus={e => e.currentTarget.style.border = "1px solid rgba(201,168,76,0.60)"}
                    onBlur={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)"}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-200/70 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us about your requirement, custom nameplate design, or any question..."
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-emerald-300/50 focus:outline-none transition-all duration-200 resize-none"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                    onFocus={e => e.currentTarget.style.border = "1px solid rgba(201,168,76,0.60)"}
                    onBlur={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.15)"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSending}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-60"
                  style={{ background: "rgba(201,168,76,0.90)", boxShadow: "0 2px 12px rgba(201,168,76,0.35)" }}
                >
                  {contactSending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send Message</>
                  )}
                </button>
              </form>

              <p className="text-[11px] text-emerald-300/45 mt-4 flex items-center justify-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                We typically respond within 24 hours.
              </p>

              {/* Phone + WhatsApp */}
              <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                <a
                  href="tel:+919980367910"
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-200/70 hover:text-emerald-200 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  9980 367910
                </a>
                <span className="text-emerald-300/20">|</span>
                <a
                  href="https://wa.me/918762625888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-200/70 hover:text-emerald-200 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.115.554 4.1 1.523 5.824L.057 23.999l6.305-1.54A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.371l-.359-.213-3.722.975.993-3.63-.234-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
                  </svg>
                  8762625888
                </a>
              </div>

              <p className="text-[11px] text-emerald-300/40 mt-3 text-center">
                Or visit our{" "}
                <Link href="/contact" className="text-brand-gold/70 hover:text-brand-gold underline underline-offset-2 transition-colors">
                  full contact page
                </Link>
                {" "}for more ways to reach us.
              </p>
            </ScrollReveal>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
