import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Logo from "../assets/logo.svg";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  onSignupSuccess: () => void;
}

export function SignupScreen({ onNavigateToLogin, onSignupSuccess }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");

    // Validações
    if (!name || !email || !password || !confirmPassword || !role) {
      setError("Todos os campos são obrigatórios");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta");
      }

      // Cadastro bem-sucedido
      onSignupSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      {/* Header/Logo */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center">
          <img src={Logo} alt="logo" className="w-48" />
          <h3>App</h3>
        </div>
        <p className="mt-2 text-gray-600">Criar nova conta</p>
      </header>

      {/* Formulário */}
      <form
        className="w-full space-y-4"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            className="h-12 border-2 border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
            className="h-12 border-2 border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Digite a senha novamente"
            className="h-12 border-2 border-gray-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Tipo de usuário</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-12 border-2 border-gray-300">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">Usuário</SelectItem>
              <SelectItem value="staff">Funcionário</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          onClick={handleSignup}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
          disabled={isLoading}
        >
          {isLoading ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-gray-800 font-semibold hover:underline"
            >
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </main>
  );
}