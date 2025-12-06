import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../ui/dialog";
import { EmailField } from "./EmailField";
import { Footer } from "./Footer";

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
          <EmailField email={email} onEmailChange={onEmailChange} />

          {status && (
            <div className="text-xs p-2 rounded bg-gray-50 border border-gray-200 text-gray-600">
              {status}
            </div>
          )}
        </div>

        <DialogFooter>
          <Footer
            loading={loading}
            email={email}
            onClose={onClose}
            onSend={onSend}
          />
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

export default ForgotPasswordModal;
