"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const phoneNumber = "918762625888";
  const message = encodeURIComponent(
    "Hi Graha Pravesh! I'm interested in your products. Can you help me?"
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 transition-all duration-300 ${
          hovered
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 w-56">
          <p className="text-sm font-semibold text-brand-charcoal">
            Need help?
          </p>
          <p className="text-xs text-brand-charcoal-medium mt-0.5">
            Chat with us on WhatsApp
          </p>
        </div>
        <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45" />
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
        >
          <path
            d="M16.004 2.667A13.28 13.28 0 0 0 2.73 15.94a13.2 13.2 0 0 0 1.782 6.627L2.667 29.333l6.98-1.83A13.28 13.28 0 0 0 16.004 29.3 13.28 13.28 0 0 0 29.337 16 13.28 13.28 0 0 0 16.004 2.667Zm0 24.266a10.88 10.88 0 0 1-5.55-1.518l-.398-.236-4.126 1.082 1.1-4.02-.26-.413A10.88 10.88 0 0 1 5.1 16a10.91 10.91 0 0 1 10.904-10.9A10.91 10.91 0 0 1 26.908 16a10.91 10.91 0 0 1-10.904 10.933Zm5.983-8.16c-.328-.164-1.942-.958-2.243-1.068-.301-.109-.52-.164-.74.164-.218.328-.849 1.068-1.04 1.287-.192.22-.383.246-.711.082-.328-.164-1.385-.51-2.638-1.627-.975-.868-1.633-1.942-1.825-2.27-.191-.328-.02-.505.144-.669.148-.147.328-.383.492-.574.164-.192.219-.328.328-.547.11-.22.055-.41-.027-.575-.082-.164-.74-1.784-1.013-2.443-.267-.64-.538-.554-.74-.564-.191-.01-.41-.012-.63-.012-.218 0-.574.082-.875.41-.3.329-1.149 1.124-1.149 2.743 0 1.62 1.176 3.184 1.34 3.403.165.22 2.316 3.537 5.613 4.96.784.338 1.396.54 1.873.692.787.25 1.503.215 2.069.13.631-.094 1.942-.794 2.216-1.56.273-.768.273-1.426.191-1.563-.082-.137-.3-.22-.629-.383Z"
            fill="white"
          />
        </svg>

        {/* Pulse ring */}
        <span className="absolute w-14 h-14 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </a>
    </div>
  );
}
