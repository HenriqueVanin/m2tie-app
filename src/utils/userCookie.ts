import { User } from "../services/userService";

const COOKIE_NAME = "app_user";

export function setUserCookie(user: User) {
  const id = (user as any)._id ?? (user as any).id ?? "";
  const value = encodeURIComponent(
    JSON.stringify({
      _id: id,
      id,
      name: user.name ?? "",
      email: user.email ?? "",
      role: (user as any).role ?? "",
      // Use null explicitly so JSON preserves keys when absent
      city: (user as any).city ?? null,
      state: (user as any).state ?? null,
      institution: (user as any).institution ?? null,
    })
  );
  // Cookie simples, expira em 1 dia
  const expires = new Date(Date.now() + 86400000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; expires=${expires}; path=/`;
}

export function getUserCookie(): User | null {
  const match = document.cookie.match(
    new RegExp("(^| )" + COOKIE_NAME + "=([^;]+)")
  );
  if (!match) return null;
  try {
    const decoded = decodeURIComponent(match[2]);
    const parsed = JSON.parse(decoded);
    // Normalize shape: ensure _id exists and return a compatible object
    const normalized: any = {
      _id: parsed._id ?? parsed.id ?? "",
      name: parsed.name ?? "",
      email: parsed.email ?? "",
      role: parsed.role ?? "",
      city: parsed.city ?? null,
      state: parsed.state ?? null,
      institution: parsed.institution ?? null,
    };
    return normalized;
  } catch {
    return null;
  }
}

export function clearUserCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function getUserInitials(name?: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
