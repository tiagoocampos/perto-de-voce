import { useSyncExternalStore } from "react";

// O Chrome/Edge/Samsung Internet (Android e desktop) avisam que o app é instalável com este evento.
// Ele não está nos tipos do TypeScript, então descrevemos só o que usamos.
interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

// ---------- que navegador é este? (não muda durante a visita, então se calcula uma vez) ----------

const ua = navigator.userAgent;

// iPhone, iPad e iPod. O iPad mais novo se apresenta como Mac, mas é o único "Mac" com tela de toque.
const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

// Navegador de dentro de outro app (Facebook, Instagram, Line, WeChat, WebView do Android): não instala PWA
const isEmbedded = /FBAN|FBAV|Instagram|\bLine\/|MicroMessenger|; wv\)/i.test(ua);

// O Firefox no computador não instala PWA (no celular ele oferece "Adicionar à tela inicial")
const isFirefoxDesktop = /Firefox\//.test(ua) && !/Android|Mobile|Tablet/.test(ua);

// "Sem suporte": quem precisa abrir o endereço em outro navegador. O iPhone no Safari/Chrome/Edge NÃO entra aqui:
// lá se instala pelo menu Compartilhar (isIOS).
const isUnsupported = isEmbedded || isFirefoxDesktop;

// ---------- estado compartilhado, vivo desde o carregamento da página ----------
//
// O `beforeinstallprompt` pode disparar ANTES de o React montar e dispara uma vez só por carregamento.
// Por isso o ouvinte é registrado aqui, no nível do módulo, e o evento fica guardado numa variável.

let eventoGuardado: BeforeInstallPromptEvent | null = null;
let instaladoPeloEvento = false;
const consultaStandalone = window.matchMedia("(display-mode: standalone)");

// Instalado = aberto como app (tela cheia) no Android/desktop, ou `navigator.standalone` no iOS
function lerInstalado(): boolean {
    return (
        consultaStandalone.matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true ||
        instaladoPeloEvento
    );
}

let estado = { canInstall: false, isInstalled: lerInstalado() };
const ouvintes = new Set<() => void>();

function atualizar() {
    // Objeto novo a cada mudança: é assim que o useSyncExternalStore percebe que algo mudou
    estado = { canInstall: eventoGuardado !== null, isInstalled: lerInstalado() };
    ouvintes.forEach((ouvinte) => ouvinte());
}

window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault(); // nós decidimos a hora de mostrar (no clique do botão), não o navegador
    eventoGuardado = evento as BeforeInstallPromptEvent;
    atualizar();
});

window.addEventListener("appinstalled", () => {
    instaladoPeloEvento = true;
    eventoGuardado = null;
    atualizar();
});

consultaStandalone.addEventListener("change", atualizar);

function assinar(ouvinte: () => void) {
    ouvintes.add(ouvinte);
    return () => {
        ouvintes.delete(ouvinte);
    };
}

// "aceito" e "recusado" são escolhas da pessoa; "erro" é quando o navegador não deixou abrir o aviso
export type ResultadoDaInstalacao = "aceito" | "recusado" | "erro";

async function install(): Promise<ResultadoDaInstalacao> {
    const evento = eventoGuardado;
    if (!evento) return "erro";

    let resultado: ResultadoDaInstalacao;
    try {
        await evento.prompt(); // só funciona dentro de um clique da pessoa
        const { outcome } = await evento.userChoice;
        resultado = outcome === "accepted" ? "aceito" : "recusado";
    } catch {
        resultado = "erro";
    }

    // O evento só pode ser usado uma vez. Se a pessoa recusou, o navegador pode mandar outro mais tarde;
    // até lá o botão abre as instruções em vez de ficar parado.
    eventoGuardado = null;
    atualizar();
    return resultado;
}

export function useInstallPrompt() {
    const { canInstall, isInstalled } = useSyncExternalStore(assinar, () => estado);

    return { canInstall, isInstalled, isIOS, isEmbedded, isUnsupported, install };
}
