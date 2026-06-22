const PRODUCTION_API_URL = "https://galler-lokb.onrender.com";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production" ? PRODUCTION_API_URL : "http://localhost:5001");
