import axios from "axios";
import { toast } from "sonner";

interface FieldError {
    path: string;
    message: string;
}

// Mensagem do backend ({ error }) ou o texto padrão
export function getApiErrorMessage(error: unknown, fallback = "Ocorreu um erro"): string {
    if (!axios.isAxiosError(error)) return fallback;
    return error.response?.data?.error || fallback;
}

// Erro de validação do Zod: { details: [{ message, path }] }.
// Preenche `fields` com a mensagem de cada campo e devolve as mensagens de campos que o
// formulário não conhece, para o chamador mostrar em toast.
export function applyFieldErrors<T extends Record<string, string>>(
    error: unknown,
    fields: T,
    setErrors: (errors: T) => void
): string[] | null {
    if (!axios.isAxiosError(error)) return null;

    const details = error.response?.data?.details as FieldError[] | undefined;
    if (!details) return null;

    const fieldErrors = { ...fields };
    const unknownFields: string[] = [];
    details.forEach((detail) => {
        if (detail.path in fieldErrors) {
            fieldErrors[detail.path as keyof T] = detail.message as T[keyof T];
        } else {
            unknownFields.push(detail.message);
        }
    });
    setErrors(fieldErrors);
    return unknownFields;
}

export function showApiError(error: unknown, fallback = "Ocorreu um erro"): void {
    toast.error(getApiErrorMessage(error, fallback));
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
