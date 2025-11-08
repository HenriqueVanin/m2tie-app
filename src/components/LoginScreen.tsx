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
    <main className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      {/* Header/Logo */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl mb-4">
          <img src={Logo} alt="logo" />
        </div>
        <h1 className="text-gray-800 text-2xl font-bold">Login</h1>
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
      </form>
    </main>
  );
}
