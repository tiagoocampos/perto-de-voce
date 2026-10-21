import { Selo } from "./Selo";
import type { Desafio } from "@/types";

interface GradeSelosProps {
    desafios: Desafio[];
    ids: string[]; // ids dos desafios concluídos
}

// Um selo por desafio, em ordem. Resume o progresso de relance (usado na home e na tela de desafios).
export function GradeSelos({ desafios, ids }: GradeSelosProps) {
    const concluidos = desafios.filter((d) => ids.includes(d.id)).length;

    return (
        <div
            role="img"
            aria-label={`${concluidos} de ${desafios.length} desafios concluídos`}
            className="flex flex-wrap gap-3"
        >
            {desafios.map((desafio, indice) => (
                <Selo key={desafio.id} numero={indice + 1} concluido={ids.includes(desafio.id)} />
            ))}
        </div>
    );
}
