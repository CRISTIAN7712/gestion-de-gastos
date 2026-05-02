# Gestión de gastos personales (multiusuario)

Guía completa **paso a paso** para levantar el proyecto en local con aislamiento seguro por usuario.

## 1) Requisitos previos

Instala estas herramientas:

- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Git

Comandos de verificación:

```bash
node -v
npm -v
psql --version
git --version
```

---

## 2) Estructura del proyecto

```text
.
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── server.js
├── frontend/
│   ├── .env.example
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── sql/
    └── init.sql
```

---

## 3) Configurar base de datos PostgreSQL

### 3.1 Crear base de datos

Desde terminal:

```bash
createdb gestion_gastos
```

Si no tienes `createdb`, puedes usar:

```bash
psql -U postgres -c "CREATE DATABASE gestion_gastos;"
```

### 3.2 Ejecutar script inicial

```bash
psql -U postgres -d gestion_gastos -f sql/init.sql
```

Esto crea:
- Tabla `users`
- Tabla `categories`
- Tabla `transactions`
- Tipo enum `transaction_type`
- Índices de rendimiento
- Restricciones de integridad multiusuario

---

## 4) Configurar backend

### 4.1 Instalar dependencias

```bash
cd backend
npm install
```

> Nota: no depende de `react-router-dom`; la navegación básica está implementada sin librería externa para evitar errores de resolución de paquetes.

### 4.2 Crear variables de entorno

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales reales de PostgreSQL:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gestion_gastos
JWT_SECRET=super-secreto-cambiar
JWT_EXPIRES_IN=1d
```

### 4.3 Levantar API

```bash
npm run dev
```

API disponible en:
- `http://localhost:4000`
- Healthcheck: `GET /health`

---

## 5) Configurar frontend

> Ahora `frontend/` ya incluye proyecto Vite completo (scripts y configuración Tailwind), por lo que no necesitas ejecutar `npx tailwindcss init -p`.

### 5.1 Instalar dependencias del frontend

```bash
cd frontend
npm install
```

> Nota: no depende de `react-router-dom`; la navegación básica está implementada sin librería externa para evitar errores de resolución de paquetes.

> Si antes te falló `npx tailwindcss init -p`, ya no hace falta: el repo trae `tailwind.config.js` y `postcss.config.js` listos.

### 5.2 Variables de entorno frontend

```bash
cd frontend
cp .env.example .env
```

Contenido:

```env
VITE_API_URL=http://localhost:4000/api
```

### 5.3 Ejecutar frontend

```bash
npm run dev
```

---

## 6) Probar flujo completo (manual)

### 6.1 Registro

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"ana","email":"ana@mail.com","password":"Segura123!"}'
```

Guarda el `token` de respuesta.

### 6.2 Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@mail.com","password":"Segura123!"}'
```

### 6.3 Consultar resumen mensual

```bash
curl "http://localhost:4000/api/reports/summary?year=2026&month=5" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 6.4 Consultar transacciones filtradas por usuario autenticado

```bash
curl "http://localhost:4000/api/transactions?year=2026&month=5" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 7) Seguridad multiusuario (clave)

- El middleware `authRequired` valida JWT y extrae `req.user.id`.
- Las consultas usan siempre `WHERE user_id = $1` con el `id` del token.
- `transactions` tiene refuerzo de integridad con FK compuesta `(user_id, category_id)`.

Con esto, un usuario no puede ver ni alterar datos de otro usuario, incluso si intenta manipular IDs desde frontend.

---

## 8) Endpoints disponibles hoy

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (requiere JWT)

### Transacciones
- `GET /api/transactions`
  - Soporta query params opcionales: `year`, `month`
- `POST /api/transactions`

### Categorías
- `GET /api/categories`
- `GET /api/categories?type=expense|income`
- `POST /api/categories`

### Usuarios
- `GET /api/users/me`
- `PUT /api/users/me`
- `PUT /api/users/me/password`

### Reportes
- `GET /api/reports/summary?year=YYYY&month=MM`

---

## 9) Qué sigue para producción

1. Completar CRUD de transacciones (`POST`, `PUT`, `DELETE`) con filtro `user_id` obligatorio.
2. CRUD de categorías por usuario.
3. Validación de payload (ej. Zod/Joi).
4. Migraciones (ej. Knex/Prisma/Umzug).
5. Tests automáticos (unitarios + integración).
6. Rotación/refresh de tokens y hardening de seguridad.


---


## 10) Solución al error visto en Windows/psql

Si te aparece este error al ejecutar `sql/init.sql`:

- `ERROR: no hay restricción unique que coincida ... categories`
- y luego `ERROR: no existe la relación "transactions"`

la causa era que faltaba una restricción única compuesta en `categories` para soportar la FK `(user_id, category_id)` de `transactions`.

Ya quedó corregido en `sql/init.sql` con:
- `categories_user_id_id_key UNIQUE (user_id, id)`

### Cómo recuperarte si ya ejecutaste una versión anterior

Opción A (rápida en desarrollo, borra datos):

```bash
psql -U postgres -d gestion_gastos -c "DROP TABLE IF EXISTS transactions CASCADE;"
psql -U postgres -d gestion_gastos -c "DROP TABLE IF EXISTS categories CASCADE;"
psql -U postgres -d gestion_gastos -c "DROP TABLE IF EXISTS users CASCADE;"
psql -U postgres -d gestion_gastos -f sql/init.sql
```

Opción B (sin borrar `users/categories`, solo completar estructura):

```bash
psql -U postgres -d gestion_gastos -c "ALTER TABLE categories ADD CONSTRAINT categories_user_id_id_key UNIQUE (user_id, id);"
psql -U postgres -d gestion_gastos -f sql/init.sql
```

> En la versión actual del script, esa `ALTER TABLE` ya se ejecuta de forma segura dentro de un bloque `DO`, por lo que futuras corridas son idempotentes.


### Nota de compatibilidad de sesión

Si ves 404 en `/api/users/me`, el frontend intentará automáticamente `/api/auth/me` como fallback.
Aun así, reinicia el backend tras actualizar código para asegurar que rutas nuevas estén cargadas.
