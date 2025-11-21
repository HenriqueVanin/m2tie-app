import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";

interface ForgotPasswordModalProps {
  open: boolean;
  email: string;
  status: string | null;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSend: () => void;
  onClose: () => void;
}

export function ForgotPasswordModal({
  open,
  email,
  status,
  loading,
  onEmailChange,
  onSend,
  onClose,
}: ForgotPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val: boolean) => !val && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar senha</DialogTitle>
          <DialogDescription>
            Informe seu email para receber instruções de redefinição.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="forgot-email" className="text-sm text-gray-700">
              Email
            </Label>
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-12 border-gray-200 rounded-xl"
              placeholder="seu.email@exemplo.com"
            />
          </div>

          {status && (
            <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200 text-gray-600">
              {status}
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex w-full gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={onSend}
              disabled={
                loading || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)
              }
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl"
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </DialogFooter>

        <DialogClose asChild>
          <button aria-label="Fechar" className="sr-only">
            Fechar
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
