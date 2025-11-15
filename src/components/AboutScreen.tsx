import { Info, Heart, Mail, Users } from "lucide-react";
import type { Screen } from "../App";
import { ScreenHeader } from "./ui/screen-header";

interface AboutScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <ScreenHeader
        title="Sobre"
        subtitle="Conheça nossa plataforma educacional"
      />

      {/* Content */}
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4">
        <div className="space-y-6 mt-4">
          {/* Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-gray-900">Nossa Missão</h2>
            </div>
            <p className="text-gray-600">
              Facilitar a comunicação entre instituições de ensino e estudantes
              através de formulários institucionais modernos e eficientes.
            </p>
          </div>

          {/* About Platform */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-gray-900">Sobre a Plataforma</h2>
            </div>
            <p className="text-gray-600">
              Plataforma educacional desenvolvida para atender estudantes de
              diferentes universidades como UNIFESP, USP, UNESP, UNICAMP e
              UFABC. Nossa solução permite que a equipe de administração
              gerencie formulários e acompanhe respostas de forma centralizada.
            </p>
          </div>

          {/* Universities */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-gray-900">Instituições Atendidas</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["UNIFESP", "USP", "UNESP", "UNICAMP", "UFABC"].map((uni) => (
                <div
                  key={uni}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-center"
                >
                  <p className="text-gray-900">{uni}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-gray-900">Contato</h2>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <p className="text-sm text-emerald-900 mb-2">
                <strong>Suporte para Estudantes</strong>
              </p>
              <p className="text-sm text-emerald-700">
                Para dúvidas ou suporte, entre em contato com a equipe de
                administração da sua instituição.
              </p>
            </div>
          </div>

          {/* Version */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">Versão 1.0.0</p>
            <p className="text-center text-xs text-gray-400 mt-1">
              © 2025 M2TIC - Plataforma Educacional
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
