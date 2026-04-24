# GEMINI.md - udaDemoApp Persistent Context

Este archivo contiene las directrices arquitectónicas y convenciones establecidas para el proyecto `udaDemoApp`. Es de obligada lectura para mantener la coherencia del sistema.

## 🏗️ Arquitectura de Mantenimientos Genéricos

Hemos implementado un sistema altamente reutilizable tanto en Backend (Spring Boot) como en Frontend (React).

### 🔙 Backend (Java / Spring Boot)
Ubicación: `x21a-backend/src/main/java/com/ejie/x21a/`

- **`BaseController<T, ID, F>`**: Controlador abstracto que implementa los endpoints estándar:
  - `POST /filter`: Filtrado avanzado, paginación y ordenación usando `FilterRequest`.
  - `GET /{id}`, `POST`, `PUT`, `DELETE`: Operaciones CRUD básicas.
  - `POST /delete-multiple`: Borrado masivo basado en filtros o IDs seleccionados.
- **`BaseService<T, ID, F>`**: Lógica de negocio genérica que interactúa con `JpaRepository` y `JpaSpecificationExecutor`.
- **`FilterRequest<F>`**: Objeto estándar para peticiones desde el front:
  ```json
  { "filter": { ... }, "page": 0, "rows": 10, "sidx": "campo", "sord": "asc" }
  ```

### 🎨 Frontend (React / TypeScript)
Ubicación: `x21a-frontend/src/`

- **`services/base.service.ts`**: Clase abstracta para llamadas a la API genérica.
- **`components/DataTableMaintenance.tsx`**: Sistema de **Componentes Compuestos** que centraliza la lógica mediante Context API. Sub-componentes disponibles:
  - **`<DataTableMaintenance.Title title="..." />`**: Título de la sección.
  - **`<DataTableMaintenance.Filters>`**: Contenedor de filtros. Recibe una función `(filters, setFilters) => ReactNode`.
  - **`<DataTableMaintenance.Toolbar />`**: Barra de herramientas CRUD. Soporta `showNew`, `showEdit`, `showDelete`, `showExport` y `extraButtons`.
  - **`<DataTableMaintenance.Table>`**: Renderiza la tabla. Maneja automáticamente paginación, ordenación y selección (Lazy).
  - **`<DataTableMaintenance.Dialog>`**: Diálogo de edición. Recibe una función `(item, setItem, errors, isReadOnly) => ReactNode`.
- **Hook `useMaintenanceContext`**: Permite a cualquier sub-componente acceder al estado del mantenimiento actual.

## 🚀 Cómo añadir un nuevo mantenimiento (Ejemplo: "Vehiculos")

1.  **Backend**:
    - Crear `Vehiculo.java` (entidad) y `VehiculoFilter.java`. **Importante**: Usar siempre `java.util.Date` para todas las fechas.
    - Crear `VehiculoRepository`, `VehiculoService` y `VehiculoController`.
2.  **Frontend**:
    - Crear `services/vehiculo.service.ts` extendiendo `BaseService`.
    - Crear `pages/VehiculoPage.tsx` con la estructura declarativa:
      ```tsx
      <DataTableMaintenance entityKey="vehiculo" service={vehiculoService} initialFilters={DEFAULT_FILTERS}>
          <DataTableMaintenance.Title title="Gestión de Vehículos" />
          <DataTableMaintenance.Filters>
              {(filters, setFilters) => (
                  <div className="col-12 md:col-4">
                      <InputText value={filters.matricula} onChange={(e) => setFilters(prev => ({...prev, matricula: e.target.value}))} />
                  </div>
              )}
          </DataTableMaintenance.Filters>
          <DataTableMaintenance.Toolbar showExport />
          <DataTableMaintenance.Table>
              <Column field="matricula" header="Matrícula" sortable />
              <Column field="marca" header="Marca" sortable />
          </DataTableMaintenance.Table>
          <DataTableMaintenance.Dialog>
              {(item, setItem, errors, isReadOnly) => (
                  <div className="field">
                      <InputText value={item.matricula} onChange={(e) => setItem(prev => ({...prev, matricula: e.target.value}))} disabled={isReadOnly} />
                  </div>
              )}
          </DataTableMaintenance.Dialog>
      </DataTableMaintenance>
      ```
3.  **Rutas**: Añadir la ruta en `main.tsx` usando `React.lazy`.

## 📌 Convenciones Importantes

### 📅 Gestión de Fechas
- **Backend**: Todas las fechas en `@Entity` y `Filter` deben usar **`java.util.Date`**.
- **Frontend**: Usar componentes `Calendar` de PrimeReact que manejan objetos `Date` nativos.

### 🆔 Gestión de IDs
- Cada entidad debe exponer un campo `id` en el JSON. Usar alias `getId()`/`setId()` si la PK tiene otro nombre.

### 🛠️ Git y Línea de Comandos (Win32 / PowerShell)
- Chaining: Usar `;` en lugar de `&&`.
- Commit Seguro: `git add . ; if ($?) { git commit -m '...' } ; if ($?) { git push }`.
