import { api } from "./api";
import type { Categoria, ConteudoAdmin, DesafioAdmin, Sessao } from "../types";

// Chamadas do painel admin. O token vai sozinho no header (interceptor do api.ts).

export async function entrar(email: string, senha: string): Promise<Sessao> {
    const { data } = await api.post<Sessao>("/session", { email, senha });
    return data;
}

export async function listarCategorias(): Promise<Categoria[]> {
    const { data } = await api.get<Categoria[]>("/categorias");
    return data;
}

// ---------- conteúdos ----------

export async function listarConteudosAdmin(): Promise<ConteudoAdmin[]> {
    const { data } = await api.get<ConteudoAdmin[]>("/admin/conteudos");
    return data;
}

// Multipart: o arquivo vai no campo "file". Sem id cria (POST), com id edita (PUT).
export async function salvarConteudo(id: string | null, dados: FormData): Promise<ConteudoAdmin> {
    const { data } = id
        ? await api.put<ConteudoAdmin>(`/admin/conteudos/${id}`, dados)
        : await api.post<ConteudoAdmin>("/admin/conteudos", dados);
    return data;
}

export async function alterarPublicado(id: string, publicado: boolean): Promise<void> {
    await api.patch(`/admin/conteudos/${id}/publicado`, { publicado });
}

export async function excluirConteudo(id: string): Promise<void> {
    await api.delete(`/admin/conteudos/${id}`);
}

// ---------- desafios ----------

export interface DadosDesafio {
    titulo: string;
    descricao: string;
    ordem: number;
    ativo: boolean;
}

export async function listarDesafiosAdmin(): Promise<DesafioAdmin[]> {
    const { data } = await api.get<DesafioAdmin[]>("/admin/desafios");
    return data;
}

export async function salvarDesafio(id: string | null, dados: DadosDesafio): Promise<DesafioAdmin> {
    const { data } = id
        ? await api.put<DesafioAdmin>(`/admin/desafios/${id}`, dados)
        : await api.post<DesafioAdmin>("/admin/desafios", dados);
    return data;
}

export async function alterarAtivo(id: string, ativo: boolean): Promise<void> {
    await api.put(`/admin/desafios/${id}`, { ativo });
}

export async function excluirDesafio(id: string): Promise<void> {
    await api.delete(`/admin/desafios/${id}`);
}
