import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { applyFieldErrors, getApiErrorMessage } from "@/lib/utils-api";
import { salvarDesafio } from "@/services/admin";
import type { DesafioAdmin } from "@/types";
import { Campo } from "./Campo";

interface DesafioFormProps {
    desafio: DesafioAdmin | null; // null = criando
    onSalvo: () => void;
    onCancelar: () => void;
}

const ERROS_VAZIOS = { titulo: "", descricao: "", ordem: "", ativo: "" };

export function DesafioForm({ desafio, onSalvo, onCancelar }: DesafioFormProps) {
    const editando = desafio !== null;

    const [titulo, setTitulo] = useState(desafio?.titulo ?? "");
    const [descricao, setDescricao] = useState(desafio?.descricao ?? "");
    const [ordem, setOrdem] = useState(String(desafio?.ordem ?? 0));
    const [ativo, setAtivo] = useState(desafio?.ativo ?? true);

    const [erros, setErros] = useState(ERROS_VAZIOS);
    const [erroGeral, setErroGeral] = useState("");
    const [enviando, setEnviando] = useState(false);

    // Ao mexer num campo, some a mensagem de erro dele
    function limparErro(campo: keyof typeof ERROS_VAZIOS) {
        setErros((atual) => (atual[campo] ? { ...atual, [campo]: "" } : atual));
        setErroGeral("");
    }

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setErros(ERROS_VAZIOS);
        setErroGeral("");
        setEnviando(true);

        try {
            // Desafios usam JSON (sem arquivo), então a ordem vai como número
            await salvarDesafio(desafio?.id ?? null, { titulo, descricao, ordem: Number(ordem), ativo });
            toast.success(editando ? "Desafio atualizado" : "Desafio criado");
            onSalvo();
        } catch (error) {
            const outros = applyFieldErrors(error, ERROS_VAZIOS, setErros);
            if (outros === null) {
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
                <Switch id="ativo" checked={ativo} onCheckedChange={setAtivo} />
                <Label htmlFor="ativo">Ativo (aparece no app)</Label>
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
                    {enviando ? "Salvando…" : editando ? "Salvar alterações" : "Criar desafio"}
                </Button>
            </div>
        </form>
    );
}
