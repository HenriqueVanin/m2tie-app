import {
  Mail,
  Lock,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Screen } from "../App";
import { getUserCookie, getUserInitials } from "../utils/userCookie";
import { getUserFromToken } from "../utils/auth";
import { ScreenHeader } from "./ui/screen-header";
import { UserBackgroundLayout } from "./UserBackgroundLayout";
import { getUserById, type User } from "../services/userService";
import { ForgotPasswordModal } from "./ForgotPasswordModal";
import { useState, useEffect } from "react";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
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

  async function handleForgotPassword() {
    setForgotLoading(true);
    setForgotStatus(null);
    try {
      // Aqui você pode usar o serviço de autenticação igual ao LoginScreen
      // Exemplo:
      // const res = await authService.forgotPassword({ email: forgotEmail });
      // setForgotStatus("Se o email estiver cadastrado, você receberá instruções.");
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
          // Fallback para dados do token
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

  const initials = getUserInitials(name);
  const location = [city, state].filter(Boolean).join(" - ") || "Não informado";
  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações"
        onLogout={onLogout}
      />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4  pb-20">
        <div className="mt-4 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                <span className="text-white text-2xl">{initials}</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-900">{name || "Usuário"}</p>
              {institution && (
                <p className="text-sm text-gray-500">{institution}</p>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <div className="space-y-2">
              <Label className="text-gray-700 text-sm">Nome completo</Label>
              <div className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                {name}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 text-sm">Email</Label>
              <div className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                <Mail className="mr-2 w-5 h-5 text-gray-400" />
                {email}
              </div>
            </div>

            {institution && (
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm">Instituição</Label>
                <div className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                  <Building2 className="mr-2 w-5 h-5 text-gray-400" />
                  {institution}
                </div>
              </div>
            )}

            {(city || state) && (
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm">Localização</Label>
                <div className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                  <MapPin className="mr-2 w-5 h-5 text-gray-400" />
                  {location}
                </div>
              </div>
            )}
            {/* Ações movidas de Configurações */}
            <div className="pt-4 mt-2 border-t border-gray-200 space-y-2 pt-6">
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setShowForgot(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                      <Lock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm">Alterar senha</p>
                      <p className="text-xs text-gray-500">
                        Atualizar senha de acesso
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
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
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  onClick={() => onNavigate("faq")}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm">Central de ajuda</p>
                      <p className="text-xs text-gray-500">Tire suas dúvidas</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
