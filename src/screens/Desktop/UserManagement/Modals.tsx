import React, { useState } from "react";
import type { User } from "../../../services/userService";
import { X, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { getRoleLabel } from "../../../utils/roleLabels";

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User, password?: string, confirmPassword?: string) => void;
}

export function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>(
    user || {
      name: "",
      email: "",
      role: "student",
      anonymous: false,
      city: "",
      state: "",
      institution: "",
    }
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      if (!password || !confirmPassword) return;
      if (password !== confirmPassword) return;
      if (password.length < 6) return;
    }
    onSave(formData as User, password, confirmPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2>{user ? "Editar Usuário" : "Novo Usuário"}</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4 overflow-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name as string}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email as string}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <Input
                  id="institution"
                  value={formData.institution as string}
                  onChange={(e) =>
                    setFormData({ ...formData, institution: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: Universidade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city as string}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: Curitiba"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state as string}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="border"
                  placeholder="Ex: PR"
                />
              </div>
            </div>

            {!user && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border"
                    placeholder="Confirme a senha"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as User["role"],
                  })
                }
                className="w-full h-12 px-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="student">Estudante</option>
                <option value="teacher_respondent">Professor</option>
                <option value="teacher_analyst">Pesquisador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white gap-2"
            >
              <Check className="w-4 h-4" />
              {user ? "Salvar Alterações" : "Cadastrar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;
