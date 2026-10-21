import { Button } from "@/components/ui/button";
import { Selo } from "./Selo";
import type { Desafio } from "@/types";

interface ItemDesafioProps {
    desafio: Desafio;
    numero: number;
    concluido: boolean;
    animar: boolean;
    onAlternar: () => void;
}

export function ItemDesafio({ desafio, numero, concluido, animar, onAlternar }: ItemDesafioProps) {
    return (
        <li className="flex gap-4 rounded-folha border border-border bg-papel p-4">
            <Selo numero={numero} concluido={concluido} animar={animar} />

            <div className="min-w-0 flex-1">
                <h2 className="text-lg">{desafio.titulo}</h2>
                <p className="mt-1 text-grafite">{desafio.descricao}</p>

                {concluido ? (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3">
                        <p className="font-semibold">Desafio concluído</p>
                        <Button variant="ghost" size="lg" onClick={onAlternar} className="underline underline-offset-4">
                            Desfazer
                        </Button>
                    </div>
                ) : (
                    <Button size="lg" onClick={onAlternar} className="mt-3">
                        Concluir desafio
                    </Button>
                )}
            </div>
        </li>
    );
}
