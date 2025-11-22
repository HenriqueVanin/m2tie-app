import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import Logo from "../../assets/logo.svg";
import type { UserType } from "../../App";
import useLoginScreen from "./useLoginScreen";
import { UserBackgroundLayout } from "../../layout/UserBackgroundLayout";
import { ForgotPasswordModal } from "../../components/ForgotPasswordModal";

interface LoginScreenProps {
  onLogin: (type: UserType) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    emailTouched,
    setEmailTouched,
    passwordTouched,
    setPasswordTouched,
    showForgot,
    setShowForgot,
    forgotEmail,
    setForgotEmail,
    forgotStatus,
    forgotLoading,
    setForgotStatus,
    setForgotLoading,
    emailValid,
    passwordValid,
    handleLogin,
    handleForgotPassword,
  } = useLoginScreen(onLogin as (type: UserType) => void);

  return (
    <UserBackgroundLayout centered>
      <div aria-hidden className="pt-[48px] pr-[24px] pb-[24px] pl-[30px]" />
      <div className="flex justify-center items-center">
        <main>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && emailValid && passwordValid) {
                handleLogin();
              }
            }}
            className="flex-1 bg-white shadow-md space-y-6 rounded-[32px] mx-[10px] px-[30px] py-[32px] mb-8"
            aria-labelledby="login-heading"
          >
            <h1 id="login-heading" className="sr-only">
              Entrar no M2TIE
            </h1>
            <header
              className="flex items-center justify-center py-4"
              aria-hidden
            >
              <img
                src={Logo}
                alt="M2TIE Logo"
                className="h-24 px-[38px] py-[8px]"
              />
            </header>
            {error && (
              <div
                className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl"
                role="alert"
              >
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    aria-hidden
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-14 border pl-12 bg-white rounded-2xl ${
                      emailTouched && !emailValid
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    aria-invalid={emailTouched && !emailValid}
                    aria-describedby={
                      emailTouched && !emailValid ? "email-error" : undefined
                    }
                  />
                </div>
                {emailTouched && !emailValid && (
                  <p id="email-error" className="mt-2 text-xs text-red-600">
                    Formato de email inválido
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-sm">
                  Senha
                </Label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    aria-hidden
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onBlur={() => setPasswordTouched(true)}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-14 border pl-12 pr-12 bg-white rounded-2xl ${
                      passwordTouched && !passwordValid
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                    aria-describedby={
                      passwordTouched && !passwordValid
                        ? "password-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-pressed={showPassword}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden />
                    )}
                  </button>
                </div>
                {passwordTouched && !passwordValid && (
                  <p id="password-error" className="mt-2 text-xs text-red-600">
                    A senha precisa ter pelo menos 4 caracteres
                  </p>
                )}
              </div>
              <button
                className="text-emerald-600 text-sm hover:text-emerald-700"
                type="button"
                onClick={() => setShowForgot(true)}
                aria-label="Esqueceu a senha"
              >
                Esqueceu a senha?
              </button>
            </div>
            <Button
              type="submit"
              disabled={isLoading || !emailValid || !passwordValid}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg rounded-2xl"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </main>
      </div>
      <ForgotPasswordModal
        open={showForgot}
        email={forgotEmail}
        status={forgotStatus}
        loading={forgotLoading}
        onEmailChange={setForgotEmail}
        onSend={handleForgotPassword}
        onClose={() => {
          setShowForgot(false);
          setForgotStatus(null);
        }}
      />
    </UserBackgroundLayout>
  );
}
