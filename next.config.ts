import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/nearby", destination: "/", permanent: false },
      { source: "/nearby/:path*", destination: "/", permanent: false },
      { source: "/order", destination: "/", permanent: false },
      { source: "/order/:path*", destination: "/", permanent: false },
      { source: "/delivery", destination: "/checkout/location", permanent: false },
      { source: "/checkout", destination: "/cart", permanent: false },
      { source: "/instagram", destination: "/", permanent: false },
      { source: "/app", destination: "/", permanent: false },
      { source: "/category", destination: "/", permanent: false },
      { source: "/category/:path*", destination: "/", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
