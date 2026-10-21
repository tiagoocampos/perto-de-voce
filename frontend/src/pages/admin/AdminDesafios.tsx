import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ui/confirm-delete";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DesafioForm } from "@/components/admin/DesafioForm";
import { EstadoErro } from "@/components/app/EstadoErro";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { showApiError } from "@/lib/utils-api";
import { alterarAtivo, excluirDesafio, listarDesafiosAdmin } from "@/services/admin";
import type { DesafioAdmin } from "@/types";

export function AdminDesafios() {
    const { carga, recarregar, atualizar } = useCarregar(listarDesafiosAdmin);

    // null = diálogo fechado; { desafio: null } = criando; { desafio } = editando
    const [dialogo, setDialogo] = useState<{ desafio: DesafioAdmin | null } | null>(null);
    // Valor de "ativo" mostrado na hora, antes de a API confirmar
    const [ativoLocal, setAtivoLocal] = useState<Record<string, boolean>>({});

    usePageMeta({ title: "Desafios — Painel Perto de Você" });

    async function aoMudarAtivo(desafio: DesafioAdmin, ativo: boolean) {
        setAtivoLocal((atual) => ({ ...atual, [desafio.id]: ativo }));
        try {
            await alterarAtivo(desafio.id, ativo);
            toast.success(ativo ? "Desafio ativado" : "Desafio desativado");
        } catch (error) {
            setAtivoLocal((atual) => ({ ...atual, [desafio.id]: !ativo }));
            showApiError(error, "Não foi possível mudar o desafio. Tente de novo.");
        }
    }

    async function excluir(desafio: DesafioAdmin) {
        try {
            await excluirDesafio(desafio.id);
            toast.success(`"${desafio.titulo}" foi excluído`);
            atualizar();
        } catch (error) {
            showApiError(error, "Não foi possível excluir. Tente de novo.");
        }
    }

    function aoSalvar() {
        setDialogo(null);
        setAtivoLocal({});
        atualizar();
    }

    function tabela(desafios: DesafioAdmin[]) {
        if (desafios.length === 0) {
            return (
                <p className="rounded-folha border border-dashed border-input bg-papel p-6 text-grafite">
                    Ainda não há desafios. Crie o primeiro em “Novo desafio”.
                </p>
            );
        }

        return (
            <div className="rounded-folha border border-border bg-papel">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead className="text-right">Ordem</TableHead>
                            <TableHead>Ativo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {desafios.map((desafio) => (
                            <TableRow key={desafio.id}>
                                <TableCell className="max-w-[20rem] whitespace-normal font-semibold">
                                    {desafio.titulo}
                                </TableCell>
                                <TableCell className="text-right">{desafio.ordem}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={ativoLocal[desafio.id] ?? desafio.ativo}
                                        onCheckedChange={(valor) => aoMudarAtivo(desafio, valor)}
                                        aria-label={`Ativo: ${desafio.titulo}`}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            className="size-11"
                                            onClick={() => setDialogo({ desafio })}
                                            aria-label={`Editar ${desafio.titulo}`}
                                        >
                                            <Pencil aria-hidden="true" />
                                        </Button>
                                        <ConfirmDelete
                                            trigger={
                                                <Button
                                                    variant="ghost"
                                                    className="size-11 text-brasa"
                                                    aria-label={`Excluir ${desafio.titulo}`}
                                                >
                                                    <Trash2 aria-hidden="true" />
                                                </Button>
                                            }
                                            title={`Excluir "${desafio.titulo}"?`}
                                            description="O desafio será apagado. Isso não pode ser desfeito."
                                            onConfirm={() => excluir(desafio)}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl">Desafios</h1>
                <Button size="lg" onClick={() => setDialogo({ desafio: null })}>
                    <Plus aria-hidden="true" />
                    Novo desafio
                </Button>
            </div>

            {carga.status === "carregando" && (
                <div className="space-y-2" role="status">
                    <span className="sr-only">Carregando…</span>
                    {[0, 1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-folha" />
                    ))}
                </div>
            )}
            {carga.status === "erro" && <EstadoErro onTentarDeNovo={recarregar} />}
            {carga.status === "ok" && tabela(carga.dados)}

            <Dialog open={dialogo !== null} onOpenChange={(aberto) => !aberto && setDialogo(null)}>
                <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{dialogo?.desafio ? "Editar desafio" : "Novo desafio"}</DialogTitle>
                        <DialogDescription>
                            Desafios ativos aparecem no app, na ordem escolhida. Quem usa o app marca o que já concluiu.
                        </DialogDescription>
                    </DialogHeader>
                    {dialogo && (
                        <DesafioForm
                            desafio={dialogo.desafio}
                            onSalvo={aoSalvar}
                            onCancelar={() => setDialogo(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
