import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import plRoutes from './routes/plRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// buildApp() separa la configuracion del listen(), necesaria para serverless
// ya que Vercel importa la app en vez de ejecutar listen()
export function buildApp() {
  const app = Fastify({ logger: true });

  // Sirve archivos estáticos (index.html, CSS) en local
  // En Vercel los estáticos los sirve su CDN antes de llegar a la función.
  app.register(fastifyStatic, {
    root: join(__dirname, '..', 'public'),
    prefix: '/',
    index: 'index.html',
  });

  app.register(plRoutes, { prefix: '/api/v1' });

  return app;
}

const app = buildApp();

// Default export para Vercel: handler serverless compatible con @vercel/node
// Vercel espera una funcion (req, res) o un http.Server; Fastify no es ninguna
// de las dos, por eso redirigimos la peticion a traves de su server interno.
export default async function handler(req, res) {
  await app.ready();
  app.server.emit('request', req, res);
}

// Solo arrancamos el servidor en desarrollo local.
// En producción (Vercel) el handler de arriba recibe las peticiones.
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      await app.listen({ port: 3000 });
      console.log('Server listening on http://localhost:3000');
    } catch (err) {
      app.log.error(err);
      process.exit(1);
    }
  };
  start();
}
