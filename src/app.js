import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import plRoutes from './routes/plRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = Fastify({ logger: true });

app.register(fastifyStatic, {
  root: join(__dirname, '..', 'public'),
  prefix: '/',
  index: 'index.html',
});

await app.register(plRoutes, { prefix: '/api/v1' }); // Registramos las rutas de PL con el prefijo /api/v1

// Iniciamos el servidor:
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
