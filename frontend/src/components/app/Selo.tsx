import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeloProps {
    numero: number;
    concluido: boolean;
    // true só no selo em que a pessoa acabou de tocar: é ele que faz o carimbo
    animar?: boolean;
    className?: string;
}

// O selo de um desafio: pontilhado e numerado enquanto pendente; carimbado em Luz, com check, ao concluir.
// É só visual (aria-hidden): quem informa o estado é o texto ao lado.
export function Selo({ numero, concluido, animar, className }: SeloProps) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "grid size-12 shrink-0 place-items-center rounded-full border-2 text-base font-extrabold",
                concluido ? "-rotate-6 border-noite bg-luz text-noite" : "border-dashed border-input text-grafite",
                concluido && animar && "animar-carimbo",
                className,
            )}
        >
            {concluido ? <Check className="size-6" strokeWidth={3} /> : numero}
        </span>
    );
}
