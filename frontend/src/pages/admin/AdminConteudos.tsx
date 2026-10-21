import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ui/confirm-delete";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConteudoForm } from "@/components/admin/ConteudoForm";
import { EstadoErro } from "@/components/app/EstadoErro";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { showApiError } from "@/lib/utils-api";
import { alterarPublicado, excluirConteudo, listarCategorias, listarConteudosAdmin } from "@/services/admin";
import type { ConteudoAdmin, TipoConteudo } from "@/types";

type Filtro = "TODOS" | TipoConteudo;

const ABAS: { valor: Filtro; rotulo: string }[] = [
    { valor: "TODOS", rotulo: "Todos" },
    { valor: "PANFLETO", rotulo: "Panfletos" },
    { valor: "VIDEO", rotulo: "Vídeos" },
    { valor: "MATERIAL", rotulo: "Materiais" },
];

const ROTULO_DO_TIPO: Record<TipoConteudo, string> = {
    PANFLETO: "Panfleto",
    VIDEO: "Vídeo",
    MATERIAL: "Material",
};

export function AdminConteudos() {
    const { carga, recarregar, atualizar } = useCarregar(listarConteudosAdmin);
    const { carga: cargaCategorias } = useCarregar(listarCategorias);

    const [filtro, setFiltro] = useState<Filtro>("TODOS");
    // null = diálogo fechado; { conteudo: null } = criando; { conteudo } = editando
    const [dialogo, setDialogo] = useState<{ conteudo: ConteudoAdmin | null } | null>(null);
    // Valor de "publicado" mostrado na hora, antes de a API confirmar (e enquanto ela responde)
    const [publicadoLocal, setPublicadoLocal] = useState<Record<string, boolean>>({});

    usePageMeta({ title: "Conteúdos — Painel Perto de Você" });

    const categorias = cargaCategorias.status === "ok" ? cargaCategorias.dados : [];
    const nomeDaCategoria = (id: string | null) => categorias.find((c) => c.id === id)?.nome ?? "—";

    async function aoMudarPublicado(conteudo: ConteudoAdmin, publicado: boolean) {
        setPublicadoLocal((atual) => ({ ...atual, [conteudo.id]: publicado }));
        try {
            await alterarPublicado(conteudo.id, publicado);
            toast.success(publicado ? "Publicado no app" : "Tirado do app");
        } catch (error) {
            // A API não aceitou: volta o switch ao valor real
            setPublicadoLocal((atual) => ({ ...atual, [conteudo.id]: !publicado }));
            showApiError(error, "Não foi possível mudar a publicação. Tente de novo.");
        }
    }

    async function excluir(conteudo: ConteudoAdmin) {
        try {
            await excluirConteudo(conteudo.id);
            toast.success(`"${conteudo.titulo}" foi excluído`);
            atualizar();
        } catch (error) {
            showApiError(error, "Não foi possível excluir. Tente de novo.");
        }
    }

    function aoSalvar() {
        setDialogo(null);
        setPublicadoLocal({}); // o que veio da API passa a valer
        atualizar();
    }

    function tabela(todos: ConteudoAdmin[]) {
        const itens = filtro === "TODOS" ? todos : todos.filter((c) => c.tipo === filtro);

        if (itens.length === 0) {
            return (
                <p className="rounded-folha border border-dashed border-input bg-papel p-6 text-grafite">
                    {todos.length === 0
                        ? "Ainda não há conteúdos. Crie o primeiro em “Novo conteúdo”."
                        : "Nenhum conteúdo desse tipo."}
                </p>
            );
        }

        return (
            <div className="rounded-folha border border-border bg-papel">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="hidden lg:table-cell">Categoria</TableHead>
                            <TableHead>Publicado</TableHead>
                            {/* A ordem some no celular: sem espaço, ela empurrava os botões de ação para fora da tela */}
                            <TableHead className="hidden text-right sm:table-cell">Ordem</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itens.map((conteudo) => {
                            const publicado = publicadoLocal[conteudo.id] ?? conteudo.publicado;
                            return (
                                <TableRow key={conteudo.id}>
                                    <TableCell className="max-w-[16rem] whitespace-normal font-semibold">
                                        {conteudo.titulo}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{ROTULO_DO_TIPO[conteudo.tipo]}</Badge>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        {nomeDaCategoria(conteudo.categoriaId)}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={publicado}
                                            onCheckedChange={(valor) => aoMudarPublicado(conteudo, valor)}
                                            aria-label={`Publicado: ${conteudo.titulo}`}
                                        />
                                    </TableCell>
                                    <TableCell className="hidden text-right sm:table-cell">{conteudo.ordem}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                className="size-11"
                                                onClick={() => setDialogo({ conteudo })}
                                                aria-label={`Editar ${conteudo.titulo}`}
                                            >
                                                <Pencil aria-hidden="true" />
                                            </Button>
                                            <ConfirmDelete
                                                trigger={
                                                    <Button
                                                        variant="ghost"
                                                        className="size-11 text-brasa"
                                                        aria-label={`Excluir ${conteudo.titulo}`}
                                                    >
                                                        <Trash2 aria-hidden="true" />
                                                    </Button>
                                                }
                                                title={`Excluir "${conteudo.titulo}"?`}
                                                description={
                                                    conteudo.arquivoUrl
                                                        ? "O conteúdo e o arquivo PDF serão apagados. Isso não pode ser desfeito."
                                                        : "O conteúdo será apagado. Isso não pode ser desfeito."
                                                }
                                                onConfirm={() => excluir(conteudo)}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-3xl">Conteúdos</h1>
                <Button size="lg" onClick={() => setDialogo({ conteudo: null })}>
                    <Plus aria-hidden="true" />
                    Novo conteúdo
                </Button>
            </div>

            <Tabs value={filtro} onValueChange={(valor) => setFiltro(valor as Filtro)}>
                {/* A classe de grupo repetida é necessária: o shadcn fixa h-8 por ela e um h-auto simples perderia */}
                <TabsList variant="line" className="h-auto flex-wrap group-data-horizontal/tabs:h-auto">
                    {ABAS.map((aba) => (
                        <TabsTrigger
                            key={aba.valor}
                            value={aba.valor}
                            className="min-h-11 px-2 text-grafite hover:text-noite data-active:text-noite sm:px-4"
                        >
                            {aba.rotulo}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Cada aba aponta (aria-controls) para o painel do seu valor: a tabela filtrada é esse painel */}
                <TabsContent value={filtro} className="mt-4 text-base">
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
                </TabsContent>
            </Tabs>

            <Dialog open={dialogo !== null} onOpenChange={(aberto) => !aberto && setDialogo(null)}>
                <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>{dialogo?.conteudo ? "Editar conteúdo" : "Novo conteúdo"}</DialogTitle>
                        <DialogDescription>
                            Os campos mudam conforme o tipo: panfleto pede PDF, vídeo pede link e material pede PDF ou texto.
                        </DialogDescription>
                    </DialogHeader>
                    {/* O formulário só existe com o diálogo aberto: cada abertura começa com os campos do conteúdo certo */}
                    {dialogo && (
                        <ConteudoForm
                            conteudo={dialogo.conteudo}
                            categorias={categorias}
                            onSalvo={aoSalvar}
                            onCancelar={() => setDialogo(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
