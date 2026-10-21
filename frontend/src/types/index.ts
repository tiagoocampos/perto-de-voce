// Tipos conforme as respostas reais do backend (nomes dos campos iguais aos da API)

export type TipoConteudo = "PANFLETO" | "VIDEO" | "MATERIAL";

export interface Categoria {
    id: string;
    nome: string;
    slug: string;
}

// GET /conteudos e GET /conteudos/:id.
// A lista traz `temTexto` (sem o texto); só o detalhe traz o `texto`.
export interface Conteudo {
    id: string;
    tipo: TipoConteudo;
    titulo: string;
    descricao: string;
    arquivoUrl: string | null;
    link: string | null;
    temTexto?: boolean;
    texto?: string | null;
    ordem: number;
    criadoEm: string;
    categoria: Categoria | null;
}

// GET /admin/conteudos: linha completa do banco. Traz `categoriaId`, não o objeto `categoria`
export interface ConteudoAdmin {
    id: string;
    tipo: TipoConteudo;
    titulo: string;
    descricao: string;
    arquivoUrl: string | null;
    arquivoPublicId: string | null;
    link: string | null;
    texto: string | null;
    publicado: boolean;
    ordem: number;
    categoriaId: string | null;
    criadoEm: string;
    atualizadoEm: string;
}

// GET /desafios
export interface Desafio {
    id: string;
    titulo: string;
    descricao: string;
    ordem: number;
}

// GET /admin/desafios
export interface DesafioAdmin extends Desafio {
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
}

export interface Admin {
    id: string;
    nome: string;
    email: string;
}

// POST /session
export interface Sessao extends Admin {
    token: string;
}
