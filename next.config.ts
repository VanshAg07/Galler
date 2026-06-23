import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

let uploadHost = "localhost";
let uploadProtocol: "http" | "https" = "http";
let uploadPort = "5001";

try {
  const parsed = new URL(apiUrl);
  uploadHost = parsed.hostname;
  uploadProtocol = parsed.protocol.replace(":", "") as "http" | "https";
  uploadPort = parsed.port || (uploadProtocol === "https" ? "443" : "80");
} catch {
  // keep localhost defaults
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
      ...(uploadHost !== "localhost"
        ? [
            {
              protocol: uploadProtocol,
              hostname: uploadHost,
              ...(uploadPort && uploadPort !== "443" && uploadPort !== "80"
                ? { port: uploadPort }
                : {}),
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
