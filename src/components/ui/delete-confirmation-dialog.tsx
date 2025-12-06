import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description: string | React.ReactNode;
  isDeleting?: boolean;
  countdownSeconds?: number;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmar exclusão",
  description,
  isDeleting = false,
  countdownSeconds = 3,
}: DeleteConfirmationDialogProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset countdown quando o diálogo abre
      setCountdown(countdownSeconds);
      setCanConfirm(false);

      // Iniciar countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanConfirm(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, countdownSeconds]);

  const handleConfirm = async () => {
    if (!canConfirm || isDeleting) return;
    await onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <div>{description}</div>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  ⚠️ Esta ação não pode ser desfeita.
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!canConfirm || isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-400"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Excluindo...
              </>
            ) : !canConfirm ? (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir ({countdown}s)
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
