import React from "react";
import type { UserTab } from "./useStaffUserManagement";
import { SearchBar } from "../../../components/ui/search-bar";
import { PageHeaderWithSearch } from "../../../components/ui/page-header";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  roleFilter: UserTab | "all";
  setRoleFilter: React.Dispatch<React.SetStateAction<UserTab | "all">>;
  institutionFilter: string;
  setInstitutionFilter: (v: string) => void;
  users: Array<any>;
  onAdd: () => void;
}

export function Header({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  institutionFilter,
  setInstitutionFilter,
  users,
  onAdd,
}: Props) {
  return (
    <PageHeaderWithSearch
      title="Gerenciar Usuários"
      description="Cadastre e gerencie os usuários da plataforma"
      searchComponent={
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserTab | "all")}
            className="h-10 px-3 border rounded-md bg-white"
          >
            <option value="all">Todos os cargos</option>
            <option value="student">Estudante</option>
            <option value="teacher_respondent">Professor</option>
            <option value="teacher_analyst">Pesquisador</option>
            <option value="admin">Administrador</option>
          </select>

          <select
            value={institutionFilter}
            onChange={(e) => setInstitutionFilter(e.target.value)}
            className="h-10 px-3 border rounded-md bg-white"
          >
            <option value="all">Todas as instituições</option>
            {[...new Set(users.map((u) => u.institution).filter(Boolean))].map(
              (inst) => {
                const s = String(inst);
                return (
                  <option key={s} value={s}>
                    {s}
                  </option>
                );
              }
            )}
          </select>
        </div>
      }
    >
      <Button
        onClick={onAdd}
        className="h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl"
      >
        <Plus className="w-5 h-5" /> Adicionar Usuário
      </Button>
    </PageHeaderWithSearch>
  );
}

export default Header;
