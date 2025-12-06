import React from "react";
import type { User } from "../../../services/userService";
import { Mail, Edit, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { ErrorState } from "../../../components/ui/error-state";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../components/ui/table";

interface Props {
  loading: boolean;
  error: string | null;
  users: User[];
  filteredUsers: User[];
  fetchUsers: () => void;
  onEdit: (u: User) => void;
  onDelete: (id: string) => void;
  getRoleLabel: (role: string) => string;
  getRoleColor: (role: string) => string;
}

export function TableView({
  loading,
  error,
  users,
  filteredUsers,
  fetchUsers,
  onEdit,
  onDelete,
  getRoleLabel,
  getRoleColor,
}: Props) {
  return (
    <div className="flex-1 overflow-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003087] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Carregando usuários...
            </p>
          </div>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={fetchUsers} />
      ) : (
        <Table className="w-full">
          <TableHeader className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <TableHead className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                Nome
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                Email
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                Instituição / Localização
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                Função
              </TableHead>
              <TableHead className="text-left px-6 py-4 text-sm font-medium text-gray-500">
                Ações
              </TableHead>
            </tr>
          </TableHeader>
          <TableBody className="bg-white">
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <TableCell className="px-6 py-4">
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {user.institution && (
                        <p className="font-medium text-gray-800">
                          {user.institution}
                        </p>
                      )}
                      {(user.city || user.state) && (
                        <p className="text-xs text-gray-500">
                          {[user.city, user.state].filter(Boolean).join(" - ")}
                        </p>
                      )}
                      {!user.institution && !user.city && !user.state && (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={getRoleColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEdit(user)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => onDelete(user._id)}
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default TableView;
