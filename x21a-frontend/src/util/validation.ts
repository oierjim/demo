import { ZodError } from 'zod';

/**
 * Convierte un ZodError en un objeto plano Record<string, string>
 * compatible con el sistema de errores de los mantenimientos.
 */
export const formatZodErrors = (error: ZodError): Record<string, string> => {
    const errors: Record<string, string> = {};
    error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (!errors[path]) {
            errors[path] = issue.message;
        }
    });
    return errors;
};
