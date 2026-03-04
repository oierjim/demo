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
- **Páginas de Mantenimiento**: Siguen un patrón común usando hooks para gestionar el estado de la tabla, filtros y diálogos de edición.
- **Comunicación**: Las tablas envían el objeto `FilterRequest` y reciben un mapa con `data`, `totalRecords` y `page`.

## 🚀 Cómo añadir un nuevo mantenimiento (Ejemplo: "Vehiculos")

1.  **Backend**:
    - Crear `Vehiculo.java` (entidad) y `VehiculoFilter.java`.
    - Crear `VehiculoRepository extends JpaRepository<Vehiculo, Long>, JpaSpecificationExecutor<Vehiculo>`.
    - Crear `VehiculoService extends BaseService<Vehiculo, Long, VehiculoFilter>`.
    - Crear `VehiculoController extends BaseController<Vehiculo, Long, VehiculoFilter>`.
2.  **Frontend**:
    - Crear `services/vehiculo.service.ts` extendiendo `BaseService`.
    - Crear `pages/VehiculoPage.tsx` copiando la estructura de `ExpedientePage.tsx`. **Importante**: `ExpedientePage.tsx` es el componente de referencia ya que incluye la lógica validada de:
        - Selección masiva a través de múltiples páginas ("Select All Pages").
        - Filtrado avanzado con calendarios (Rangos de fechas).
        - Internacionalización completa (i18n) en castellano y euskera.
        - Gestión de diálogos de edición y confirmación de borrado.

## 📌 Convenciones Importantes

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

### 🗄️ Base de Datos y Persistencia
- **H2 Database**: Los datos se guardan en `./data/x21aDB`. Si hay errores de esquema (ej. "column not found" tras un cambio en la entidad), borrar este archivo para que Hibernate regenere las tablas según el modelo actual.
- **Mapeo Físico**: Si la base de datos exige un nombre de columna específico, usar `@Column(name = "NOMBRE_COL")`.
- **Logs**: Nivel `DEBUG` para `com.ejie.x21a` para visualizar las queries y el filtrado genérico.
