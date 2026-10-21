// Cruz minimalista em SVG (mesma forma do favicon). Herda a cor do texto: use text-luz, text-noite...
export function Cruz({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
            <rect x="10" y="2" width="4" height="20" />
            <rect x="5" y="7" width="14" height="4" />
        </svg>
    );
}
