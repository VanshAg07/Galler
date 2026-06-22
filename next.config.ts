import type { NextConfig } from "next";

const defaultApiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://galler-lokb.onrender.com"
    : "http://localhost:5001");

const uploadHost = new URL(defaultApiUrl).hostname;
const uploadProtocol = new URL(defaultApiUrl).protocol.replace(":", "") as "http" | "https";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: uploadProtocol,
        hostname: uploadHost,
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
