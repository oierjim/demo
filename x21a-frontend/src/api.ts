import axios from 'axios';
import i18n from './i18n/i18n';

const api = axios.create({
  baseURL: '/x21a-api',
  withCredentials: true, // Importante para enviar cookies de sesión
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor para añadir el idioma en cada petición
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language || 'es';
  return config;
});

// Interceptor para manejar errores de sesión de forma global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // 401: No autorizado (sesión expirada o no existente)
      // 403: Acceso denegado (el usuario está autenticado pero no tiene permisos)
      if (error.response.status === 401) {
        console.warn("Sesión no válida o expirada. Redirigiendo a login...");
        window.location.href = '/x21a-api/sessionInfo/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
