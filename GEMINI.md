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
  - **`selectionMode`**: Permite elegir entre `'multiple'` (checkboxes y multiselección masiva), `'single'` (selección de una sola fila al hacer clic) o `'none'`.
  - **Control de Botones**: Propiedades booleanas para ocultar/mostrar botones estándar: `showNew`, `showEdit`, `showDelete`, `showExport`.
  - **`readOnly`**: Si se establece en `true`, el botón de edición se convierte en un botón de "Detalle" (icono de ojo), el diálogo de edición desactiva todos los campos (`disabled`) y oculta el botón de guardar, dejando solo el botón de cerrar.
  - **`extraButtons`**: Slot para inyectar botones personalizados. Recibe los elementos seleccionados (`selectedItems`) como parámetro para habilitar/deshabilitar acciones dinámicamente.
  - Integración automática con el hook `useMaintenance`.

## 🚀 Cómo añadir un nuevo mantenimiento (Ejemplo: "Vehiculos")

1.  **Backend**:
    - Crear `Vehiculo.java` (entidad) y `VehiculoFilter.java`. **Importante**: Usar siempre `java.util.Date` para todas las fechas.
    - Crear `VehiculoRepository`.
    - Crear `VehiculoService`.
    - Crear `VehiculoController`.
2.  **Frontend**:
    - Crear `services/vehiculo.service.ts` extendiendo `BaseService`.
    - Crear `pages/VehiculoPage.tsx` utilizando `DataTableTemplate`.

## 📌 Convenciones Importantes

### 📅 Gestión de Fechas
- **Backend**: Todas las fechas en entidades y filtros deben ser **siempre `java.util.Date`**. Esto garantiza compatibilidad con los serializadores del proyecto.
- **Frontend**: Los componentes `Calendar` de PrimeReact manejan objetos `Date` nativos, que son los que se envían al backend.

### 🆔 Gestión de IDs y Compatibilidad
Para que el frontend genérico y el `BaseController` funcionen correctamente, cada entidad debe exponer un identificador bajo el nombre `id` en el JSON, independientemente de cómo se llame en la base de datos.

- **Patrón de Alias (Ejemplo `Expediente.java`)**:
  Si la clave primaria no se llama `id` (ej. es `referencia`), se deben implementar métodos de compatibilidad:
  ```java
  @Id
  private String referencia; // PK real en DB
  
  // Métodos de compatibilidad para el genérico (Frontend/BaseController)
  public String getId() { return referencia; }
  public void setId(String id) { this.referencia = id; }
  ```
- **Tipado**: El tipo de ID en el `BaseController<T, ID, F>` debe coincidir con el tipo de la PK (ej. `Long` para `Animal`, `String` para `Expediente`).
- **Autonuméricos**: Usar `@GeneratedValue(strategy = GenerationType.IDENTITY)` siempre que la lógica de negocio no requiera un ID manual (como ocurre en `Animal`).

### 📅 Gestión de Fechas
- **Backend**: Por convención del proyecto, todas las fechas en los modelos (`@Entity`) y filtros (`Filter`) deben utilizar siempre **`java.util.Date`**. Se debe evitar el uso de `LocalDate` o `LocalDateTime` para mantener la compatibilidad con los serializadores configurados.
- **Frontend**: El componente `Calendar` de PrimeReact maneja objetos `Date` nativos de JavaScript, que son compatibles con `java.util.Date`.

### 🛠️ Git y Línea de Comandos (PowerShell / Win32)
En el entorno **win32**, se utiliza **PowerShell** para ejecutar comandos.
- **NO USAR `&&`**: PowerShell (v5.1 y anteriores) no soporta el operador `&&`. Usar el separador de instrucciones `;` para encadenar comandos.
- **Commit y Push**: Para asegurar que un comando solo se ejecuta si el anterior tuvo éxito, usar la lógica de PowerShell: `git add . ; if ($?) { git commit -m '...' } ; if ($?) { git push }`.

### 🗄️ Base de Datos y Persistencia
- **H2 Database**: Los datos se guardan en `./data/x21aDB`. Si hay errores de esquema (ej. "column not found" tras un cambio en la entidad), borrar este archivo para que Hibernate regenere las tablas según el modelo actual.
- **Mapeo Físico**: Si la base de datos exige un nombre de columna específico, usar `@Column(name = "NOMBRE_COL")`.
- **Logs**: Nivel `DEBUG` para `com.ejie.x21a` para visualizar las queries y el filtrado genérico.
