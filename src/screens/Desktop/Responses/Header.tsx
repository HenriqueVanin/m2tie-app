import React from "react";
import SearchBar from "../../../components/shared/SearchBar";
import FilterSelect from "../../../components/shared/FilterSelect";
import { PageHeaderWithSearch } from "../../../components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Download } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterForm: string;
  setFilterForm: (v: string) => void;
  filterUser: string;
  setFilterUser: (v: string) => void;
  uniqueForms: string[];
  uniqueUsers: string[];
}

export function Header(props: Props) {
  const {
    searchTerm,
    setSearchTerm,
    filterForm,
    setFilterForm,
    filterUser,
    setFilterUser,
    uniqueForms,
    uniqueUsers,
  } = props;

  return (
    <PageHeaderWithSearch
      title="Respostas de Formulários"
      description="Visualize e gerencie as respostas dos usuários"
      searchComponent={
        <div className="flex gap-4">
          <SearchBar
            placeholder="Buscar por nome, email ou formulário..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1 min-w-[240px]"
          />
          <FilterSelect
            value={filterForm}
            onChange={setFilterForm}
            label="Formulário"
            options={[
              { value: "all", label: "Todos os formulários" },
              ...uniqueForms.map((form) => ({ value: form, label: form })),
            ]}
            className="w-64"
          />
          <FilterSelect
            value={filterUser}
            onChange={setFilterUser}
            label="Usuário"
            options={[
              { value: "all", label: "Todos os usuários" },
              ...uniqueUsers.map((user) => ({ value: user, label: user })),
            ]}
            className="w-64"
          />
        </div>
      }
    >
      <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl">
        <Download className="w-5 h-5" /> Exportar
      </Button>
    </PageHeaderWithSearch>
  );
}

export default Header;
