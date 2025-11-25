import React from "react";
import { SearchBar } from "../../../components/ui/search-bar";
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
            className="flex-1"
          />
          <Select value={filterForm} onValueChange={setFilterForm}>
            <SelectTrigger className="w-64 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-2xl">
              <SelectValue placeholder="Formulário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os formulários</SelectItem>
              {uniqueForms.map((form) => (
                <SelectItem key={form} value={form}>
                  {form}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className="w-64 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-2xl">
              <SelectValue placeholder="Usuário" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
