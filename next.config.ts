import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75],
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**", search: "" },
      { protocol: "http", hostname: "localhost", port: "8001", pathname: "/storage/**", search: "" },
    ],
  },
};

export default nextConfig;
