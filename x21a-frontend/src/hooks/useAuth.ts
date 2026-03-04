import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { locale } from 'primereact/api';
import { AuthService } from '../services/auth.service';

export const useAuth = () => {
  const { i18n } = useTranslation();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['session'],
    queryFn: AuthService.getSessionInfo,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Sincronizar idioma al cargar los datos de sesión
  useEffect(() => {
    if (data?.locale && i18n.language !== data.locale) {
      i18n.changeLanguage(data.locale);
      locale(data.locale);
    }
  }, [data?.locale, i18n]);

  const isAuthenticated = !!data?.authenticated;
  

  return {
    user: data,
    isLoading,
    error,
    isAuthenticated,
    refetch
  };
};
