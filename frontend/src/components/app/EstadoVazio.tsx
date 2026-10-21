interface EstadoVazioProps {
    mensagem: string;
}

export function EstadoVazio({ mensagem }: EstadoVazioProps) {
    return (
        <p className="rounded-folha border border-dashed border-input bg-papel p-5 text-grafite">
            {mensagem}
        </p>
    );
}
