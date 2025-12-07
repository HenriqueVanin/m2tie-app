import { useState, useEffect } from "react";
import { getUserFromToken } from "../../../utils/auth";
import { getUserById } from "../../../services/userService";
import { getUserInitials } from "../../../utils/userCookie";
import { getUserCookie, setUserCookie } from "../../../utils/userCookie";
import { authService } from "../../../services/authService";

export function useProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadUserData() {
      // Try cookie first
      const cookie = getUserCookie();
      if (cookie) {
        setName(cookie.name || "Usuário");
        setEmail(cookie.email || "");
        setInstitution((cookie as any).institution ?? "");
        setCity((cookie as any).city ?? "");
        setState((cookie as any).state ?? "");
        // If cookie lacks important profile fields, try to enrich from API
        const missingImportant = !cookie.city || !cookie.institution;
        if (missingImportant) {
          const tokenData = getUserFromToken();
          if (tokenData && tokenData.userId) {
            try {
              const fresh = await getUserById(tokenData.userId);
              // Update state if we got values
              if (fresh.institution) setInstitution(fresh.institution);
              if (fresh.city) setCity(fresh.city);
              if (fresh.state) setState(fresh.state || "");
              // persist enriched cookie
              try {
                setUserCookie(fresh as any);
              } catch {}
            } catch {
              // ignore enrichment failure
            }
          }
        }
        setLoading(false);
        return;
      }

      const tokenData = getUserFromToken();
      if (tokenData && tokenData.userId) {
        try {
          const userData = await getUserById(tokenData.userId);
          setName(userData.name || "Usuário");
          setEmail(userData.email || "");
          setInstitution(userData.institution || "");
          setCity(userData.city || "");
          setState(userData.state || "");
          // persist to cookie for faster load next time
          try {
            setUserCookie(userData as any);
          } catch {}
        } catch (error) {
          console.error("Erro ao carregar dados do usuário:", error);
          setName(tokenData.name || "Usuário");
          setEmail("");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadUserData();
  }, []);

  // Persist profile changes to cookie
  useEffect(() => {
    try {
      setUserCookie({
        _id: undefined as any,
        name,
        email,
        role: "",
        city,
        state,
        institution,
      } as any);
    } catch {}
  }, [name, email, institution, city, state]);

  async function handleForgotPassword() {
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token") || params.get("resetToken") || "";
      const trimmedEmail = (forgotEmail || email || "").trim();

      // If we have a reset token and passwords, perform reset; otherwise request forgot email.
      if (token && newPassword && confirmPassword) {
        const res = await authService.resetPassword({
          token,
          data: { password: newPassword, confirmPassword },
        });
        setForgotStatus(res.msg || "Senha redefinida com sucesso.");
      } else {
        if (!trimmedEmail) {
          setForgotStatus("Informe seu e-mail para recuperar a senha.");
          setForgotLoading(false);
          return;
        }
        const res = await authService.forgotPassword({ email: trimmedEmail });
        setForgotStatus(
          res.msg ||
            "Email enviado (se existir). Verifique sua caixa de entrada."
        );
      }
    } catch (e: any) {
      setForgotStatus(e?.message || "Erro ao processar solicitação.");
    } finally {
      setForgotLoading(false);
    }
  }

  const initials = getUserInitials(name);
  const location = [city, state].filter(Boolean).join(" - ") || "Não informado";

  return {
    name,
    setName,
    email,
    setEmail,
    institution,
    setInstitution,
    city,
    setCity,
    state,
    setState,
    loading,
    showForgot,
    setShowForgot,
    forgotEmail,
    setForgotEmail,
    forgotStatus,
    setForgotStatus,
    forgotLoading,
    setForgotLoading,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleForgotPassword,
    initials,
    location,
  } as const;
}

export default useProfileScreen;
