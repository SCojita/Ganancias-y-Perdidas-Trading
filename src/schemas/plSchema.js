
// Esquema de validación para la ruta de cálculo de P&L (Profit and Loss) en una operación de trading:
export const plSchema = {
  body: {
    type: 'object',
    required: ['investedCapital', 'entryPrice', 'takeProfitPrice', 'stopLossPrice'],
    properties: {
      investedCapital: {
        type: 'number',
        exclusiveMinimum: 0,
        description: 'Capital total invertido en la operación',
      },
      entryPrice: {
        type: 'number',
        exclusiveMinimum: 0,
        description: 'Precio de entrada del activo',
      },
      takeProfitPrice: {
        type: 'number',
        description: 'Precio de take profit del activo',
      },
      stopLossPrice: {
        type: 'number',
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
