import { useState, useEffect } from "react";
import { getUserFromToken } from "../../../utils/auth";
import { getUserById } from "../../../services/userService";
import { getUserInitials } from "../../../utils/userCookie";

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

  useEffect(() => {
    async function loadUserData() {
      const tokenData = getUserFromToken();
      if (tokenData && tokenData.userId) {
        try {
          const userData = await getUserById(tokenData.userId);
          setName(userData.name || "Usuário");
          setEmail(userData.email || "");
          setInstitution(userData.institution || "");
          setCity(userData.city || "");
          setState(userData.state || "");
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

  async function handleForgotPassword() {
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      setTimeout(() => {
        setForgotStatus(
          "Se o email estiver cadastrado, você receberá instruções."
        );
        setForgotLoading(false);
      }, 1500);
    } catch (e: any) {
      setForgotStatus("Erro ao enviar solicitação. Tente novamente.");
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
    handleForgotPassword,
    initials,
    location,
  } as const;
}

export default useProfileScreen;
