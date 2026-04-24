import { ZodError } from 'zod';
import i18next from 'i18next';

/**
 * Convierte un ZodError en un objeto plano Record<string, string>
 * compatible con el sistema de errores de los mantenimientos,
 * traduciendo las claves de mensaje automáticamente.
 */
export const formatZodErrors = (error: ZodError): Record<string, string> => {
    const errors: Record<string, string> = {};
    error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
            // Traducimos el mensaje (que es una clave i18n) usando la instancia global de i18next
            errors[path] = i18next.t(issue.message);
        }
    });
    return errors;
};
