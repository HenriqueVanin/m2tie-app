import { useState } from "react";
import type { UserType } from "../../App";
import { authService } from "../../services/authService";
import { decodeToken, setTokenCookie } from "../../utils/auth";
import { getUserById } from "../../services/userService";
import { setUserCookie } from "../../utils/userCookie";

export default function useLoginScreen(onLogin: (type: UserType) => void) {
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      setError("Email e senha são obrigatórios");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Formato de e-mail inválido");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const data = await authService.login({ email, password });
      if (!data.token) throw new Error("Token não recebido");
      setTokenCookie(data.token);
      localStorage.setItem("token", data.token);
      const decoded = decodeToken(data.token);
      if (!decoded) throw new Error("Erro ao processar token");
      try {
        const user = await getUserById(decoded.userId);
        setUserCookie(user);
      } catch {
        setUserCookie({
          _id: decoded.userId,
          name: decoded.name,
          email: email,
          role: decoded.role as any,
        });
      }
      const userType: UserType =
        decoded.role === "teacher_analyst" || decoded.role === "admin"
          ? "staff"
          : "user";
      onLogin(userType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = (forgotEmail || "").trim();
    if (!trimmed) {
      setForgotStatus("Informe seu e-mail para recuperar a senha.");
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setForgotStatus("Formato de e-mail inválido.");
      return;
    }
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      const res = await authService.forgotPassword({ email: trimmed });
      setForgotStatus(
        (res as any).msg ||
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

  return {
    showPassword,
    setShowPassword,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    error,
    setError,
    emailTouched,
    setEmailTouched,
    passwordTouched,
    setPasswordTouched,
    showForgot,
    setShowForgot,
    forgotEmail,
    setForgotEmail,
    forgotStatus,
    setForgotStatus,
    forgotLoading,
    setForgotLoading,
    emailValid,
    passwordValid,
    handleLogin,
    handleForgotPassword,
  } as const;
}
