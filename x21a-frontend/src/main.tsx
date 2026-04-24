import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressBar } from 'primereact/progressbar';

// Layouts and Base Components
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleProtectedRoute from './components/RoleProtectedRoute'

// Lazy Loading for Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ExpedientePage = lazy(() => import('./pages/ExpedientePage'));
const PersonaPage = lazy(() => import('./pages/PersonaPage'));
const AnimalPage = lazy(() => import('./pages/AnimalPage'));
const LibroPage = lazy(() => import('./pages/LibroPage'));
const SeriesPage = lazy(() => import('./pages/SeriesPage'));
const PeliculaPage = lazy(() => import('./pages/PeliculaPage'));

// PrimeReact Styles
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import './index.css'
import './i18n/i18n'; // Inicializar i18n

import { addLocale, locale } from 'primereact/api';

// Configuración de internacionalización en Castellano
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});

locale('es');

// Configuración de internacionalización para Euskera
addLocale('eu', {
    firstDayOfWeek: 1,
    dayNames: ['Igandea', 'Astelehena', 'Asteartea', 'Asteazkena', 'Osteguna', 'Ostirala', 'Larunbata'],
    dayNamesShort: ['Iga', 'Al.', 'As.', 'Az.', 'Og.', 'Or.', 'Lr.'],
    dayNamesMin: ['Ig', 'Al', 'As', 'Az', 'Og', 'Or', 'Lr'],
    monthNames: ['Urtarrila', 'Otsaila', 'Martxoa', 'Apirila', 'Maiatza', 'Ekaina', 'Uztaila', 'Abuztua', 'Iraila', 'Urria', 'Azaroa', 'Abendua'],
    monthNamesShort: ['Urt', 'Ots', 'Mar', 'Api', 'Mai', 'Eka', 'Uzt', 'Abu', 'Ira', 'Urr', 'Aza', 'Abe'],
    today: 'Gaur',
    clear: 'Garbitu'
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const LoadingFallback = () => (
  <div className="w-full h-screen flex flex-column justify-content-center align-items-center p-8">
    <ProgressBar mode="indeterminate" style={{ height: '6px', width: '300px' }} />
    <span className="mt-4 text-slate-500 font-medium">Cargando aplicación...</span>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="expedientes" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <ExpedientePage /> 
                </RoleProtectedRoute>
              } />
              <Route path="personas" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <PersonaPage /> 
                </RoleProtectedRoute>
              } />
              <Route path="animales" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <AnimalPage /> 
                </RoleProtectedRoute>
              } />
              <Route path="libros" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <LibroPage /> 
                </RoleProtectedRoute>
              } />
              <Route path="series" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <SeriesPage /> 
                </RoleProtectedRoute>
              } />
              <Route path="peliculas" element={
                <RoleProtectedRoute allowedRoles={["AB10B-IN-0001"]}>
                  <PeliculaPage /> 
                </RoleProtectedRoute>
              } />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
