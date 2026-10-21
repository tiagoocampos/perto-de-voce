import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Continua o cabeçalho (mesmo fundo Noite). O slogan em serifa dá o tom de manchete de panfleto.
export function Hero() {
    return (
        <section className="sobre-noite bg-noite px-5 pb-10 pt-4 text-papel">
            <h1 className="font-serif text-[2rem] font-semibold leading-[1.15] tracking-normal">
                A eternidade de alguém precisa da minha disposição.
            </h1>
            <p className="mt-4 text-lg font-extrabold tracking-tight text-luz">Evangelize. Sirva. Ame.</p>
            <Button asChild size="lg" className="mt-6 bg-luz text-noite hover:bg-luz/90">
                <Link to="/panfletos">Ver panfletos</Link>
            </Button>
        </section>
    );
}
