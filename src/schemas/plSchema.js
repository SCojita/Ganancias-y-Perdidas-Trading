// Esquema de validación JSON Schema para POST /api/v1/calculate
// Fastify usa Ajv internamente para validar request/response
export const plSchema = {
  body: {
    type: 'object',
    required: ['investedCapital', 'entryPrice', 'takeProfitPrice', 'stopLossPrice'],
    // Rechaza campos extra en el body (protección contra inyección de datos)
    additionalProperties: false,
    properties: {
      investedCapital: {
        type: 'number',
        exclusiveMinimum: 0, // Debe ser > 0
        maximum: 1e15,       // Previene desbordamiento numérico
        description: 'Capital total invertido en la operación',
      },
      entryPrice: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: 1e15,
        description: 'Precio de entrada del activo',
      },
      takeProfitPrice: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: 1e15,
        description: 'Precio de take profit del activo',
      },
      stopLossPrice: {
        type: 'number',
        exclusiveMinimum: 0,
        maximum: 1e15,
        description: 'Precio de stop loss del activo',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        assetQuantity: {
          type: 'number',
          description: 'Cantidad del activo adquirida con el capital invertido',
        },
        takeProfit: {
          type: 'object',
          properties: {
            netPL: {
              type: 'number',
              description: 'Ganancia neta exacta al alcanzar el take profit',
            },
            percentage: {
              type: 'number',
              description: 'Porcentaje de ganancia respecto al capital invertido',
            },
          },
          required: ['netPL', 'percentage'],
        },
        stopLoss: {
          type: 'object',
          properties: {
            netPL: {
              type: 'number',
              description: 'Pérdida neta exacta al alcanzar el stop loss',
            },
            percentage: {
              type: 'number',
              description: 'Porcentaje de pérdida respecto al capital invertido',
            },
          },
          required: ['netPL', 'percentage'],
        },
      },
      required: ['assetQuantity', 'takeProfit', 'stopLoss'],
    },
  },
};
