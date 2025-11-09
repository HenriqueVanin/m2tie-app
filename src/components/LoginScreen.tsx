import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Logo from "../assets/logo.svg";
import { UserType } from "../App";

interface LoginScreenProps {
  onLogin: (type?: UserType) => void;
  onNavigateToSignup: () => void;
}

export function LoginScreen({ onLogin, onNavigateToSignup }: LoginScreenProps) {
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
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button
          type="button"
          onClick={onLogin}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
        >
          Entrar
        </Button>

        <Button
          onClick={() => onLogin("staff")}
          variant="outline"
          className="w-full h-12 border"
        >
          Entrar como Staff
        </Button>
      </form>
    </main>
  );
}
