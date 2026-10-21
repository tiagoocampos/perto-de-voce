import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { applyFieldErrors, getApiErrorMessage } from "@/lib/utils-api";
import { salvarConteudo } from "@/services/admin";
import type { Categoria, ConteudoAdmin, TipoConteudo } from "@/types";
import { Campo } from "./Campo";

interface ConteudoFormProps {
    conteudo: ConteudoAdmin | null; // null = criando
    categorias: Categoria[];
    onSalvo: () => void;
    onCancelar: () => void;
}

const ROTULO_DO_TIPO: Record<TipoConteudo, string> = {
    PANFLETO: "Panfleto",
    VIDEO: "Vídeo",
    MATERIAL: "Material",
};

// O Select do shadcn não aceita valor vazio, então "sem categoria" tem um valor próprio
const SEM_CATEGORIA = "nenhuma";

const ERROS_VAZIOS = { tipo: "", titulo: "", descricao: "", link: "", texto: "", ordem: "", categoriaId: "", publicado: "" };

const LIMITE_DO_ARQUIVO = 10 * 1024 * 1024;

export function ConteudoForm({ conteudo, categorias, onSalvo, onCancelar }: ConteudoFormProps) {
    const editando = conteudo !== null;

    const [tipo, setTipo] = useState<TipoConteudo>(conteudo?.tipo ?? "PANFLETO");
    const [titulo, setTitulo] = useState(conteudo?.titulo ?? "");
    const [descricao, setDescricao] = useState(conteudo?.descricao ?? "");
    const [link, setLink] = useState(conteudo?.link ?? "");
    const [texto, setTexto] = useState(conteudo?.texto ?? "");
    const [ordem, setOrdem] = useState(String(conteudo?.ordem ?? 0));
    const [categoriaId, setCategoriaId] = useState(conteudo?.categoriaId ?? SEM_CATEGORIA);
    const [publicado, setPublicado] = useState(conteudo?.publicado ?? false);
    const [arquivo, setArquivo] = useState<File | null>(null);

    const [erros, setErros] = useState(ERROS_VAZIOS);
    const [erroGeral, setErroGeral] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Ao mexer num campo, some a mensagem de erro dele (senão ela continua lá mesmo com o valor já corrigido)
    function limparErro(campo: keyof typeof ERROS_VAZIOS) {
        setErros((atual) => (atual[campo] ? { ...atual, [campo]: "" } : atual));
        setErroGeral("");
    }

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setErros(ERROS_VAZIOS);
        setErroGeral("");

        // Confere o arquivo antes de enviar, para não esperar o upload só para ouvir "não"
        if (arquivo && (arquivo.type !== "application/pdf" || arquivo.size > LIMITE_DO_ARQUIVO)) {
            setErroGeral("O arquivo deve ser um PDF de até 10 MB.");
            return;
        }

        const dados = new FormData();
        if (!editando) dados.append("tipo", tipo); // o tipo não muda depois de criado
        dados.append("titulo", titulo);
        dados.append("descricao", descricao);
        dados.append("ordem", ordem);
        dados.append("publicado", String(publicado));
        dados.append("categoriaId", categoriaId === SEM_CATEGORIA ? "" : categoriaId); // vazio limpa a categoria
        // Só vai o que o tipo pede. Campo vazio na edição limpa o valor salvo.
        if (tipo === "VIDEO") dados.append("link", link);
        if (tipo === "MATERIAL") dados.append("texto", texto);
        if (tipo !== "VIDEO" && arquivo) dados.append("file", arquivo);

        setEnviando(true);
        try {
            await salvarConteudo(conteudo?.id ?? null, dados);
            toast.success(editando ? "Conteúdo atualizado" : "Conteúdo criado");
            onSalvo();
        } catch (error) {
            const outros = applyFieldErrors(error, ERROS_VAZIOS, setErros);
            if (outros === null) {
                // Regras do tipo (ex.: "O panfleto exige um arquivo PDF") vêm como { error }
                setErroGeral(getApiErrorMessage(error, "Não foi possível salvar. Confira sua conexão e tente de novo."));
            } else if (outros.length > 0) {
                setErroGeral(outros.join(" "));
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={enviar} noValidate className="space-y-5">
            <Campo
                id="tipo"
                rotulo="Tipo"
                erro={erros.tipo}
                dica={editando ? "O tipo não pode ser mudado depois de criado." : undefined}
            >
                <Select
                    value={tipo}
                    onValueChange={(v) => {
                        setTipo(v as TipoConteudo);
                        limparErro("tipo");
                    }}
                    disabled={editando}
                >
                    <SelectTrigger id="tipo" className="h-11 w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {(Object.keys(ROTULO_DO_TIPO) as TipoConteudo[]).map((t) => (
                            <SelectItem key={t} value={t}>
                                {ROTULO_DO_TIPO[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Campo>

            <Campo id="titulo" rotulo="Título" erro={erros.titulo}>
                <Input
                    id="titulo"
                    value={titulo}
                    onChange={(e) => {
                        setTitulo(e.target.value);
                        limparErro("titulo");
                    }}
                    aria-invalid={!!erros.titulo}
                    aria-describedby={erros.titulo ? "titulo-erro" : undefined}
                    className="h-11"
                />
            </Campo>

            <Campo id="descricao" rotulo="Descrição" erro={erros.descricao}>
                <Textarea
                    id="descricao"
                    rows={3}
                    value={descricao}
                    onChange={(e) => {
                        setDescricao(e.target.value);
                        limparErro("descricao");
                    }}
                    aria-invalid={!!erros.descricao}
                    aria-describedby={erros.descricao ? "descricao-erro" : undefined}
                />
            </Campo>

            <Campo id="categoriaId" rotulo="Categoria (opcional)" erro={erros.categoriaId}>
                <Select
                    value={categoriaId}
                    onValueChange={(v) => {
                        setCategoriaId(v);
                        limparErro("categoriaId");
                    }}
                >
                    <SelectTrigger id="categoriaId" className="h-11 w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={SEM_CATEGORIA}>Sem categoria</SelectItem>
                        {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id}>
                                {categoria.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Campo>

            {/* Campos que dependem do tipo */}
            {tipo === "VIDEO" && (
                <Campo
                    id="link"
                    rotulo="Link do vídeo"
                    erro={erros.link}
                    dica="Links do YouTube mostram o player dentro do app. Outros links abrem em nova aba."
                >
                    <Input
                        id="link"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={link}
                        onChange={(e) => {
                            setLink(e.target.value);
                            limparErro("link");
                        }}
                        aria-invalid={!!erros.link}
                        aria-describedby={erros.link ? "link-erro" : undefined}
                        className="h-11"
                    />
                </Campo>
            )}

            {tipo !== "VIDEO" && (
                <Campo
                    id="arquivo"
                    rotulo="Arquivo PDF"
                    dica={tipo === "PANFLETO" ? "Obrigatório. Até 10 MB." : "Obrigatório se não houver texto. Até 10 MB."}
                >
                    <Input
                        id="arquivo"
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            setArquivo(e.target.files?.[0] ?? null);
                            setErroGeral("");
                        }}
                        className="h-11 py-2"
                    />
                    {editando && conteudo.arquivoUrl && (
                        <p className="text-sm">
                            <a
                                href={conteudo.arquivoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
                            >
                                Ver arquivo atual
                                <ExternalLink className="size-3.5" aria-hidden="true" />
                                <span className="sr-only">(abre em nova aba)</span>
                            </a>
                            <span className="text-grafite"> · escolha outro arquivo só se quiser substituí-lo.</span>
                        </p>
                    )}
                </Campo>
            )}

            {tipo === "MATERIAL" && (
                <Campo
                    id="texto"
                    rotulo="Texto do material"
                    erro={erros.texto}
                    dica="Separe os parágrafos com uma linha em branco."
                >
                    <Textarea
                        id="texto"
                        rows={8}
                        value={texto}
                        onChange={(e) => {
                            setTexto(e.target.value);
                            limparErro("texto");
                        }}
                        aria-invalid={!!erros.texto}
                        aria-describedby={erros.texto ? "texto-erro" : undefined}
                    />
                </Campo>
            )}

            <Campo id="ordem" rotulo="Ordem" erro={erros.ordem} dica="O menor número aparece primeiro.">
                <Input
                    id="ordem"
                    type="number"
                    min={0}
                    step={1}
                    value={ordem}
                    onChange={(e) => {
                        setOrdem(e.target.value);
                        limparErro("ordem");
                    }}
                    aria-invalid={!!erros.ordem}
                    aria-describedby={erros.ordem ? "ordem-erro" : undefined}
                    className="h-11 w-32"
                />
            </Campo>

            <div className="flex items-center gap-3">
                <Switch id="publicado" checked={publicado} onCheckedChange={setPublicado} />
                <Label htmlFor="publicado">Publicado (aparece no app)</Label>
            </div>

            {erroGeral && (
                <p role="alert" className="text-sm font-semibold text-brasa">
                    {erroGeral}
                </p>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" size="lg" onClick={onCancelar} disabled={enviando}>
                    Cancelar
                </Button>
                <Button type="submit" size="lg" disabled={enviando}>
                    {enviando ? "Salvando…" : editando ? "Salvar alterações" : "Criar conteúdo"}
                </Button>
            </div>
        </form>
    );
}
