# P&L Calculator API

![Node](https://img.shields.io/badge/node-22.18-blue?logo=node.js)
![Fastify](https://img.shields.io/badge/fastify-5.3-000?logo=fastify)
![Vercel](https://img.shields.io/badge/deploy-vercel-000?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green)

API RESTful que calcula Profit & Loss de posiciones trading con precisión de 8 decimales usando `decimal.js`. Incluye frontend SPA con cambio de idioma (EN/ES) listo para deploy en Vercel.

---

## Features

- **Precisión financiera** — usa `decimal.js` para evitar errores de punto flotante en los cálculos
- **API REST validada** — JSON Schema con Fastify/Ajv: rechaza campos extra, valida tipos y rangos
- **Frontend incluido** — SPA responsivo con glassmorphism UI, fondo animado de estrellas y selector de idioma (EN/ES)
- **Seguridad** — rate limiting (100 req/min por IP), HTTP security headers (Helmet), CSP, redacción de errores en producción
- **Dual mode** — corre como servidor local con Nodemon o como serverless function en Vercel

---

## Stack

| Categoría | Tecnologías |
|---|---|
| Backend | Node.js 22 (ESM), Fastify 5, decimal.js |
| Frontend | HTML5, Tailwind CSS v4, SCSS, Vanilla JS |
| Seguridad | @fastify/helmet, @fastify/rate-limit |
| Deploy | Vercel + @vercel/node |
| Tooling | Nodemon, Jest, Sass, kill-port |

---

## Requisitos

- Node.js >= 18

---

## Instalación

```bash
git clone git@github-main:SCojita/Ganancias-y-Perdidas-Trading.git pnl-calc
cd pnl-calc
npm install
```

## Desarrollo

```bash
npm run dev
```

Servidor en `http://localhost:3000`. Los cambios en `src/` recargan automáticamente con Nodemon.

Para compilar estilos (SCSS + Tailwind):

```bash
npm run build:css
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia servidor con Nodemon |
| `npm test` | Ejecuta tests con Jest |
| `npm run build:css` | Compila SCSS y Tailwind |
| `npm run watch:css` | Compila SCSS y Tailwind en modo watch |
| `npm run build` | Build completo (css) |

## Variables de entorno

| Variable | Descripción | Obligatoria |
|---|---|---|
| `CORS_ORIGIN` | Origen permitido para CORS (obsoleto, no se usa actualmente) | No |

Copia `.env` desde el template:

```bash
cp .env.example .env
```

## API

### `GET /api/v1/health`

```json
{
  "status": "ok",
  "timestamp": "2026-05-25T12:00:00.000Z",
  "uptime": 1234.56
}
```

### `POST /api/v1/calculate`

Calcula cantidad de activo, P&L neto y porcentaje para take profit y stop loss.

**Request:**

```json
{
  "investedCapital": 1000,
  "entryPrice": 1.05,
  "takeProfitPrice": 1.08,
  "stopLossPrice": 1.02
}
```

**Response (200):**

```json
{
  "assetQuantity": 952.38095238,
  "takeProfit": { "netPL": 28.57, "percentage": 2.86 },
  "stopLoss": { "netPL": -28.57, "percentage": -2.86 }
}
```

Todos los campos son obligatorios. Valores mínimos > 0, máximos 1e15. Campos extra son rechazados.

## Estructura del proyecto

```
pnl-calc-backend/
├── src/                        # Backend
│   ├── app.js                  # Entry point (Fastify + Vercel handler)
│   ├── core/
│   │   └── mathEngine.js       # Lógica de cálculo P&L
│   ├── routes/
│   │   └── plRoutes.js         # Definición de rutas
│   └── schemas/
│       └── plSchema.js         # Validación JSON Schema
├── public/                     # Frontend
│   ├── index.html              # SPA
│   ├── css/
│   │   ├── index.scss          # Estilos custom (starfield, glass UI)
│   │   ├── tailwind-input.css  # Entrada Tailwind v4
│   │   └── *.css               # Compilados
│   └── img/
│       └── favicon.ico
├── config/                     # (reservado)
├── vercel.json                 # Configuración de deploy
├── .env                        # Variables de entorno locales
└── package.json
```

## Deploy

Conectá el repositorio a [Vercel](https://vercel.com). La plataforma detecta `vercel.json` automáticamente y deploya `src/app.js` como serverless function.

```bash
npm i -g vercel
vercel
```

## Disclaimer

Esta herramienta es solo para fines informativos y educativos. No constituye asesoría financiera. Verificá los resultados con tu broker antes de operar.
