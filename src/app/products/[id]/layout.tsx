import type { Metadata } from "next";

const BASE_URL = "https://www.grahapraveshnameplate.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/products/${params.id}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    if (!res.ok) throw new Error("Product not found");

    const data = await res.json();
    const product = data.data;

    const imageUrl =
      product?.images?.[0] ||
      `${BASE_URL}/images/og-image.jpg`;

    const absoluteImage = imageUrl.startsWith("http")
      ? imageUrl
      : `${BASE_URL}${imageUrl}`;

    const title = `${product.name} | Graha Pravesh`;
    const description =
      product.description?.slice(0, 155) ||
      "Handcrafted premium wooden nameplate — personalised for your home.";

    return {
      title,
      description,
      openGraph: {
        type: "website",
        url: `${BASE_URL}/products/${params.id}`,
        siteName: "Graha Pravesh",
        title,
        description,
        images: [
          {
            url: absoluteImage,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [absoluteImage],
      },
    };
  } catch {
    return {
      title: "Product | Graha Pravesh",
      description: "Handcrafted premium wooden nameplates for every home.",
      openGraph: {
        images: [`${BASE_URL}/images/og-image.jpeg`],
      },
    };
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
