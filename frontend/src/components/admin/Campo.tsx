import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface CampoProps {
    id: string;
    rotulo: string;
    erro?: string;
    dica?: string;
    children: ReactNode;
}

// Rótulo + campo + dica + mensagem de erro do campo (vinda do `path` do erro de validação da API)
export function Campo({ id, rotulo, erro, dica, children }: CampoProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id}>{rotulo}</Label>
            {children}
            {dica && !erro && <p className="text-sm text-grafite">{dica}</p>}
            {erro && (
                <p id={`${id}-erro`} role="alert" className="text-sm font-semibold text-brasa">
                    {erro}
                </p>
            )}
        </div>
    );
}
