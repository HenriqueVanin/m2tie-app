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

      <main
        id="faq-main"
        className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-0 mb-4 pb-20"
        aria-labelledby="faq-heading"
      >
        <header className="space-y-6 mt-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center"
              aria-hidden
            >
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 id="faq-heading" className="text-gray-900 text-xl font-bold">
              Central de Ajuda
            </h1>
          </div>

          <section aria-labelledby="support-heading">
            <h2 id="support-heading" className="sr-only">
              Suporte para Estudantes
            </h2>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-sm text-emerald-900 mb-2 font-semibold">
                Suporte para Estudantes
              </p>
              <p className="text-sm text-emerald-700">
                Para dúvidas ou suporte, entre em contato com a equipe de
                administração da sua instituição.
              </p>
            </div>
          </section>
        </header>

        <section aria-labelledby="faq-list-heading" className="space-y-3 mt-4">
          <h2
            id="faq-list-heading"
            className="text-base font-semibold text-gray-900 mb-2"
          >
            Perguntas Frequentes
          </h2>

          <article
            className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700"
            aria-labelledby="q1"
          >
            <h3 id="q1" className="font-semibold">
              Como acesso os formulários?
            </h3>
            <p className="mt-1">
              Os formulários ficam disponíveis na tela inicial após login. Basta
              clicar no formulário desejado para responder.
            </p>
          </article>

          <article
            className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700"
            aria-labelledby="q2"
          >
            <h3 id="q2" className="font-semibold">
              Quem pode visualizar minhas respostas?
            </h3>
            <p className="mt-1">
              Apenas a equipe administrativa da instituição tem acesso às
              respostas, respeitando a privacidade dos estudantes.
            </p>
          </article>

          <article
            className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700"
            aria-labelledby="q3"
          >
            <h3 id="q3" className="font-semibold">
              Como solicitar suporte?
            </h3>
            <p className="mt-1">
              Procure a equipe de administração da sua instituição ou utilize os
              canais oficiais informados na plataforma.
            </p>
          </article>
        </section>
      </main>
    </UserBackgroundLayout>
  );
}
