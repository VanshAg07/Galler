/** Express backend (Render) */
export const PRODUCTION_API_URL = "https://galler-lokb.onrender.com";

/** Next.js frontend (Vercel) */
export const PRODUCTION_FRONTEND_URL = "https://galler-pi.vercel.app";

/**
 * Local dev → localhost:5001
 * Production → Render backend (override with NEXT_PUBLIC_API_URL if needed)
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : "http://localhost:5001");
