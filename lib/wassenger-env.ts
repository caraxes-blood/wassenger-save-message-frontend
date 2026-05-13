export function getWassengerBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_WASSENGER_API_BASE_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_WASSENGER_API_BASE_URL is not set");
  }
  return raw.replace(/\/+$/, "");
}
