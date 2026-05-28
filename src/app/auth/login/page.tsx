"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const TRUST_POINTS = [
  "5,000+ families trust Graha Pravesh",
  "100% handcrafted wooden nameplates",
  "Free shipping on orders above ₹999",
  "7-day easy return guarantee",
];

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      const state = useAuth.getState();
      router.push(state.isAdmin ? "/admin/dashboard" : "/");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL: Brand story ── */}
      <div className="hidden lg:flex w-[60%] relative flex-col overflow-hidden" style={{ backgroundColor: "#051f17" }}>
        {/* layered background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(201,168,76,0.14) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 60% at 90% 90%, rgba(3,12,8,0.55) 0%, transparent 70%)" }} />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* decorative rings */}
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full border border-brand-gold/[0.08] pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full border border-brand-gold/[0.06] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-brand-gold/[0.07] pointer-events-none" />

        {/* content */}
        <div className="relative flex flex-col h-full px-10 py-10 xl:px-14 xl:py-12">

          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 group mb-auto">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center">
              <Home className="w-4 h-4 text-brand-gold" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold tracking-[0.14em] text-white uppercase">
                Graha Pravesh
              </span>
              <span className="text-[9px] text-brand-gold/70 tracking-[0.2em] uppercase mt-0.5">
                Premium Home Essentials
              </span>
            </div>
          </Link>

          {/* central copy */}
          <div className="flex-1 flex flex-col justify-center py-12">
            {/* eyebrow */}
            <div className="inline-flex items-center gap-2 mb-7">
              <div className="w-6 h-px bg-brand-gold/50" />
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.22em]">
                Welcome Back
              </span>
            </div>

            <h2 className="text-[2.25rem] xl:text-[2.625rem] font-bold text-white leading-[1.12] tracking-tight mb-5">
              Your dream home
              <br />
              starts here.
            </h2>

            <p className="text-[0.9375rem] text-emerald-200/75 leading-relaxed max-w-xs mb-10">
              Sign in to browse our handcrafted nameplate collection and manage your orders.
            </p>

            {/* trust list */}
            <ul className="space-y-3.5">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-brand-gold" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[0.8125rem] text-emerald-200/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* bottom founder quote */}
          <div className="border-t border-white/[0.08] pt-7">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-brand-gold/30 shrink-0">
                <img
                  src="/images/raj.jpeg"
                  alt="Rajesh Nayak"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-[0.8125rem] text-emerald-200/80 italic leading-snug">
                  "Every nameplate is a piece of our heart."
                </p>
                <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.16em] mt-1">
                  Rajesh Nayak — Founder
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="w-[40%] flex flex-col items-center justify-center bg-brand-cream-light px-6 sm:px-10 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/images/SAMPAGANGA.jpg" alt="Graha Pravesh" className="h-9 w-auto rounded-lg" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold tracking-wide text-brand-emerald-dark uppercase">
                  Graha Pravesh
                </span>
                <span className="text-[9px] text-brand-gold-muted tracking-widest">
                  Premium Home Essentials
                </span>
              </div>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-9">
            <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.22em] mb-2.5">
              Sign In
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[0.875rem] text-brand-charcoal-light leading-relaxed">
              Enter your credentials to access your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[0.8125rem] font-semibold text-brand-charcoal tracking-tight">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal-light">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-brand-charcoal placeholder:text-brand-charcoal-light/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-emerald/15 focus:border-brand-emerald [&:-webkit-autofill]:![background-color:#ffffff] [&:-webkit-autofill]:[box-shadow:0_0_0_999px_white_inset] ${
                    errors.email
                      ? "bg-white border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-500 shrink-0">!</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[0.8125rem] font-semibold text-brand-charcoal tracking-tight">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal-light">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm text-brand-charcoal placeholder:text-brand-charcoal-light/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-emerald/15 focus:border-brand-emerald [&:-webkit-autofill]:![background-color:#ffffff] [&:-webkit-autofill]:[box-shadow:0_0_0_999px_white_inset] ${
                    errors.password
                      ? "bg-white border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-charcoal-light hover:text-brand-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-500 shrink-0">!</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-emerald hover:bg-brand-emerald-light text-white font-semibold text-[0.875rem] py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-brand-emerald/20 hover:shadow-brand-emerald/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-brand-charcoal-light">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-[0.875rem] text-brand-charcoal-light">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-brand-emerald hover:text-brand-emerald-light transition-colors underline underline-offset-2"
            >
              Create one free
            </Link>
          </p>

          {/* Back to home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-brand-charcoal-light hover:text-brand-charcoal transition-colors group"
            >
              <Home className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
