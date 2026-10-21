import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { cn } from "@/lib/utils";
import { InstallInstructionsDialog } from "./InstallInstructionsDialog";

interface InstallButtonProps {
    // compact: no cabeçalho (Luz sobre Noite). card: botão largo, para a Home e a página /instalar.
    variante: "compact" | "card";
    className?: string;
}

// O botão nunca fica "morto": instala direto quando o navegador permite; nos outros casos abre as instruções
export function InstallButton({ variante, className }: InstallButtonProps) {
    const { canInstall, isInstalled, install } = useInstallPrompt();
    const [instrucoes, setInstrucoes] = useState(false);

    // Depois de instalado, o botão some
    if (isInstalled) return null;

    async function aoClicar() {
        if (canInstall) {
            // Android e desktop: abre o aviso do navegador. Se ele não deixar, mostra as instruções.
            const resultado = await install();
            if (resultado === "erro") setInstrucoes(true);
            return;
        }
        // iPhone, navegador sem suporte, ou o evento ainda não chegou
        setInstrucoes(true);
    }

    return (
        <>
            <Button
                type="button"
                size="lg"
                onClick={aoClicar}
                className={cn(variante === "compact" ? "bg-luz px-3 text-sm text-noite hover:bg-luz/90" : "w-full", className)}
            >
                <Download aria-hidden="true" />
                Instalar app
            </Button>
            <InstallInstructionsDialog aberto={instrucoes} onFechar={() => setInstrucoes(false)} />
        </>
    );
}
