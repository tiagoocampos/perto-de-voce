import { Skeleton } from "@/components/ui/skeleton";

interface EstadoCarregandoProps {
    // Cada seção tem uma forma: fileira de folhas, vídeos em coluna, linhas de lista ou uma página de detalhe
    forma: "folha" | "video" | "linha" | "detalhe";
}

export function EstadoCarregando({ forma }: EstadoCarregandoProps) {
    return (
        <div role="status" aria-live="polite">
            <span className="sr-only">Carregando…</span>

            <div aria-hidden="true">
                {forma === "folha" && (
                    <div className="flex gap-3 overflow-hidden">
                        {[0, 1, 2].map((i) => (
                            <Skeleton key={i} className="aspect-[210/297] w-36 shrink-0 rounded-folha" />
                        ))}
                    </div>
                )}

                {forma === "video" && (
                    <div className="space-y-6">
                        {[0, 1].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="aspect-video w-full rounded-folha" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                )}

                {forma === "detalhe" && (
                    <div className="space-y-3">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="aspect-video w-full rounded-folha" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                )}

                {forma === "linha" && (
                    <div className="space-y-3">
                        {[0, 1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-folha" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
