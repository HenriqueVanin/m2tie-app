import { User } from "../services/userService";

const COOKIE_NAME = "app_user";

export function setUserCookie(user: User) {
  const value = encodeURIComponent(
    JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
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
    return parsed;
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
