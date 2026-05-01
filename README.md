# Gestión de gastos personales (multiusuario)

## Estructura recomendada

```text
.
├── backend/
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
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── utils/
└── sql/
    └── init.sql
```

## Seguridad multiusuario

- El `auth.middleware` valida JWT y extrae `req.user.id`.
- **Toda consulta SQL** debe filtrar por `user_id = $1` usando `req.user.id`.
- El esquema refuerza aislamiento con FK compuesta `(user_id, category_id)` en `transactions`.
