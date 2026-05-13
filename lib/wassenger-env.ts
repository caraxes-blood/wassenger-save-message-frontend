/** Public API origin (same as `.env.example`). Used only when env is unset in development. */
const DEFAULT_WASSENGER_API_BASE_URL =
  "https://wassenger-save-webhook-message-production.up.railway.app";

export function getWassengerBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_WASSENGER_API_BASE_URL?.trim();
  if (raw) return raw.replace(/\/+$/, "");

  if (process.env.NODE_ENV !== "production") {
    return DEFAULT_WASSENGER_API_BASE_URL;
  }

  throw new Error(
    "NEXT_PUBLIC_WASSENGER_API_BASE_URL is not set. Add it to .env.local (see .env.example) or your deployment environment.",
  );
}
