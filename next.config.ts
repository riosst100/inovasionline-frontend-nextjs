import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**", search: "" },
      { protocol: "http", hostname: "localhost", port: "8001", pathname: "/storage/**", search: "" },
      { protocol: "https", hostname: "api.inovasionline.com", pathname: "/storage/**", search: "" },
    ],
  },
  async headers() {
    return [
      {
        // No extension, so Apple/iOS fetches it without a file suffix.
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
