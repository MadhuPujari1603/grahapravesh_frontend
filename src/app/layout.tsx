import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";
import WhatsAppButton from "@/components/shared/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Graha Pravesh | Where Every Dream Home Begins",
  description:
    "Discover premium home essentials with Graha Pravesh. Shop curated products for your dream home with elegance and quality.",
  keywords: "premium, home, e-commerce, graha pravesh, housewarming, home decor, shopping",
  icons: {
    icon: "/images/SAMPAGANGA.jpg",
    shortcut: "/images/SAMPAGANGA.jpg",
    apple: "/images/SAMPAGANGA.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`} style={{ overflowX: 'hidden' }}>
      <body className={`${inter.className} antialiased`} style={{ overflowX: 'hidden', width: '100%' }}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1c1917",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#065f46",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
