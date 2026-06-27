/** Same-origin proxy to the backend — sends httpOnly auth cookie with every request. */
const ADMIN_API_BASE = "/api-backend";

export function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${ADMIN_API_BASE}${normalizedPath}`;

  return fetch(url, {
    ...init,
    credentials: "include",
  });
}
