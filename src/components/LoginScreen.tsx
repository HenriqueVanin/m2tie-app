import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Logo from "../assets/logo.svg";

interface LoginScreenProps {
  onLogin: () => void;
  onNavigateToSignup: () => void;
}

export function LoginScreen({ onLogin, onNavigateToSignup }: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      {/* Logo/Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl mb-4">
          <img src={Logo} alt="logo" />
        </div>
        <h1 className="text-gray-800">Login</h1>
      </div>

      {/* Formulário */}
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="h-12 border-2 border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="h-12 border-2 border-gray-300"
          />
        </div>

        <div className="text-right">
          <button className="text-sm text-gray-600 hover:underline">
            Esqueceu a senha?
          </button>
        </div>

        <Button
          onClick={onLogin}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}
