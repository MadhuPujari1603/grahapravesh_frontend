"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Award,
  Users,
  Gem,
  Target,
  Handshake,
  Sparkles,
  ShieldCheck,
  Truck,
  Clock,
  Star,
  ArrowRight,
  Palette,
  Lightbulb,
  TrendingUp,
  Quote,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ScrollReveal, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/ScrollReveal";

const founderJourney = [
  {
    year: "1989",
    title: "The Beginning in Thirthahalli",
    description:
      "35 years ago, in the picturesque town of Thirthahalli, Shimoga, Rajesh Nayak's artistic journey began under the guidance of his Guru, Shrinivas Sir (Seeni Arts), who taught him that true art lies in the finest details.",
  },
  {
    year: "1997",
    title: "Raj Decor - The First Venture",
    description:
      "Founded in Hubli, Raj Decor brought Rajesh's artistic skills into the commercial world, establishing a reputation for creativity and meticulous craftsmanship in North Karnataka.",
  },
  {
    year: "2022",
    title: "Raj Creations - Premium Excellence",
    description:
      "Launched as a premium branded house of Name Plates, setting a new standard for luxury craftsmanship in Hubli and across North Karnataka.",
  },
  {
    year: "2026",
    title: "Graha Pravesh - Digital Evolution",
    description:
      "Expanding the legacy online, bringing world-class customization to homes across India in 100+ cities.",
  },
];

const innovations = [
  {
    icon: Palette,
    title: "True Bespoke Customisation",
    description:
      "Whether it's a specific font, a religious motif, or a unique material blend, we tailor every plate to the architecture of your home and your personal style.",
  },
  {
    icon: Lightbulb,
    title: "Innovative Materials",
    description:
      "We lead the market by experimenting with CNC precision, 3D acrylics, weather-resistant textures, and integrated LED lighting.",
  },
  {
    icon: TrendingUp,
    title: "Art Meets Technology",
    description:
      "Blending 35 years of hand-painted mastery with modern machinery to create designs that are visually stunning and built to last a lifetime.",
  },
];

const values = [
  {
    icon: Gem,
    title: "Premium Quality",
    description:
      "35 years of expertise ensures the finest materials and master craftsmanship. Quality isn't a feature — it's our foundation.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every nameplate carries decades of artistic passion and the warmth of human touch. We believe homes are built with love.",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: Target,
    title: "Attention to Detail",
    description:
      "True art lies in the finest details. From the curve of a letter to the finish of a surface — perfection in every element.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Handshake,
    title: "Customer First",
    description:
      "Your satisfaction drives everything we do. From personalized designs to timely delivery, we go the extra mile.",
    color: "bg-green-50 text-green-600",
  },
];

const stats = [
  { number: "35+", label: "Years of Expertise" },
  { number: "100+", label: "Cities Served" },
  { number: "5000+", label: "Happy Families" },
  { number: "4.8/5", label: "Customer Rating" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-emerald-dark via-brand-emerald-deeper to-brand-charcoal overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(201,168,76,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_40%)]" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-6"
              >
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest">
                  35 Years of Excellence
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6"
              >
                The Master's Touch,{" "}
                <span className="text-brand-gold">Your Home's Identity</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-emerald-200 leading-relaxed max-w-2xl mx-auto mb-8"
              >
                From a passionate painter in Thirthahalli to North Karnataka's leading name plate specialist — a journey of artistry, innovation, and unwavering commitment to excellence.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-20 h-1 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-gold-light mx-auto rounded-full"
              />
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4" staggerDelay={0.15}>
              {stats.map((stat, idx) => (
                <StaggerItem key={stat.label}>
                  <div
                    className={`py-10 text-center ${
                      idx < stats.length - 1
                        ? "lg:border-r border-gray-100"
                        : ""
                    }`}
                  >
                    <p className="text-xl sm:text-2xl font-bold text-brand-emerald-dark">
                      {stat.number}
                    </p>
                    <p className="text-sm text-brand-charcoal-medium mt-1">
                      {stat.label}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── THE FOUNDER — Single powerful section ── */}
        <section className="py-16 lg:py-24 bg-brand-cream-light overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 xl:gap-20 items-start">

              {/* LEFT: One portrait, one badge */}
              <ScrollReveal direction="left">
                <div className="relative max-w-[380px] mx-auto lg:mx-0 shrink-0">
                  <div className="absolute -z-10 top-8 -left-6 w-48 h-64 rounded-3xl bg-white/60 border border-brand-gold/20" />
                  <div className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-[0_32px_64px_-16px_rgba(10,61,46,0.22)]">
                    <img
                      src="/images/raj.jpeg"
                      alt="Rajesh Nayak — Founder, Graha Pravesh"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-emerald-deeper/70 via-brand-emerald-deeper/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-6">
                      <p className="text-white font-bold text-lg leading-tight drop-shadow">Rajesh Nayak</p>
                      <p className="text-brand-gold text-[11px] font-semibold uppercase tracking-[0.18em] mt-1 drop-shadow">
                        Founder &amp; Master Artisan
                      </p>
                      <div className="flex items-center gap-0.5 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                        ))}
                        <span className="text-white/70 text-[11px] ml-2">35 Years of Excellence</span>
                      </div>
                    </div>
                  </div>
                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -right-4 rounded-xl border px-4 py-3 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.90)', borderColor: 'rgba(201,168,76,0.30)', boxShadow: '0 4px 20px rgba(10,61,46,0.10)' }}>
                    <p className="text-xs font-bold text-brand-charcoal leading-none">5,000+</p>
                    <p className="text-[10px] text-brand-charcoal-light mt-0.5">Nameplates crafted</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* RIGHT: Full story — journey + pillars + quote */}
              <ScrollReveal direction="right" delay={0.12}>
                <div>
                  <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.28em] mb-3">
                    The Artisan Behind the Brand
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-3 leading-tight">
                    Every Nameplate Tells a Story
                  </h2>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-px bg-brand-gold/50" />
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    <div className="w-8 h-px bg-brand-gold/50" />
                  </div>

                  {/* Story paragraphs */}
                  <div className="space-y-3 mb-6">
                    <p className="text-sm text-brand-charcoal-medium leading-[1.85]">
                      I'm <strong className="text-brand-charcoal font-semibold">Rajesh Nayak</strong>, the founder of Graha Pravesh. For over <strong className="text-brand-charcoal">35 years</strong> — beginning in the picturesque town of <strong className="text-brand-charcoal">Thirthahalli, Shimoga</strong>, under the guidance of my Guru <strong className="text-brand-charcoal">Shrinivas Sir (Seeni Arts)</strong> — I have carved, polished and finished wooden nameplates entirely by hand.
                    </p>
                    <p className="text-sm text-brand-charcoal-medium leading-[1.85]">
                      In <strong className="text-brand-charcoal">1997</strong> I founded <strong className="text-brand-charcoal">Raj Decor</strong> in Hubli. In <strong className="text-brand-charcoal">2022</strong> I launched <strong className="text-brand-charcoal">Raj Creations</strong> — a premium house of name plates setting a new standard for luxury craftsmanship across North Karnataka.
                    </p>
                    <p className="text-sm text-brand-charcoal-medium leading-[1.85]">
                      Every nameplate that leaves our workshop carries the warmth of a craftsman who believes a home's entrance deserves the same care as the home itself. No machines, no shortcuts — only honest woodwork and genuine love for the craft.
                    </p>
                  </div>

                  {/* Craft pillars */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: "🌿", title: "Natural Materials", desc: "Premium teak, mango & sheesham wood — ethically sourced." },
                      { icon: "✋", title: "Hand-Finished", desc: "Every edge shaped, sanded and sealed by a skilled artisan." },
                      { icon: "🔒", title: "Built to Last", desc: "UV-treated, weather-resistant finish for years of beauty." },
                      { icon: "📦", title: "Made-to-Order", desc: "Each piece crafted fresh — never mass-produced or stored." },
                    ].map((p) => (
                      <div key={p.title} className="flex items-start gap-3 rounded-xl p-3 border" style={{ background: 'rgba(255,255,255,0.60)', borderColor: 'rgba(255,255,255,0.50)' }}>
                        <span className="text-lg shrink-0 leading-none mt-0.5">{p.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-brand-charcoal leading-tight mb-0.5">{p.title}</p>
                          <p className="text-[11px] text-brand-charcoal-light leading-snug">{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Founder quote */}
                  <blockquote className="border-l-2 border-brand-gold pl-5">
                    <p className="text-sm text-brand-charcoal-medium italic leading-relaxed">
                      "A nameplate is the first thing your guests see and the last thing you see when you leave.
                      It should be something you are genuinely proud of."
                    </p>
                    <footer className="mt-2 text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.2em]">
                      — Rajesh Nayak, Founder
                    </footer>
                  </blockquote>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-brand-gold-dark uppercase tracking-wider">
                  Setting the Trend
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mt-2 mb-4">
                  Innovation & Customisation
                </h2>
                <p className="text-brand-charcoal-medium max-w-2xl mx-auto">
                  We've become North Karnataka's trendsetter by moving beyond "ready-made" designs
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
              {innovations.map((innovation) => (
                <StaggerItem key={innovation.title}>
                  <div className="group relative rounded-xl p-6 hover:shadow-md transition-all duration-200 border h-full overflow-hidden cursor-pointer backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/0 to-brand-gold/0 group-hover:from-brand-emerald/5 group-hover:to-brand-gold/5 transition-all duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-emerald to-brand-emerald-dark flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-brand-emerald/20 group-hover:shadow-brand-emerald/40">
                        <innovation.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-charcoal mb-3 group-hover:text-brand-emerald-dark transition-colors duration-300">
                        {innovation.title}
                      </h3>
                      <p className="text-sm text-brand-charcoal-medium leading-relaxed group-hover:text-brand-charcoal transition-colors duration-300">
                        {innovation.description}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-20 bg-brand-cream">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-brand-gold-dark uppercase tracking-wider">
                  Our Journey
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mt-2">
                  From Thirthahalli to North Karnataka's Leader
                </h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Vertical line — left on mobile, center on desktop */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-brand-gold via-brand-emerald to-brand-gold opacity-40" />

              <div className="space-y-8">
                {founderJourney.map((milestone, idx) => (
                  <ScrollReveal
                    key={milestone.year}
                    direction={idx % 2 === 0 ? "left" : "right"}
                    delay={idx * 0.12}
                  >
                    {/* ── Mobile: single column, card full width ── */}
                    <div className="sm:hidden relative pl-10">
                      {/* Dot */}
                      <div className="absolute left-4 top-5 w-3 h-3 rounded-full bg-brand-emerald border-2 border-white shadow -translate-x-1/2" />
                      <div className="group rounded-xl p-4 border"
                        style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.55)', boxShadow: '0 2px 12px rgba(10,61,46,0.07)' }}>
                        <span className="text-[10px] font-black text-brand-gold-dark uppercase tracking-widest">
                          {milestone.year}
                        </span>
                        <h3 className="text-base font-bold text-brand-charcoal mt-1 mb-1.5">
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-brand-charcoal-medium leading-relaxed">
                          {milestone.description}
                        </p>
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                      </div>
                    </div>

                    {/* ── Desktop: alternating left / right ── */}
                    <div className={`hidden sm:grid grid-cols-[1fr_32px_1fr] items-start gap-0`}>
                      {/* Left slot */}
                      {idx % 2 === 0 ? (
                        <div className="group rounded-xl p-5 border mr-6 text-right"
                          style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.55)', boxShadow: '0 2px 16px rgba(10,61,46,0.07)' }}>
                          <span className="text-[10px] font-black text-brand-gold-dark uppercase tracking-widest">{milestone.year}</span>
                          <h3 className="text-base font-bold text-brand-charcoal mt-1 mb-2 group-hover:text-brand-emerald-dark transition-colors">{milestone.title}</h3>
                          <p className="text-sm text-brand-charcoal-medium leading-relaxed">{milestone.description}</p>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Centre dot */}
                      <div className="flex flex-col items-center pt-5">
                        <div className="w-3.5 h-3.5 rounded-full bg-brand-emerald border-[3px] border-white shadow-md shrink-0" />
                      </div>

                      {/* Right slot */}
                      {idx % 2 !== 0 ? (
                        <div className="group rounded-xl p-5 border ml-6 text-left"
                          style={{ background: 'rgba(255,255,255,0.75)', borderColor: 'rgba(255,255,255,0.55)', boxShadow: '0 2px 16px rgba(10,61,46,0.07)' }}>
                          <span className="text-[10px] font-black text-brand-gold-dark uppercase tracking-widest">{milestone.year}</span>
                          <h3 className="text-base font-bold text-brand-charcoal mt-1 mb-2 group-hover:text-brand-emerald-dark transition-colors">{milestone.title}</h3>
                          <p className="text-sm text-brand-charcoal-medium leading-relaxed">{milestone.description}</p>
                          <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-xl bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-brand-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="text-sm font-semibold text-brand-gold-dark uppercase tracking-wider">
                  What We Stand For
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mt-2">
                  Our Core Values
                </h2>
              </div>
            </ScrollReveal>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              staggerDelay={0.15}
            >
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <div className="group rounded-xl p-6 hover:shadow-md transition-all duration-200 border h-full cursor-pointer overflow-hidden relative backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/0 to-brand-gold/0 group-hover:from-brand-emerald/5 group-hover:to-brand-gold/5 transition-all duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-xl ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                      >
                        <value.icon className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-xl font-bold text-brand-charcoal mb-3 group-hover:text-brand-emerald-dark transition-colors duration-300">
                        {value.title}
                      </h3>
                      <p className="text-sm text-brand-charcoal-medium leading-relaxed group-hover:text-brand-charcoal transition-colors duration-300">
                        {value.description}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Promises */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="text-sm font-semibold text-brand-gold-dark uppercase tracking-wider">
                  Our Promise
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mt-2">
                  Why Families Trust Us
                </h2>
              </div>
            </ScrollReveal>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              staggerDelay={0.12}
            >
              {[
                {
                  icon: ShieldCheck,
                  title: "Quality Guaranteed",
                  text: "Every product undergoes strict quality checks before reaching your doorstep.",
                },
                {
                  icon: Truck,
                  title: "Pan-India Delivery",
                  text: "We deliver to 100+ cities with careful packaging to ensure your product arrives perfect.",
                },
                {
                  icon: Clock,
                  title: "Timely Delivery",
                  text: "We respect your time. Every order is processed and dispatched with urgency.",
                },
                {
                  icon: Handshake,
                  title: "Dedicated Support",
                  text: "Our team is always ready to help — from design selection to after-delivery care.",
                },
              ].map((promise) => (
                <StaggerItem key={promise.title}>
                  <div className="group text-center p-5 rounded-xl transition-all duration-200 h-full border cursor-pointer overflow-hidden relative backdrop-blur-sm hover:shadow-md" style={{ background: 'rgba(255,255,255,0.65)', borderColor: 'rgba(255,255,255,0.50)', boxShadow: '0 2px 16px 0 rgba(10,61,46,0.06)' }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    <div className="relative">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-emerald-dark/10 flex items-center justify-center group-hover:bg-brand-emerald-dark group-hover:scale-110 transition-all duration-500">
                        <promise.icon className="w-6 h-6 text-brand-emerald-dark group-hover:text-white group-hover:scale-110 transition-all duration-500" />
                      </div>
                      <h3 className="text-base font-semibold text-brand-charcoal mb-2 group-hover:text-brand-emerald-dark transition-colors duration-300">
                        {promise.title}
                      </h3>
                      <p className="text-sm text-brand-charcoal-medium leading-relaxed group-hover:text-brand-charcoal transition-colors duration-300">
                        {promise.text}
                      </p>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-emerald to-brand-gold scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-700" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Founder Quote */}
        <section className="py-20 bg-gradient-to-br from-brand-emerald-dark via-brand-emerald-deeper to-brand-charcoal relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,168,76,0.1),transparent_50%)]" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <ScrollReveal direction="none">
              <div className="text-center">
                <blockquote className="max-w-3xl mx-auto">
                  <Quote className="w-12 h-12 text-brand-gold/30 mx-auto mb-6" />
                  <p className="text-lg sm:text-xl text-white leading-relaxed font-medium mb-8">
                    "From my humble beginnings in a small taluk to becoming North Karnataka's leading name plate specialist, I continue to innovate, ensuring that every home we touch has a{" "}
                    <span className="text-brand-gold font-bold">world-class identity</span>."
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-brand-gold/30">
                      <img
                        src="/images/raj.jpeg"
                        alt="Rajesh Nayak"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-bold">Rajesh Nayak</p>
                      <p className="text-brand-gold text-sm">Founder, Raj Creations & Graha Pravesh</p>
                    </div>
                  </div>
                </blockquote>

                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8 w-16 h-0.5 bg-brand-gold mx-auto rounded-full"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-brand-cream-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-charcoal mb-4">
                Ready to Give Your Home{" "}
                <span className="text-brand-emerald-dark">Its Identity?</span>
              </h2>
              <p className="text-brand-charcoal-medium mb-8 max-w-xl mx-auto">
                Explore our collection of handcrafted nameplates and premium home
                essentials. Make your home entrance truly yours.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button
                    size="lg"
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Explore Products
                  </Button>
                </Link>
                <a
                  href="https://wa.me/918762625888?text=Hi%20Graha%20Pravesh!%20I%27d%20like%20to%20know%20more%20about%20your%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="secondary">
                    Chat With Us
                  </Button>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
