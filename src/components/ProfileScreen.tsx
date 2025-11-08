import { Camera, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { Screen } from '../App';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b-2 border-gray-200">
        <h1>Meu Perfil</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600">JP</span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center">
            <p className="text-gray-800">João Pedro Silva</p>
            <p className="text-sm text-gray-500">Membro desde Nov 2025</p>
          </div>
        </div>

        {/* Informações */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              defaultValue="João Pedro Silva"
              className="h-12 border-2 border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="email"
                defaultValue="joao@email.com"
                className="h-12 border-2 border-gray-300 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                defaultValue="(11) 98765-4321"
                className="h-12 border-2 border-gray-300 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="location"
                defaultValue="São Paulo, SP"
                className="h-12 border-2 border-gray-300 pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth">Data de nascimento</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="birth"
                type="date"
                defaultValue="1990-01-15"
                className="h-12 border-2 border-gray-300 pl-11"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-lg">
          <div className="text-center">
            <p className="text-gray-800">12</p>
            <p className="text-xs text-gray-500">Formulários</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800">8</p>
            <p className="text-xs text-gray-500">Completos</p>
          </div>
          <div className="text-center">
            <p className="text-gray-800">4</p>
            <p className="text-xs text-gray-500">Pendentes</p>
          </div>
        </div>

        <Button className="w-full h-12 bg-gray-800 hover:bg-gray-700">
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}
