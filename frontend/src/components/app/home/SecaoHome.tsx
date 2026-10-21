import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface SecaoHomeProps {
    id: string;
    titulo: string;
    verTodosPara?: string;
    // Substitui o "Ver todos" (usado no contador dos desafios)
    lateral?: ReactNode;
    children: ReactNode;
}

export function SecaoHome({ id, titulo, verTodosPara, lateral, children }: SecaoHomeProps) {
    return (
        <section aria-labelledby={id} className="px-5 pt-8">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 id={id} className="text-xl">
                    {titulo}
                </h2>
                {lateral ??
                    (verTodosPara && (
                        <Link
                            to={verTodosPara}
                            className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                        >
                            Ver todos
                        </Link>
                    ))}
            </div>
            {children}
        </section>
    );
}
