import { Link, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InstallSteps } from "./InstallSteps";

interface InstallInstructionsDialogProps {
    aberto: boolean;
    onFechar: () => void;
}

export function InstallInstructionsDialog({ aberto, onFechar }: InstallInstructionsDialogProps) {
    const { pathname } = useLocation();

    return (
        <Dialog open={aberto} onOpenChange={(abrir) => !abrir && onFechar()}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Instalar o app</DialogTitle>
                    <DialogDescription>Coloque o Perto de Você na tela do seu celular.</DialogDescription>
                </DialogHeader>

                <InstallSteps />

                {/* Já estando na página de instalação, o link seria inútil */}
                {pathname !== "/instalar" && (
                    <Link
                        to="/instalar"
                        onClick={onFechar}
                        className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                    >
                        Ver instruções na página de instalação
                    </Link>
                )}
            </DialogContent>
        </Dialog>
    );
}
