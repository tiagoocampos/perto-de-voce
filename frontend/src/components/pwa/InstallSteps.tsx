import type { ReactNode } from "react";
import { Share, SquarePlus, TriangleAlert, type LucideIcon } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { CopyLinkButton } from "./CopyLinkButton";

// As instruções de instalação por plataforma. O diálogo e a página /instalar usam este mesmo componente.

function Passo({ numero, Icone, children }: { numero: number; Icone?: LucideIcon; children: ReactNode }) {
    return (
        <li className="flex items-center gap-3">
            <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-noite text-sm font-extrabold text-papel"
            >
                {numero}
            </span>
            <span>{children}</span>
            {Icone && <Icone className="ml-auto size-6 shrink-0 text-grafite" aria-hidden="true" />}
        </li>
    );
}

function AbrirEmOutroNavegador({ navegadores }: { navegadores: string }) {
    return (
        <div className="space-y-3">
            <p className="flex items-start gap-2 font-semibold">
                <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                Abra este endereço no {navegadores} para instalar o app.
            </p>
            <CopyLinkButton />
        </div>
    );
}

interface InstallStepsProps {
    // Na página /instalar o botão grande está logo acima; no diálogo, a pessoa acabou de tocar nele
    naPagina?: boolean;
}

export function InstallSteps({ naPagina = false }: InstallStepsProps) {
    const { isIOS, isEmbedded, isUnsupported } = useInstallPrompt();

    if (isIOS) {
        return (
            <div className="space-y-4">
                {isEmbedded && <AbrirEmOutroNavegador navegadores="Safari" />}
                <div className="space-y-3">
                    {isEmbedded && <p className="text-grafite">No Safari, siga estes passos:</p>}
                    <ol className="space-y-3">
                        <Passo numero={1} Icone={Share}>
                            Toque em <strong>Compartilhar</strong>.
                        </Passo>
                        <Passo numero={2} Icone={SquarePlus}>
                            Escolha <strong>Adicionar à Tela de Início</strong>.
                        </Passo>
                        <Passo numero={3}>
                            Toque em <strong>Adicionar</strong>.
                        </Passo>
                    </ol>
                    {!isEmbedded && (
                        <p className="text-sm text-grafite">
                            No Chrome e no Edge do iPhone é igual (iOS 16.4 ou mais novo).
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (isUnsupported) {
        return <AbrirEmOutroNavegador navegadores="Chrome ou no Safari" />;
    }

    return (
        <p>
            {naPagina && <>Toque em <strong>Instalar app</strong>. Se nada acontecer, abra</>}
            {!naPagina && <>Abra</>} o menu do navegador e escolha <strong>Instalar app</strong> ou{" "}
            <strong>Adicionar à tela inicial</strong>.
        </p>
    );
}
