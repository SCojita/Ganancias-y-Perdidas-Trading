import { Decimal } from 'decimal.js';

// Función para calcular el P&L (Profit and Loss) de una operación de trading:
export function calculatePL({ investedCapital, entryPrice, takeProfitPrice, stopLossPrice }) {
  
  // ---- VARIABLES ----
  const capital = new Decimal(investedCapital);
  const entry = new Decimal(entryPrice);
  const tp = new Decimal(takeProfitPrice);
  const sl = new Decimal(stopLossPrice);

  const assetQuantity = capital.div(entry);

  const tpNetProfit = assetQuantity.mul(tp.sub(entry));
  const tpPercentage = tpNetProfit.div(capital).mul(100);

  const slNetLoss = assetQuantity.mul(sl.sub(entry));
  const slPercentage = slNetLoss.div(capital).mul(100);

  // Devolvemos los resultados formateados a un número con 2 decimales para el P&L y 2 decimales para el porcentaje:
  return {
    assetQuantity: assetQuantity.toDecimalPlaces(8).toNumber(),
    takeProfit: {
      netPL: tpNetProfit.toDecimalPlaces(2).toNumber(),
      percentage: tpPercentage.toDecimalPlaces(2).toNumber(),
    },
    stopLoss: {
      netPL: slNetLoss.toDecimalPlaces(2).toNumber(),
      percentage: slPercentage.toDecimalPlaces(2).toNumber(),
    },
  };
}
