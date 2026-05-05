import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sarambi.com.br",
      },
      {
        protocol: "https",
        hostname: "**.fashn.ai",
      },
      {
        protocol: "https",
        hostname: "**.replicate.delivery",
      },
      {
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
    ],
  },
};

export default nextConfig;
