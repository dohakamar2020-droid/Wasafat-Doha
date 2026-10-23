export function siteURL() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || "https://wasafat-doha-woad.vercel.app";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://wasafat-doha-woad.vercel.app";
  }
}
