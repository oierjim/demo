# gemini.md - udaDemoApp

## IMPORTANTE: Uso obligatorio de pnpm

**Se debe usar EXCLUSIVAMENTE pnpm para el frontend.** No está permitido usar npm ni yarn.

### Por qué pnpm
- Lockfile más preciso y determinista
- Mayor velocidad y eficiencia de disco
- Mejores espacios de trabajo (workspaces)

### Regla
Todo comando de gestión de dependencias del frontend debe usar `pnpm`:
- `pnpm install` — instalar dependencias
- `pnpm dev` — ejecutar servidor de desarrollo
- `pnpm build` — crear build de producción
- `pnpm lint` — ejecutar linter

**NO usar npm**: cualquier instalación con npm dará problemas de consistencia.