/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 128, 192, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days browser cache
    remotePatterns: [
      { protocol: "https", hostname: "*.blob.core.windows.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // CDN & browser cache headers
  async headers() {
    return [
      {
        // Static assets — 1 year immutable cache
        source: "/:path*.(js|css|woff|woff2|ttf|otf|ico|svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Images — 30 day cache
        source: "/:path*.(jpg|jpeg|png|gif|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
      {
        // HTML pages — revalidate quickly
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  },
};

module.exports = nextConfig;
