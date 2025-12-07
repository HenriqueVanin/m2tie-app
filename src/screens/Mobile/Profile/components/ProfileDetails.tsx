import React from "react";
import {
  Mail,
  Lock,
  HelpCircle,
  ChevronRight,
  MapPin,
  Building2,
  Shield,
} from "lucide-react";
import ForgotPasswordModal from "../../../../components/shared/ForgotPasswordModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { Switch } from "../../../../components/ui/switch";
import { Badge } from "../../../../components/ui/badge";

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
  anonymous: boolean;
  setAnonymous: (v: boolean) => void;
  showPrivacy: boolean;
  setShowPrivacy: (v: boolean) => void;
  privacyStatus?: string | null;
  setPrivacyStatus: (v: string | null) => void;
  privacyLoading?: boolean;
  setPrivacyLoading: (v: boolean) => void;
  handleUpdatePrivacy: () => void;
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
  anonymous,
  setAnonymous,
  showPrivacy,
  setShowPrivacy,
  privacyStatus,
  setPrivacyStatus,
  privacyLoading,
  setPrivacyLoading,
  handleUpdatePrivacy,
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
            onClick={() => setShowPrivacy(true)}
            aria-label="Alterar privacidade"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" aria-hidden />
              </div>
              <div>
                <p className="text-gray-900 text-sm">Alterar privacidade</p>
                <p className="text-xs text-gray-500">
                  Controlar identificação nas respostas
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" aria-hidden />
            <span className="sr-only">Abrir opções de privacidade</span>
          </button>

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

          <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
            <DialogContent className="max-w-md rounded-3xl">
              <DialogHeader>
                <DialogTitle>Privacidade do usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      Responder como anônimo
                    </p>
                    <p className="text-sm text-gray-600">
                      Controle se seu nome aparece nas respostas compatíveis.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-700">Status atual</p>
                    <Badge
                      variant={anonymous ? "secondary" : "outline"}
                      className={
                        anonymous
                          ? "bg-emerald-100 text-emerald-700"
                          : "text-gray-600"
                      }
                    >
                      {anonymous ? "Anônimo ativado" : "Anônimo desativado"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label
                      htmlFor="anonymous-switch"
                      className="text-sm text-gray-700"
                    >
                      {anonymous ? "Ativado" : "Desativado"}
                    </Label>
                    <Switch
                      id="anonymous-switch"
                      checked={anonymous}
                      onCheckedChange={setAnonymous}
                    />
                  </div>
                </div>

                {privacyStatus && (
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-700 text-sm">
                    {privacyStatus}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowPrivacy(false)}
                  className="rounded-2xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdatePrivacy}
                  disabled={privacyLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl"
                >
                  {privacyLoading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
