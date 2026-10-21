interface TituloDePaginaProps {
    titulo: string;
    texto: string;
}

export function TituloDePagina({ titulo, texto }: TituloDePaginaProps) {
    return (
        <div className="mb-6">
            <h1 className="text-3xl">{titulo}</h1>
            <p className="mt-2 text-grafite">{texto}</p>
        </div>
    );
}
