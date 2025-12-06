import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Helper para obter token (cookies primeiro, depois localStorage)
function getToken(): string | null {
  // Buscar no cookie primeiro
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((row) => row.startsWith("token="));
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }
  // Fallback para localStorage
  return localStorage.getItem("token");
}

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Envia nos dois formatos para compatibilidade com backends diferentes
      config.headers.Authorization = `Bearer ${token}`;
      (config.headers as any)["auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem("token");
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
