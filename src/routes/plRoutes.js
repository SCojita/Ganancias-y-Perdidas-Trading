import { plSchema } from '../schemas/plSchema.js';
import { calculatePL } from '../core/mathEngine.js';

// Función para registrar las rutas relacionadas con el cálculo de P&L (Profit and Loss) en una operación de trading:
export default async function plRoutes(fastify) {
  fastify.post('/calculate', { schema: plSchema }, async (request) => {
    return calculatePL(request.body);
  });
}
