import {
  Mail,
  Lock,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import type { Screen } from "../../../App";
import { ScreenHeader } from "../../../components/ui/screen-header";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";
import { ForgotPasswordModal } from "../../../components/ForgotPasswordModal";
import { useProfileScreen } from "./useProfileScreen";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const {
    name,
    email,
    institution,
    city,
    state,
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
  } = useProfileScreen();
  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações"
        onLogout={onLogout}
      />

      <main className="relative z-10 flex-1 bg-white mb-4 p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] pb-20">
        <section
          aria-labelledby="profile-heading"
          className="mt-4 space-y-6 mb-4"
        >
          <header
            className="flex flex-col items-center gap-4"
            id="profile-heading"
          >
            <figure className="relative">
              <div
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl"
                aria-hidden
              >
                <span className="text-white text-2xl" aria-hidden>
                  {initials}
                </span>
              </div>
              <figcaption className="sr-only">
                Avatar do usuário {name}
              </figcaption>
            </figure>
            <div className="text-center">
              <p className="text-gray-900">{name || "Usuário"}</p>
              {institution && (
                <p className="text-sm text-gray-500">{institution}</p>
              )}
            </div>
          </header>

          <section
            aria-labelledby="info-heading"
            className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-200"
          >
            <h2 id="info-heading" className="sr-only">
              Informações
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-700 text-sm">Nome completo</dt>
                <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                  {name}
                </dd>
              </div>

              <div>
                <dt className="text-gray-700 text-sm">Email</dt>
                <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                  <Mail className="mr-2 w-5 h-5 text-gray-400" />
                  {email}
                </dd>
              </div>

              {institution && (
                <div>
                  <dt className="text-gray-700 text-sm">Instituição</dt>
                  <dd className="h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                    <Building2 className="mr-2 w-5 h-5 text-gray-400" />
                    {institution}
                  </dd>
                </div>
              )}

              {(city || state) && (
                <div>
                  <dt className="text-gray-700 text-sm">Localização</dt>
                  <dd>
                    <address className="not-italic h-12 flex items-center px-4 bg-white rounded-xl border border-gray-200 text-gray-900">
                      <MapPin
                        className="mr-2 w-5 h-5 text-gray-400"
                        aria-hidden
                      />
                      <span>{location}</span>
                    </address>
                  </dd>
                </div>
              )}
            </dl>

            <div className="pt-4 mt-2 border-t border-gray-200 space-y-2 pt-6">
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden">
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                  onClick={() => setShowForgot(true)}
                  aria-label="Alterar senha"
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
                  <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
                  <span className="sr-only">Ir para alterar senha</span>
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
                  aria-label="Central de ajuda"
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
                  <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
                  <span className="sr-only">Ir para central de ajuda</span>
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </UserBackgroundLayout>
  );
}
