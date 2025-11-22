import { Mail } from "lucide-react";
import { UserBackgroundLayout } from "../../../layout/UserBackgroundLayout";
import { ScreenHeader } from "../../../components/ui/screen-header";

export function FAQScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <UserBackgroundLayout>
      <ScreenHeader
        title="Central de Ajuda"
        subtitle="Perguntas Pertinentes e dados de contato"
        onLogout={onLogout}
      />
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4 pb-20">
        <div className="space-y-6 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-gray-900 text-xl font-bold">
              Central de Ajuda
            </h2>
          </div>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
            <p className="text-sm text-emerald-900 mb-2 font-semibold">
              Suporte para Estudantes
            </p>
            <p className="text-sm text-emerald-700">
              Para dúvidas ou suporte, entre em contato com a equipe de
              administração da sua instituição.
            </p>
          </div>
          <div className="space-y-3 mt-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Perguntas Frequentes
            </h3>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700">
              <strong>Como acesso os formulários?</strong>
              <p className="mt-1">
                Os formulários ficam disponíveis na tela inicial após login.
                Basta clicar no formulário desejado para responder.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700">
              <strong>Quem pode visualizar minhas respostas?</strong>
              <p className="mt-1">
                Apenas a equipe administrativa da instituição tem acesso às
                respostas, respeitando a privacidade dos estudantes.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700">
              <strong>Como solicitar suporte?</strong>
              <p className="mt-1">
                Procure a equipe de administração da sua instituição ou utilize
                os canais oficiais informados na plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </UserBackgroundLayout>
  );
}
