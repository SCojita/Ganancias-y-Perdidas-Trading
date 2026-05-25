import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import plRoutes from './routes/plRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function buildApp() {
  // Logger: en producción se redactan los bodies (datos financieros del usuario)
  const app = Fastify({
    logger: {
      level: 'info',
      ...(process.env.NODE_ENV === 'production' && {
        redact: { paths: ['req.body', 'res'], censor: '[REDACTED]' },
      }),
    },
  });

  // Rate limiting: 100 peticiones/minuto por IP
  // Previene abuso del endpoint público /api/v1/calculate
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options, etc.)
  // @fastify/helmet envuelve el middleware helmet de Express
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  });

  // Error handler personalizado:
  // - En producción oculta stack traces (seguridad)
  // - Rate limit (429) responde en español
  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: true,
      message: statusCode === 429
        ? 'Demasiadas solicitudes. Intenta de nuevo en un minuto.'
        : process.env.NODE_ENV === 'production'
          ? 'Internal Server Error'
          : error.message,
    });
  });

  // Health check para monitoreo del servidor
  // Vercel lo usa para detectar si la función responde
  app.get('/api/v1/health', async () => ({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
  }));

  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/',
    index: 'index.html',
  });

  app.register(plRoutes, { prefix: '/api/v1' });

  return app;
}

let app;

export default async function handler(req, res) {
  if (!app) {
    app = buildApp();
    await app.ready();
  }
  app.server.emit('request', req, res);
}
