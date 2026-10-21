import { Link } from "react-router-dom";
import { ChevronRight, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { extrairIdYoutube, miniaturaYoutube } from "@/lib/youtube";
import type { Conteudo } from "@/types";

interface CartaoVideoProps {
    conteudo: Conteudo;
    // Nível do título: h3 dentro de uma seção da home (que tem h2); h2 na página de vídeos (que só tem o h1)
    nivelDoTitulo?: "h2" | "h3";
}

function BotaoPlay() {
    return (
        <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-full bg-noite/85 text-papel">
                <Play className="size-6 fill-current" aria-hidden="true" />
            </span>
        </span>
    );
}

export function CartaoVideo({ conteudo, nivelDoTitulo = "h3" }: CartaoVideoProps) {
    const Titulo = nivelDoTitulo;
    const idYoutube = conteudo.link ? extrairIdYoutube(conteudo.link) : null;

    // Link que não é do YouTube: sem miniatura nem player, só o botão para abrir
    if (!idYoutube) {
        return (
            <article>
                <div className="relative aspect-video rounded-folha bg-noite">
                    <BotaoPlay />
                </div>
                <Titulo className="mt-2 text-lg">{conteudo.titulo}</Titulo>
                <p className="text-grafite">{conteudo.descricao}</p>
                {conteudo.link && (
                    <Button asChild size="lg" className="mt-3">
                        <a href={conteudo.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink aria-hidden="true" />
                            Abrir vídeo
                            <span className="sr-only">(abre em nova aba)</span>
                        </a>
                    </Button>
                )}
            </article>
        );
    }

    return (
        <article>
            <Link to={`/videos/${conteudo.id}`} className="block">
                <div className="relative aspect-video overflow-hidden rounded-folha bg-noite">
                    {/* alt vazio: a miniatura é decorativa, o título logo abaixo já diz o que é o vídeo */}
                    <img
                        src={miniaturaYoutube(idYoutube)}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                    />
                    <BotaoPlay />
                </div>
                <Titulo className="mt-2 text-lg">{conteudo.titulo}</Titulo>
                <p className="text-grafite">{conteudo.descricao}</p>
                <span className="mt-1 inline-flex min-h-11 items-center gap-0.5 font-semibold underline underline-offset-4">
                    Assistir
                    <ChevronRight className="size-4" aria-hidden="true" />
                </span>
            </Link>
        </article>
    );
}
