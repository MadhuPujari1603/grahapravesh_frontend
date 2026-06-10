"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-emerald-dark text-white">

      {/* ── Main footer columns ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/images/SAMPAGANGA.jpg" alt="Graha Pravesh" width={32} height={32} className="rounded-lg object-cover brightness-110" loading="lazy" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                <span className="text-white" style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1, display: 'block' }}>
                  Graha Pravesh
                </span>
                <span className="text-brand-gold" style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.16em', lineHeight: 1, display: 'block', textTransform: 'uppercase', marginLeft: '-0.08em' }}>
                  Premium Home Essentials
                </span>
              </div>
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed mb-4">
              35 years of hand-crafted wooden nameplates. Every piece shaped with patience, pride and genuine love for the craft.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQs", href: "/faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-emerald-200 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold mb-3">
              Policies
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Refund Policy", href: "/refund-policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs text-emerald-200 hover:text-brand-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold mb-3">
              Contact Us
            </h4>

            {/* Compact map embed */}
            <div className="rounded-lg overflow-hidden mb-3" style={{ height: '120px', border: '1px solid rgba(255,255,255,0.12)' }}>
              <iframe
                title="Raj Creations Map"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0, display: 'block', filter: 'grayscale(25%) contrast(1.05) brightness(0.9)' }}
                src="https://www.google.com/maps?q=Raj+Creations,+1st+Gate,+M.T+SAGAR,+Shop+No+209/B,+Gokul+Rd,+near+BSNL+office,+Industrial+Estate,+Hubballi,+Karnataka+580030&output=embed"
              />
            </div>

            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-xs text-emerald-200">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-brand-gold/60" />
                <span className="leading-relaxed">Shop No. 209/B, Gokul Road,<br />Industrial Estate,<br />Hubballi, Karnataka 580030</span>
              </li>
              <li>
                <a href="tel:+918762625888" className="flex items-center gap-2 text-xs text-emerald-200 hover:text-brand-gold transition-colors">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-brand-gold/60" />
                  +91 87626 25888
                </a>
              </li>
              <li>
                <a href="mailto:grahapravesh21@gmail.com" className="flex items-center gap-2 text-xs text-emerald-200 hover:text-brand-gold transition-colors">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-brand-gold/60" />
                  grahapravesh21@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-2xs text-emerald-300">
            &copy; {new Date().getFullYear()} Graha Pravesh. All rights reserved.
          </p>
          <p className="text-2xs text-emerald-300/50">
            Handcrafted with ❤️ in Hubballi, Karnataka
          </p>
        </div>
      </div>
    </footer>
  );
}
