import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowLeft } from "lucide-react";

interface SignupScreenProps {
  onSignup: () => void;
  onNavigateToLogin: () => void;
}

export function SignupScreen({
  onSignup,
  onNavigateToLogin,
}: SignupScreenProps) {
  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center gap-4 p-6 border-b-2 border-gray-200">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Criar Conta</h1>
      </header>

      {/* Formulário */}
      <form
        className="flex-1 p-6 space-y-6"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            className="h-12 border-2 border-gray-300"
          />
        </div>

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
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 00000-0000"
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

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="h-12 border-2 border-gray-300"
          />
        </div>

        <div className="flex items-start gap-2 p-4 bg-gray-100 rounded-lg">
          <input type="checkbox" id="terms" className="mt-1" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Aceito os termos de uso e política de privacidade
          </label>
        </div>

        <Button
          type="button"
          onClick={onSignup}
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
        >
          Criar conta
        </Button>
      </form>
    </main>
  );
}
