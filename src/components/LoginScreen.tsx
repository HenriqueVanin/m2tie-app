import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import Logo from "../assets/logo.svg";
import type { UserType } from "../App";
import { authService } from "../services/authService";
import { decodeToken, setTokenCookie } from "../utils/auth";
import { getUserById } from "../services/userService";
import { setUserCookie } from "../utils/userCookie";

interface LoginScreenProps {
  onLogin: (type: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const emailValid = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
  const passwordValid = password.length >= 4;

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await authService.login({ email, password });
      if (!data.token) throw new Error("Token não recebido");
      // Salvar em cookie e localStorage (fallback)
      setTokenCookie(data.token);
      localStorage.setItem("token", data.token);
      const decoded = decodeToken(data.token);
      if (!decoded) throw new Error("Erro ao processar token");
      // Buscar dados completos do usuário
      try {
        const user = await getUserById(decoded.userId);
        setUserCookie(user);
      } catch {
        // fallback: construir objeto mínimo do token
        setUserCookie({
          _id: decoded.userId,
          name: decoded.name,
          email: email,
          role: decoded.role as any,
        });
      }
      const userType: UserType =
        decoded.role === "staff" || decoded.role === "admin" ? "staff" : "user";
      onLogin(userType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      const res = await authService.forgotPassword({ email: forgotEmail });
      setForgotStatus(
        res.message ||
          "Email enviado (se existir). Verifique sua caixa de entrada."
      );
    } catch (err) {
      setForgotStatus(
        err instanceof Error ? err.message : "Falha ao solicitar recuperação"
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gradient-to-br from-emerald-600 to-emerald-700">
      <div className="pt-[48px] pr-[24px] pb-[24px] pl-[30px]">
        <div className="">
          <h1 className="text-white text-3xl mb-2">Olá,</h1>
          <p className="text-emerald-100">
            Entre para acessar seus formulários
          </p>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 space-y-6 rounded-[32px] mx-[10px] mb-4 px-[30px] py-[24px]">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl">
            {error}
          </div>
        )}
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img
              src={Logo}
              alt="M2TIC"
              className="h-[60px] bg-white rounded-[50px] px-[38px] py-[8px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 text-sm">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onBlur={() => setEmailTouched(true)}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-14 border pl-12 bg-white rounded-2xl ${
                  emailTouched && !emailValid
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              />
              {emailTouched && !emailValid && (
                <p className="mt-2 text-xs text-red-600">
                  Formato de email inválido
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 text-sm">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onBlur={() => setPasswordTouched(true)}
                onChange={(e) => setPassword(e.target.value)}
                className={`h-14 border pl-12 pr-12 bg-white rounded-2xl ${
                  passwordTouched && !passwordValid
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button
            className="text-emerald-600 text-sm hover:text-emerald-700"
            type="button"
            onClick={() => setShowForgot(true)}
          >
            Esqueceu a senha?
          </button>
        </div>
        <Button
          onClick={handleLogin}
          disabled={isLoading || !emailValid || !passwordValid}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg rounded-2xl"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </div>
      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Recuperar senha
              </h2>
              <button
                onClick={() => {
                  setShowForgot(false);
                  setForgotStatus(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Informe seu email para receber instruções de redefinição.
            </p>
            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-sm text-gray-700">
                Email
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="h-12 border-gray-200 rounded-xl"
                placeholder="seu.email@exemplo.com"
              />
            </div>
            {forgotStatus && (
              <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200 text-gray-600">
                {forgotStatus}
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForgot(false);
                  setForgotStatus(null);
                }}
                className="flex-1 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleForgotPassword}
                disabled={
                  forgotLoading ||
                  !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(forgotEmail)
                }
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl"
              >
                {forgotLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
