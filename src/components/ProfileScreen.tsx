import { Camera, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Screen } from "../App";
import { Header } from "./Header";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <main className="flex flex-col min-h-screen max-w-md mx-auto">
      {/* Header */}
      <Header title="Meu Perfil" />

      {/* Content */}
      <section className="flex-1 p-6 space-y-6">
        {/* Avatar */}
        <section
          aria-labelledby="profile-avatar-heading"
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">JP</span>
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <p
              className="text-gray-800 font-medium"
              id="profile-avatar-heading"
            >
              Maria Silva
            </p>
            <p className="text-sm text-gray-500">Membro desde Nov 2025</p>
          </div>
        </section>
        {/* Stats */}
        <section
          className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg"
          aria-label="Estatísticas"
        >
          <div className="text-center">
            <p className="text-gray-800 font-bold">12</p>
            <p className="text-xs text-gray-500">Formulários</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-bold">8</p>
            <p className="text-xs text-gray-500">Completos</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800 font-bold">4</p>
            <p className="text-xs text-gray-500">Pendentes</p>
          </div>
        </section>

        {/* Informações */}
        <section className="space-y-4" aria-label="Informações do perfil">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <p>Maria Silva</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <p>seu@email.com</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth">Faculdade</Label>
            <p>Universidade de São Paulo</p>
          </div>
        </section>

        <Button
          type="button"
          className="w-full h-12 bg-gray-800 hover:bg-gray-700"
        >
          Salvar alterações
        </Button>
      </section>
    </main>
  );
}
