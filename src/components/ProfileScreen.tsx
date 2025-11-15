import { Mail } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import type { Screen } from "../App";
import { useEffect, useState } from "react";
import { getUserCookie, getUserInitials } from "../utils/userCookie";
import { ScreenHeader } from "./ui/screen-header";

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("Universidade"); // placeholder sem backend
  useEffect(() => {
    const user = getUserCookie();
    if (user) {
      setName(user.name || "Usuário");
      setEmail(user.email || "");
    }
  }, []);
  const initials = getUserInitials(name);
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative">
      <ScreenHeader title="Meu Perfil" subtitle="Gerencie suas informações" />

      {/* Content */}
      <div className="relative z-10 flex-1 bg-white p-6 space-y-6 rounded-[32px] mx-[10px] my-[0px] mb-4">
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
              <p className="text-sm text-gray-500">{institution}</p>
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 text-sm">
                Nome completo
              </Label>
              <Input
                id="name"
                value={name}
                readOnly
                className="h-12 border-gray-200 bg-white rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution" className="text-gray-700 text-sm">
                Instituição
              </Label>
              <Input
                id="institution"
                value={institution}
                readOnly
                className="h-12 border-gray-200 bg-white rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-sm">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  value={email}
                  readOnly
                  className="h-12 border-gray-200 pl-11 bg-white rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
