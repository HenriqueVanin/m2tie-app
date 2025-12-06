import React from "react";
import {
  Mail,
  Lock,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import ForgotPasswordModal from "../../../../components/shared/ForgotPasswordModal";

interface Props {
  name?: string | null;
  email?: string | null;
  institution?: string | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
  showForgot: boolean;
  setShowForgot: (v: boolean) => void;
  forgotEmail?: string;
  setForgotEmail: (v: string) => void;
  forgotStatus?: string | null;
  setForgotStatus: (v: string | null) => void;
  forgotLoading?: boolean;
  setForgotLoading: (v: boolean) => void;
  handleForgotPassword: () => void;
  onNavigateToFAQ: () => void;
}

export default function ProfileDetails({
  name,
  email,
  institution,
  city,
  state,
  location,
  showForgot,
  setShowForgot,
  forgotEmail,
  setForgotEmail,
  forgotStatus,
  setForgotStatus,
  forgotLoading,
  setForgotLoading,
  handleForgotPassword,
  onNavigateToFAQ,
}: Props) {
  return (
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
                <MapPin className="mr-2 w-5 h-5 text-gray-400" aria-hidden />
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
            email={forgotEmail ?? ""}
            status={forgotStatus ?? ""}
            loading={forgotLoading ?? false}
            onEmailChange={setForgotEmail}
            onSend={handleForgotPassword}
            onClose={() => {
              setShowForgot(false);
              setForgotStatus(null);
            }}
          />

          <button
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            onClick={onNavigateToFAQ}
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
  );
}
