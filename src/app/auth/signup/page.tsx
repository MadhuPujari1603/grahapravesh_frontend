"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Home, CheckCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(6, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Only digits allowed — no spaces, dashes or letters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const PERKS = [
  { icon: "🏠", label: "Access premium nameplate designs" },
  { icon: "📦", label: "Track your orders in real time" },
  { icon: "🎁", label: "Exclusive member discounts & offers" },
  { icon: "🔒", label: "Secure checkout, always" },
];

const COUNTRY_CODES = [
  { code: "+91",  iso: "in", name: "India" },
  { code: "+1",   iso: "us", name: "USA" },
  { code: "+44",  iso: "gb", name: "UK" },
  { code: "+61",  iso: "au", name: "Australia" },
  { code: "+971", iso: "ae", name: "UAE" },
  { code: "+65",  iso: "sg", name: "Singapore" },
  { code: "+60",  iso: "my", name: "Malaysia" },
  { code: "+49",  iso: "de", name: "Germany" },
  { code: "+33",  iso: "fr", name: "France" },
  { code: "+81",  iso: "jp", name: "Japan" },
];

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryDrop, setShowCountryDrop] = useState(false);
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];
  const dropRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setShowCountryDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    // Prepend country code before submitting
    const success = await signup({ ...data, phone: `${countryCode}${data.phone}` });
    if (success) {
      router.push("/");
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
            <div className="inline-flex items-center gap-2 mb-7">
              <div className="w-6 h-px bg-brand-gold/50" />
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.22em]">
                Join Us
              </span>
            </div>

            <h2 className="text-[2.25rem] xl:text-[2.625rem] font-bold text-white leading-[1.12] tracking-tight mb-5">
              Elevate every
              <br />
              corner of your home.
            </h2>

            <p className="text-[0.9375rem] text-emerald-200/75 leading-relaxed max-w-xs mb-10">
              Create a free account and discover handcrafted nameplates made for homes that tell a story.
            </p>

            {/* perks */}
            <ul className="space-y-3.5">
              {PERKS.map((perk) => (
                <li key={perk.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0 text-sm">
                    {perk.icon}
                  </div>
                  <span className="text-[0.8125rem] text-emerald-200/80">{perk.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* bottom stat strip */}
          <div className="border-t border-white/[0.08] pt-7 grid grid-cols-3 gap-4">
            {[
              { val: "5K+", label: "Customers" },
              { val: "4.9★", label: "Avg Rating" },
              { val: "100%", label: "Handmade" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-white leading-none">{s.val}</p>
                <p className="text-[10px] text-emerald-300/55 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center bg-brand-cream-light px-6 sm:px-10 py-12">
        <div className="w-full max-w-[420px]">

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
          <div className="mb-8">
            <p className="text-[10px] font-bold text-brand-gold-dark uppercase tracking-[0.22em] mb-2.5">
              Create Account
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-charcoal tracking-tight leading-tight mb-2">
              Start your journey
            </h1>
            <p className="text-[0.875rem] text-brand-charcoal-light leading-relaxed">
              Join thousands of families who love Graha Pravesh.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[0.8125rem] font-semibold text-brand-charcoal tracking-tight">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-charcoal-light">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-brand-charcoal placeholder:text-brand-charcoal-light/60 outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-emerald/15 focus:border-brand-emerald [&:-webkit-autofill]:![background-color:#ffffff] [&:-webkit-autofill]:[box-shadow:0_0_0_999px_white_inset] ${
                    errors.name
                      ? "bg-white border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-500 shrink-0">!</span>
                  {errors.name.message}
                </p>
              )}
            </div>

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

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="block text-[0.8125rem] font-semibold text-brand-charcoal tracking-tight">
                Phone Number
              </label>
              <div className={`flex rounded-xl border overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-brand-emerald/15 focus-within:border-brand-emerald ${
                errors.phone
                  ? "border-red-300"
                  : "border-gray-200 hover:border-gray-300"
              }`}>
                {/* Country code selector */}
                <div ref={dropRef} className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowCountryDrop((p) => !p)}
                    className="flex items-center gap-1.5 h-full px-3 bg-gray-50 border-r border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                      alt={selectedCountry.name}
                      width={20}
                      height={14}
                      className="rounded-sm object-cover"
                    />
                    <span className="text-sm font-medium text-brand-charcoal">{selectedCountry.code}</span>
                    <svg className="w-3 h-3 text-brand-charcoal-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {showCountryDrop && (
                    <div className="absolute top-full left-0 z-50 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => { setCountryCode(c.code); setShowCountryDrop(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            c.code === countryCode ? "bg-brand-emerald/5 text-brand-emerald font-medium" : "text-brand-charcoal"
                          }`}
                        >
                          <img
                            src={`https://flagcdn.com/w20/${c.iso}.png`}
                            alt={c.name}
                            width={20}
                            height={14}
                            className="rounded-sm object-cover shrink-0"
                          />
                          <span>{c.name}</span>
                          <span className="ml-auto text-brand-charcoal-light">{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Digits only input */}
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  autoComplete="tel-national"
                  className="flex-1 px-3 py-3 text-sm text-brand-charcoal placeholder:text-brand-charcoal-light/60 outline-none bg-white [&:-webkit-autofill]:![background-color:#ffffff] [&:-webkit-autofill]:[box-shadow:0_0_0_999px_white_inset]"
                  {...register("phone", {
                    onChange: (e) => {
                      // Strip any non-digit characters as user types
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-500 shrink-0">!</span>
                  {errors.phone.message}
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
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
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

            {/* Terms */}
            <p className="text-[11px] text-brand-charcoal-light leading-relaxed pt-1">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="text-brand-emerald hover:underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy-policy" className="text-brand-emerald hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 bg-brand-emerald hover:bg-brand-emerald-light text-white font-semibold text-[0.875rem] py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-brand-emerald/20 hover:shadow-brand-emerald/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-brand-charcoal-light">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Sign in link */}
          <p className="text-center text-[0.875rem] text-brand-charcoal-light">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-brand-emerald hover:text-brand-emerald-light transition-colors underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>

          {/* Back to home */}
          <div className="mt-7 text-center">
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
