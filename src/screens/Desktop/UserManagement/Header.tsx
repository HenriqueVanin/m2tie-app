import React from "react";
import type { UserTab } from "./useStaffUserManagement";
import SearchBar from "../../../components/shared/SearchBar";
import FilterSelect from "../../../components/shared/FilterSelect";
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
        <div className="flex items-center gap-3 flex-wrap">
          <SearchBar
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1"
          />

          <FilterSelect
            value={roleFilter}
            onChange={(v) => setRoleFilter(v as UserTab | "all")}
            label="Cargo"
            options={[
              { value: "all", label: "Todos os cargos" },
              { value: "student", label: "Estudante" },
              { value: "teacher_respondent", label: "Professor" },
              { value: "teacher_analyst", label: "Pesquisador" },
              { value: "admin", label: "Administrador" },
            ]}
          />

          <FilterSelect
            value={institutionFilter}
            onChange={(v) => setInstitutionFilter(v)}
            label="Instituição"
            options={[
              { value: "all", label: "Todas as instituições" },
              ...[
                ...new Set(users.map((u) => u.institution).filter(Boolean)),
              ].map((inst) => ({ value: String(inst), label: String(inst) })),
            ]}
          />
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
