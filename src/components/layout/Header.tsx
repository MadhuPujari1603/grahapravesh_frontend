"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  User,
  UserCircle,
  Menu,
  X,
  LogOut,
  Package,
  Search,
  LayoutDashboard,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const cartCount = useCart((s) => s.cartCount);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(240, 235, 224, 0.96)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.55)",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.7) inset, 0 4px 24px 0 rgba(10,61,46,0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/images/SAMPAGANGA.jpg" alt="Graha Pravesh" width={32} height={32} className="rounded-lg object-cover" priority />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
              <span
                className="text-brand-emerald-dark"
                style={{ fontSize: '19px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1, display: 'block' }}
              >
                Graha Pravesh
              </span>
              <span
                className="text-brand-gold-dark"
                style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.22em', lineHeight: 1, display: 'block', textTransform: 'uppercase' }}
              >
                Premium Home Essentials
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-brand-charcoal-medium hover:text-brand-emerald hover:bg-white/50 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-brand-charcoal-medium hover:bg-white/50 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-brand-charcoal-medium hover:bg-white/50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && cartCount() > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-brand-emerald text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount() > 9 ? "9+" : cartCount()}
                </span>
              )}
            </Link>

            {/* User Menu / Auth Buttons */}
            {!mounted ? (
              <div className="w-8 h-8" />
            ) : isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-brand-charcoal-medium hover:bg-white/50 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-emerald flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-brand-charcoal truncate max-w-[100px]">
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-xl py-1 animate-slide-down"
                    style={{
                      background: "rgba(250, 247, 240, 0.88)",
                      backdropFilter: "blur(20px) saturate(180%)",
                      WebkitBackdropFilter: "blur(20px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.65)",
                      boxShadow: "0 8px 32px 0 rgba(10,61,46,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
                    }}
                  >
                    <div className="px-3 py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.45)" }}>
                      <p className="text-sm font-semibold text-brand-charcoal truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-brand-charcoal-light truncate">
                        {user?.email}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-brand-charcoal-medium hover:bg-white/50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-brand-charcoal-medium hover:bg-white/50 transition-colors"
                    >
                      <UserCircle className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-brand-charcoal-medium hover:bg-white/50 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm font-medium text-brand-charcoal-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-2 text-sm font-medium bg-brand-emerald text-white rounded-lg hover:bg-brand-emerald-light transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-brand-charcoal-medium hover:bg-white/50 transition-colors ml-1"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
            <div className="pb-3 pt-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-light" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden animate-slide-down"
          style={{
            background: "rgba(240, 235, 224, 0.70)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            borderTop: "1px solid rgba(255,255,255,0.50)",
          }}
        >
          <div className="px-4 py-3 space-y-0.5">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal-light" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-emerald/20 focus:border-brand-emerald transition-all"
                />
              </div>
            </form>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-brand-charcoal-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-100 space-y-0.5">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-brand-charcoal-medium hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-brand-emerald hover:bg-green-50 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
