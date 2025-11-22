import React, { useState } from "react";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { UserPlus, UserMinus } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allUsers: any[];
  assignedUserIds: string[];
  onAddUsers: (userIds: string[]) => Promise<void>;
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export default function AddUsersModal({
  open,
  onOpenChange,
  allUsers,
  assignedUserIds,
  onAddUsers,
  searchTerm,
  onSearchChange,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const handleConfirm = async () => {
    if (selected.size === 0) return;
    await onAddUsers(Array.from(selected));
    setSelected(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => onOpenChange(v)}>
      <DialogContent className="max-w-3xl">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Adicionar Usuários</h3>
          <div className="mb-3">
            <Input
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar usuário..."
            />
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allUsers.map((u: any) => (
              <div
                key={u._id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
                <div>
                  {assignedUserIds.includes(u._id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled
                    >
                      <UserMinus className="w-4 h-4" />
                      Atribuído
                    </Button>
                  ) : (
                    <Button
                      variant={selected.has(u._id) ? undefined : "outline"}
                      size="sm"
                      className="gap-2"
                      onClick={() => toggle(u._id)}
                    >
                      {selected.has(u._id) ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Remover
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Adicionar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={selected.size === 0}>
              Adicionar ({selected.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
