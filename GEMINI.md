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
- **Carga de Datos**: Se utiliza `@PostConstruct` en los controladores específicos (ej. `AnimalController`) para poblar la base de datos con 100 registros de prueba si está vacía.

### Frontend (React / TypeScript)
Ubicación: `x21a-frontend/src/`

- **`services/base.service.ts`**: Clase abstracta que encapsula las llamadas a la API genérica.
- **`components/DataTableTemplate.tsx`**: Componente unificado que centraliza toda la lógica de la tabla. Sus capacidades avanzadas incluyen:
  - **`selectionMode`**: Permite elegir entre `'multiple'`, `'single'` o `'none'`.
  - **Control de Botones**: Propiedades booleanas `showNew`, `showEdit`, `showDelete`, `showExport`.
  - **`readOnly`**: Si es `true`, la edición se convierte en modo "Detalle" (solo lectura). Los registros **nuevos** siguen siendo editables aunque esta propiedad sea `true`.
  - **Validación**: Propiedad `validate` que recibe una función `(item) => Record<string, string>`. Los errores se pasan automáticamente a `dialogFields`.
  - **Títulos Dinámicos**: El título del diálogo se genera como `[Acción] [Entidad]` (ej: "Nuevo Animal"). Usa la propiedad `entityNameKey` para buscar la traducción en `domain.json`.
  - **`extraButtons`**: Slot para inyectar botones personalizados basados en la selección.
  - Integración automática con el hook `useMaintenance`.

## 🚀 Cómo añadir un nuevo mantenimiento (Ejemplo: "Vehiculos")

1.  **Backend**:
    - Crear `Vehiculo.java` (entidad) y `VehiculoFilter.java`. **Importante**: Usar siempre `java.util.Date` para todas las fechas.
    - Crear `VehiculoRepository`, `VehiculoService` y `VehiculoController`.
2.  **Frontend**:
    - Crear `services/vehiculo.service.ts` extendiendo `BaseService`.
    - Crear `pages/VehiculoPage.tsx` utilizando `DataTableTemplate`.
    - Definir la lógica de validación y pasarla al prop `validate`.
    - Asegurar que los inputs en `dialogFields` usen la propiedad `invalid={!!errors.campo}` y muestren el mensaje `<small className="p-error">{errors.campo}</small>`.

## 📌 Convenciones Importantes

### 📅 Gestión de Fechas
- **Backend**: Por convención, todas las fechas en los modelos (`@Entity`) y filtros (`Filter`) deben utilizar siempre **`java.util.Date`** para mantener la compatibilidad con los serializadores.
- **Frontend**: Los componentes `Calendar` de PrimeReact manejan objetos `Date` nativos de JavaScript, compatibles con el backend.

### 🆔 Gestión de IDs y Compatibilidad
Cada entidad debe exponer un identificador bajo el nombre `id` en el JSON.
- **Patrón de Alias**: Si la PK no se llama `id`, implementar `getId()` y `setId()` como alias.
- **Tipado**: El tipo de ID en `BaseController<T, ID, F>` debe coincidir con el de la PK.

### 🛠️ Git y Línea de Comandos (PowerShell / Win32)
En el entorno **win32**, se utiliza **PowerShell**.
- **Chaining**: Usar `;` en lugar de `&&`.
- **Commit Seguro**: `git add . ; if ($?) { git commit -m '...' } ; if ($?) { git push }`.

### 🗄️ Base de Datos y Persistencia
- **H2 Database**: Los datos se guardan en `./data/x21aDB`. Borrar este archivo para regenerar tablas tras cambios en el modelo.
- **Mapeo Físico**: Usar `@Column(name = "NOMBRE_COL")` si es necesario.
- **Logs**: Nivel `DEBUG` para `com.ejie.x21a` para visualizar queries y filtrado genérico.
