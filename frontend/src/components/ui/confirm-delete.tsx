import * as React from "react";
import { TriangleAlert } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

export type ConfirmDeleteProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

// Confirmação antes de excluir: o botão que confirma é Brasa (ação destrutiva)
export function ConfirmDelete({
  trigger,
  title,
  description,
  onConfirm,
  confirmText = "Excluir",
  cancelText = "Cancelar",
}: ConfirmDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-brasa/10 text-brasa">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="h-11">{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="h-11 bg-brasa text-papel hover:bg-brasa/90">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
