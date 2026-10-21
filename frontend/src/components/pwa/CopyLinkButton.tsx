import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

// Navegadores embutidos (Instagram, WhatsApp...) às vezes bloqueiam o clipboard moderno: tenta o método antigo
async function copiar(texto: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(texto);
        return true;
    } catch {
        // cai no método antigo
    }

    try {
        const campo = document.createElement("textarea");
        campo.value = texto;
        campo.setAttribute("readonly", "");
        campo.style.position = "fixed";
        campo.style.opacity = "0";
        document.body.appendChild(campo);
        campo.select();
        const copiou = document.execCommand("copy");
        campo.remove();
        return copiou;
    } catch {
        return false;
    }
}

export function CopyLinkButton() {
    async function aoClicar() {
        if (await copiar(window.location.href)) {
            toast.success("Link copiado");
        } else {
            toast.error("Não foi possível copiar. Copie o endereço na barra do navegador.");
        }
    }

    return (
        <Button type="button" variant="outline" size="lg" onClick={aoClicar}>
            <Copy aria-hidden="true" />
            Copiar link
        </Button>
    );
}
