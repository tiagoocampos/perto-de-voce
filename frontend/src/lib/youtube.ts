// Ids do YouTube têm 11 caracteres: letras, números, "-" e "_"
const ID_VALIDO = /^[\w-]{11}$/;

// Aceita só os domínios do YouTube de verdade (evita "youtube.com.site-falso.com")
function ehHostYoutube(host: string): boolean {
    return (
        host === "youtu.be" ||
        host === "youtube.com" ||
        host.endsWith(".youtube.com") ||
        host === "youtube-nocookie.com" ||
        host.endsWith(".youtube-nocookie.com")
    );
}

// Extrai o id de youtube.com/watch?v=, youtu.be/, /shorts/, /embed/ e /live/.
// Devolve null se o link não for do YouTube (o app então mostra o botão "Abrir vídeo").
export function extrairIdYoutube(link: string): string | null {
    let url: URL;
    try {
        url = new URL(link.trim());
    } catch {
        return null;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") return null;

    const host = url.hostname.toLowerCase();
    if (!ehHostYoutube(host)) return null;

    let id: string | null = null;

    if (host === "youtu.be") {
        id = url.pathname.split("/")[1] ?? null;
    } else if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
    } else {
        const [, tipo, segundo] = url.pathname.split("/");
        if (tipo && ["shorts", "embed", "live", "v"].includes(tipo)) {
            id = segundo ?? null;
        }
    }

    return id && ID_VALIDO.test(id) ? id : null;
}

export function miniaturaYoutube(id: string): string {
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

// youtube-nocookie: não grava cookies de rastreamento até a pessoa dar play
export function embedYoutube(id: string): string {
    return `https://www.youtube-nocookie.com/embed/${id}`;
}
