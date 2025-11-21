import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function AuthFallback() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <h1 className="text-xl mb-2 text-gray-800">Acesso Restrito</h1>
        <p className="text-gray-600 mb-4 text-sm">
          Você tentou acessar uma rota protegida sem estar autenticado ou sem
          permissões suficientes.
        </p>
        <p className="text-xs text-gray-500 mb-6">
          Redirecionando para a página inicial em {seconds}s...
        </p>
        <Link
          to="/login"
          className="inline-block px-5 py-3 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  );
}
