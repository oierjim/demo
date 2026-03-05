# Proyecto de Demostración

Este repositorio contiene una aplicación completa de mantenimiento genérico con **Spring Boot (Backend)** y **React (Frontend)**. 

## 🚀 Guía de Inicio Rápido

Para ejecutar el proyecto completo en local, sigue las instrucciones de cada sección.

---

## 🔙 Backend (Java / Spring Boot)

El backend gestiona la persistencia de datos (H2), la seguridad y los servicios REST genéricos.

### 📋 Requisitos
- **Java 17**
- **Maven 3.x**

### 🛠️ Instalación y Ejecución
1. Navega a la carpeta del backend:
   ```bash
   cd x21a-backend
   ```
2. Compila el proyecto e instala las dependencias:
   ```bash
   mvn clean install -DskipTests
   ```
3. Ejecuta la aplicación:
   ```bash
   mvn spring-boot:run
   ```

---

## 🎨 Frontend (React / Vite)

Interfaz de usuario moderna construida con PrimeReact y TanStack Query.

### 📋 Requisitos
- **Node.js 18+**
- **npm**

### 🛠️ Instalación y Ejecución
1. Navega a la carpeta del frontend:
   ```bash
   cd x21a-frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```


---

## 🏗️ Arquitectura del Sistema

### Mantenimientos Genéricos
El proyecto implementa un sistema de mantenimientos automáticos:
- **Backend**: `BaseController` y `BaseService` que gestionan CRUD y filtrado avanzado mediante `FilterRequest`.
- **Frontend**: Hook `useMaintenance` que encapsula la lógica de paginación, filtrado, selección masiva (Select All Pages) y diálogos.

### Base de Datos
- Utiliza **H2 Database** en modo archivo local (`./x21a-backend/data/x21aDB`).
- Los datos de prueba se cargan automáticamente al iniciar la aplicación si las tablas están vacías.

---

## 🛠️ Comandos Útiles

| Tarea | Backend (Maven) | Frontend (npm) |
| :--- | :--- | :--- |
| **Limpiar** | `mvn clean` | `rm -rf node_modules` |
| **Compilar** | `mvn compile` | `npm run build` |
| **Ejecutar** | `mvn spring-boot:run` | `npm run dev` |
| **Linter** | - | `npm run lint` |
