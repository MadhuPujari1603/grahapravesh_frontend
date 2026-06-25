import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import "@/styles/globals.css";

// Reduce font weights — 400 + 600 only (was 400/500/600/700)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "600"], // removed 500 + 700 — saves ~40KB
  preload: false,          // decorative font, not critical path
});

// WhatsApp button is below-fold and not critical — lazy load it
const WhatsAppButton = dynamic(
  () => import("@/components/shared/WhatsAppButton"),
  { ssr: false }
);

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL = "https://www.grahapraveshnameplate.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Graha Pravesh | Where Every Dream Home Begins",
  description:
    "Discover premium handcrafted wooden nameplates & home essentials. Personalised nameplates for every home. Shop now — free shipping above ₹999.",
  keywords: "wooden nameplate, customised nameplate, home decor, graha pravesh, door nameplate, personalised nameplate, housewarming gift",
  icons: {
    icon: "/images/SAMPAGANGA.jpg",
    shortcut: "/images/SAMPAGANGA.jpg",
    apple: "/images/SAMPAGANGA.jpg",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Graha Pravesh",
    title: "Graha Pravesh | Premium Handcrafted Wooden Nameplates",
    description:
      "Personalised wooden nameplates crafted with 35 years of artisan expertise. Free shipping above ₹999. Pan-India delivery.",
    images: [{ url: "/images/og-image.jpeg", width: 1200, height: 630, alt: "Graha Pravesh — Premium Wooden Nameplates" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Graha Pravesh | Premium Handcrafted Wooden Nameplates",
    description: "Personalised wooden nameplates crafted with 35 years of artisan expertise.",
    images: ["/images/og-image.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={`${inter.className} antialiased`} style={{ width: "100%" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#1c1917", color: "#fff", fontSize: "14px", borderRadius: "12px", padding: "12px 16px" },
            success: { iconTheme: { primary: "#065f46", secondary: "#fff" } },
            error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
          }}
        />
        {children}
        <WhatsAppButton />
        <div id="modal-root" />
      </body>
    </html>
  );
}
