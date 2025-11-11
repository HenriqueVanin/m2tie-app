import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Logo from "../assets/logo.svg";
import { UserType } from "../App";
import { useState } from "react";
import { decodeToken } from "../utils/auth";

interface LoginScreenProps {
  onLogin: (type?: UserType) => void;
  onNavigateToSignup: () => void;
}

export function LoginScreen({ onLogin, onNavigateToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      // Salvar token
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // Decodificar token para obter a role
        const decoded = decodeToken(data.token);
        
        if (decoded) {
          // Determinar o tipo de usuário baseado na role
          const userType: UserType = 
            decoded.role === "staff" || decoded.role === "admin" 
              ? "staff" 
              : "user";
          
          onLogin(userType);
        } else {
          throw new Error("Erro ao processar token");
        }
      } else {
        throw new Error("Token não recebido");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      {/* Header/Logo */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center">
          <img src={Logo} alt="logo" className="w-48" />
          <h3>App</h3>
        </div>
      </header>
      {/* Formulário */}
      <form
        className="w-full space-y-6"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-12 border-2 border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 border-2 border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button
          type="button"
          onClick={handleLogin}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={onNavigateToSignup}
              className="text-gray-800 font-semibold hover:underline"
            >
              Criar conta
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}