import { RotateCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EstadoErroProps {
    mensagem?: string;
    onTentarDeNovo: () => void;
}

// Diz o que houve e o que fazer, sem pedir desculpa
export function EstadoErro({
    mensagem = "Não foi possível carregar. Confira sua conexão com a internet e tente de novo.",
    onTentarDeNovo,
}: EstadoErroProps) {
    return (
        <div role="alert" className="rounded-folha border border-input bg-papel p-5">
            <div className="flex items-start gap-3">
                <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <p>{mensagem}</p>
            </div>
            <Button size="lg" className="mt-4" onClick={onTentarDeNovo}>
                <RotateCw aria-hidden="true" />
                Tentar de novo
            </Button>
        </div>
    );
}
