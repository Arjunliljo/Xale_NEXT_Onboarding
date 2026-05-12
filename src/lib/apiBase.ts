const PLATFORM_HOST_SUFFIXES = [".xale.in", ".xale.local"];
const PLATFORM_HOST_EXACT = new Set([
  "xale.in",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
]);

function isPlatformHost(host: string): boolean {
  if (PLATFORM_HOST_EXACT.has(host)) return true;
  return PLATFORM_HOST_SUFFIXES.some((s) => host.endsWith(s));
}

export function isOnTenantDomain(): boolean {
  if (typeof window === "undefined") return false;
  return !isPlatformHost(window.location.hostname.toLowerCase());
}

export function getCrmRedirectBase(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_CRM_URL || "";
  }
  if (isOnTenantDomain()) return window.location.origin;
  return process.env.NEXT_PUBLIC_CRM_URL || window.location.origin;
}
