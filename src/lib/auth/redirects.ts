export type AppRole = "customer" | "admin";

const INTERNAL_ORIGIN = "https://internal.invalid";
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

function isWithinRoot(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(`${root}/`);
}

export function getSafeInternalPath(
  value: string | null | undefined,
  fallback: string,
  allowedRoots: readonly string[],
) {
  if (!value || value !== value.trim()) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || CONTROL_CHARACTERS.test(value)) return fallback;

  try {
    const candidate = new URL(value, INTERNAL_ORIGIN);
    const decodedPath = decodeURIComponent(candidate.pathname);

    if (candidate.origin !== INTERNAL_ORIGIN) return fallback;
    if (decodedPath.startsWith("//") || decodedPath.includes("\\")) return fallback;
    if (!allowedRoots.some((root) => isWithinRoot(candidate.pathname, root))) {
      return fallback;
    }

    return `${candidate.pathname}${candidate.search}`;
  } catch {
    return fallback;
  }
}

export function getPortalHome(role: AppRole) {
  return role === "admin" ? "/admin" : "/dashboard";
}

export function getPostAuthDestination(
  role: AppRole,
  requestedPath: string | null | undefined,
) {
  const home = getPortalHome(role);
  return getSafeInternalPath(requestedPath, home, [home]);
}
