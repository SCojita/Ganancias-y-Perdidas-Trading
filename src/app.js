import Fastify from 'fastify';
import plRoutes from './routes/plRoutes.js';

const app = Fastify({ logger: true });

// Definimos una ruta de prueba para verificar que el servidor está funcionando:
app.get('/', async (request, reply) => {
  return { status: 'ok' };
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
