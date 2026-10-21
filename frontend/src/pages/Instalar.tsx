import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TituloDePagina } from "@/components/app/TituloDePagina";
import { InstallButton } from "@/components/pwa/InstallButton";
import { InstallSteps } from "@/components/pwa/InstallSteps";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { usePageMeta } from "@/hooks/usePageMeta";

// Página para compartilhar (WhatsApp, Instagram, QR code): funciona sozinha, para quem chega direto nela
export function Instalar() {
    const { isInstalled } = useInstallPrompt();

    usePageMeta({
        title: "Instalar o app | Perto de Você",
        description: "Instale o Perto de Você e tenha panfletos, vídeos e desafios na tela do seu celular.",
    });

    // Aberta de dentro do app já instalado
    if (isInstalled) {
        return (
            <div className="px-5 py-6">
                <TituloDePagina titulo="App instalado" texto="O app já está instalado neste aparelho." />
                <Button asChild size="lg">
                    <Link to="/">Ir para o início</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="px-5 py-6">
            <TituloDePagina
                titulo="Instale o Perto de Você"
                texto="Tenha os panfletos, vídeos e desafios na tela do seu celular."
            />

            <InstallButton variante="card" />

            <section aria-labelledby="como-instalar" className="mt-6 rounded-folha border border-border bg-papel p-5">
                <h2 id="como-instalar" className="mb-3 text-lg">
                    Como instalar
                </h2>
                <InstallSteps naPagina />
            </section>

            <Link to="/" className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                Continuar no navegador
            </Link>
        </div>
    );
}
