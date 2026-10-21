import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface NaoEncontradoProps {
    mensagem: string;
    voltarPara: string;
    rotuloVoltar: string;
}

// Conteúdo que não existe mais ou foi despublicado
export function NaoEncontrado({ mensagem, voltarPara, rotuloVoltar }: NaoEncontradoProps) {
    return (
        <div className="rounded-folha border border-dashed border-input bg-papel p-5">
            <p className="text-grafite">{mensagem}</p>
            <Link to={voltarPara} className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold underline underline-offset-4">
                <ArrowLeft className="size-4" aria-hidden="true" />
                {rotuloVoltar}
            </Link>
        </div>
    );
}
