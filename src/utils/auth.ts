export interface DecodedToken {
  name: string;
  userId: string;
  role: string;
  exp?: number;
}

// Cookie helpers
export function setTokenCookie(token: string): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 dias
  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

export function getTokenFromCookie(): string | null {
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
}

export function removeTokenCookie(): void {
  document.cookie =
    "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
}

export function getUserFromToken(): DecodedToken | null {
  // Buscar primeiro no cookie, depois no localStorage
  let token = getTokenFromCookie();
  if (!token) {
    token = localStorage.getItem("token");
    // Se encontrou no localStorage, migrar para cookie
    if (token) {
      setTokenCookie(token);
    }
  }
  if (!token) return null;
  return decodeToken(token);
}
