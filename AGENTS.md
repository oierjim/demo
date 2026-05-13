# AGENTS.md - udaDemoApp

## Descripción
Aplicación full-stack de mantenimientos genéricos CRUD. Backend Spring Boot 2.7 + Java 17, Frontend React 19 + TypeScript + Vite.

## Stack
| Capa | Tecnología |
|------|-----------|
| Backend | Spring Boot 2.7.18, JPA, H2 (file), Lombok, Maven |
| Frontend | React 19, TypeScript 5.9, Vite 7, PrimeReact 10, TanStack Query 5, Axios, react-i18next, Zod 4 |
| Auth | HTTP Basic (Spring Security) |
| UI | PrimeReact + PrimeFlex + PrimeIcons |

## Comandos

### Backend (`x21a-backend/`)
- `mvn clean install -DskipTests` — compilar
- `mvn spring-boot:run` — ejecutar (puerto 8080)
- `mvn clean` — limpiar

### Frontend (`x21a-frontend/`)
- `pnpm install` — instalar dependencias
- `pnpm dev` — servidor desarrollo (puerto 5173, proxy a 8080)
- `pnpm build` — build de producción
- `pnpm lint` — ESLint

## Arquitectura

### Backend (genérico)
- `BaseController<T, ID, F>` → endpoints REST: `POST /filter`, `GET /{id}`, `POST`, `PUT`, `DELETE`, `POST /delete-multiple`
- `BaseService<T, ID, F>` → lógica CRUD genérica con `JpaRepository` + `JpaSpecificationExecutor`
- `FilterRequest<F>` → DTO de filtro: `{ filter: F, page, rows, sidx, sord }`

### Frontend (compound component pattern)
- `DataTableMaintenance` + `useMaintenanceContext` → sistema de mantenimiento declarativo
- Subcomponentes: `<DataTableMaintenance.Title>`, `<Filters>`, `<Toolbar>`, `<Table>`, `<Dialog>`
- `useMaintenance` hook → estado global del mantenimiento
- `services/base.service.ts` → clase abstracta CRUD
- Lazy loading por ruta con `React.lazy`

## Convenciones
- **pnpm obligatorio**: usar exclusivamente `pnpm` para el frontend. NO usar npm ni yarn.
- **Fechas**: usar `java.util.Date` en backend, `Calendar` de PrimeReact en frontend
- **IDs**: toda entidad debe exponer `id` via `getId()`/`setId()` (alias si PK se llama distinto)
- **Rutas**: añadir en `main.tsx` con `React.lazy`
- **Git chaining** (Win32 PowerShell): `cmd1; if ($?) { cmd2 }`
- **No comentar código fuente** a menos que se pida explícitamente
- **i18n**: español (`es`) y euskera (`eu`) en `src/i18n/locales/`

## Cómo añadir un nuevo mantenimiento
1. Backend: entidad + FilterDTO + Repository + Service + Controller
2. Frontend: `services/X.service.ts` extendiendo `BaseService` + `pages/XPage.tsx` con `DataTableMaintenance` + ruta lazy en `main.tsx`
3. Añadir datos de ejemplo en el `DataLoader` / `import.sql` del backend
