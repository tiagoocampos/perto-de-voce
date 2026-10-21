import { useState } from "react";
import { X } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { InstallButton } from "./InstallButton";

// Quem fecha o cartão só o vê de novo depois de 7 dias
const CHAVE = "pdv:instalar-dispensado";
const SETE_DIAS = 7 * 24 * 60 * 60 * 1000;

function foiDispensadoHaPouco(): boolean {
    try {
        const quando = Number(localStorage.getItem(CHAVE));
        return quando > 0 && Date.now() - quando < SETE_DIAS;
    } catch {
        return false; // sem localStorage o cartão aparece, e a tela funciona igual
    }
}

export function InstallCard() {
    const { isInstalled } = useInstallPrompt();
    const [dispensado, setDispensado] = useState(foiDispensadoHaPouco);

    if (isInstalled || dispensado) return null;

    function dispensar() {
        setDispensado(true);
        try {
            localStorage.setItem(CHAVE, String(Date.now()));
        } catch {
            // sem localStorage o cartão some só nesta visita
        }
    }

    return (
        <section aria-labelledby="home-instalar" className="px-5 pt-6">
            <div className="relative rounded-folha border border-border bg-papel p-5 pr-14">
                <h2 id="home-instalar" className="text-xl">
                    Tenha o Perto de Você na tela do celular
                </h2>
                <p className="mt-2 text-grafite">Abre rápido, em tela cheia, sem precisar procurar o link.</p>
                <InstallButton variante="card" className="mt-4" />

                <button
                    type="button"
                    onClick={dispensar}
                    aria-label="Fechar aviso de instalação"
                    className="absolute right-1 top-1 grid size-11 place-items-center rounded-lg"
                >
                    <X className="size-5" aria-hidden="true" />
                </button>
            </div>
        </section>
    );
}
