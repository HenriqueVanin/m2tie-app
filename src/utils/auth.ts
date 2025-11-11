export interface DecodedToken {
    name: string;
    userId: string;
    role: string;
    exp?: number;
  }
  
  export function decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
  
  export function getUserFromToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return decodeToken(token);
  }