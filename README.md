# Speed Cargo — Sistema de Paquetería Nacional

Aplicación full-stack para gestión de envíos con cobertura en los 22 departamentos de Guatemala.

---

## Estructura del proyecto

```
Pagina-Web/
├── frontend/          # React 18 + Vite + TailwindCSS + Framer Motion
├── backend/           # Node.js + Express + JWT + bcrypt
├── database/          # Schema PostgreSQL + Seeder con datos de prueba
└── speedcargo.html    # Versión original (archivo único, referencia)
```

---

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

---

## Configuración de la base de datos (SQL Server)

### 1. Crear la base de datos

```sql
CREATE DATABASE SpeedCargo;
GO
```

### 2. Ejecutar el schema

Abrir `database/schema.sql` en SQL Server Management Studio (SSMS) contra la base `SpeedCargo` y ejecutar, **o** desde consola:

```bash
sqlcmd -S localhost -U sa -P TuContraseña -d SpeedCargo -i database/schema.sql
```

### 3. Opción A — Seed con SQL puro (recomendado para demo)

Ejecutar `database/seed.sql` en SSMS:

```bash
sqlcmd -S localhost -U sa -P TuContraseña -d SpeedCargo -i database/seed.sql
```

> **Nota:** Los hashes de contraseña en `seed.sql` son de ejemplo.
> Para que el **login funcione**, ejecutar el seeder JS (Opción B).

### 3. Opción B — Seed con Node.js (contraseñas bcrypt reales)

```bash
cd backend
npm install
node seed.js
```

---

## Backend — Servidor API

### Instalación

```bash
cd backend
npm install
```

### Configurar variables de entorno

Copiar `.env.example` a `.env` y completar los valores:

```bash
cp .env.example .env
```

```env
PORT=4000
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=SpeedCargo
DB_USER=sa
DB_PASSWORD=TuContraseñaAqui
JWT_SECRET=cambiar_esto_en_produccion_clave_muy_segura
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Ejecutar en desarrollo

```bash
npm run dev
```

El servidor corre en: `http://localhost:4000`

---

## Frontend — Aplicación React

### Instalación

```bash
cd frontend
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

La app corre en: `http://localhost:5173`

---

## Credenciales de prueba

| Rol       | Email                    | Contraseña    |
|-----------|--------------------------|---------------|
| Admin     | admin@speedcargo.gt      | Admin123!     |
| Operador  | cmendez@speedcargo.gt    | Admin123!     |
| Operador  | agarcia@speedcargo.gt    | Admin123!     |
| Cliente   | pedro@gmail.com          | Cliente123!   |
| Cliente   | lucia@gmail.com          | Cliente123!   |

---

## Números de guía para pruebas de rastreo

| Guía          | Estado      |
|---------------|-------------|
| SC10001234    | Entregado   |
| SC10006789    | En tránsito |
| SC10007890    | En tránsito |
| SC10011234    | Retrasado   |
| SC10013456    | Pendiente   |

---

## API Endpoints

**Base URL:** `http://localhost:4000/api`

| Método | Ruta                          | Auth    | Descripción                      |
|--------|-------------------------------|---------|----------------------------------|
| GET    | `/health`                     | No      | Estado del servidor              |
| POST   | `/auth/login`                 | No      | Iniciar sesión                   |
| POST   | `/auth/register`              | No      | Registrar cuenta                 |
| GET    | `/auth/me`                    | JWT     | Perfil del usuario actual        |
| GET    | `/packages/track/:guia`       | No      | Rastreo público por guía         |
| GET    | `/packages`                   | JWT     | Listar paquetes (con filtros)    |
| POST   | `/packages`                   | JWT     | Crear paquete                    |
| PUT    | `/packages/:id`               | JWT     | Actualizar estado/paquete        |
| DELETE | `/packages/:id`               | Admin   | Eliminar paquete                 |
| GET    | `/quotes/calculate`           | No      | Calcular tarifa                  |
| GET    | `/quotes`                     | JWT     | Historial de cotizaciones        |
| POST   | `/quotes`                     | JWT     | Guardar cotización               |
| GET    | `/stats`                      | Operador| Estadísticas del dashboard       |
| GET    | `/users`                      | Admin   | Listar usuarios                  |
| PUT    | `/users/:id`                  | Admin   | Actualizar usuario               |
| DELETE | `/users/:id`                  | Admin   | Desactivar usuario               |

---

## Stack tecnológico

### Frontend
- **React 18** — Framework UI
- **Vite** — Bundler y dev server
- **TailwindCSS 3** — Estilos utilitarios
- **Framer Motion** — Animaciones
- **React Router v6** — Navegación SPA
- **Axios** — Cliente HTTP
- **Recharts** — Gráficas estadísticas
- **React Hot Toast** — Notificaciones
- **Lucide React** — Iconografía
- **date-fns** — Formateo de fechas

### Backend
- **Node.js + Express** — Servidor API REST
- **SQL Server** — Base de datos relacional (2016+)
- **JWT** — Autenticación stateless
- **bcryptjs** — Hash de contraseñas
- **mssql** — Cliente SQL Server para Node.js

---

## Schema de base de datos

| Tabla             | Descripción                                      |
|-------------------|--------------------------------------------------|
| `usuarios`        | Cuentas del sistema (admin, operador, cliente)   |
| `clientes`        | Destinatarios/remitentes de paquetes             |
| `paquetes`        | Registro central de envíos con guía única        |
| `historial_estados`| Trazabilidad completa de cada cambio de estado |
| `cotizaciones`    | Presupuestos guardados por usuario               |
| `departamentos`   | 22 departamentos con tiempo de entrega           |
| `municipios`      | Municipios de cada departamento                  |
| `rutas`           | Rutas de reparto asignadas a conductores         |
| `ruta_paquetes`   | Relación N:N rutas ↔ paquetes                   |
