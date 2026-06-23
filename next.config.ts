import type { NextConfig } from "next";

const defaultApiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://galler-lokb.onrender.com"
    : "http://localhost:5001");

let uploadHost = "localhost";
let uploadProtocol: "http" | "https" = "http";

if (defaultApiUrl) {
  try {
    const parsed = new URL(defaultApiUrl);
    uploadHost = parsed.hostname;
    uploadProtocol = parsed.protocol.replace(":", "") as "http" | "https";
  } catch {
    // keep localhost defaults
  }
}

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
