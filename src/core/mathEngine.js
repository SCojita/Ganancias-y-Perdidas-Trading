import { Decimal } from 'decimal.js';

export function calculatePL({ investedCapital, entryPrice, takeProfitPrice, stopLossPrice }) {
  const capital = new Decimal(investedCapital);
  const entry = new Decimal(entryPrice);
  const tp = new Decimal(takeProfitPrice);
  const sl = new Decimal(stopLossPrice);

  const assetQuantity = capital.div(entry);

  const tpNetProfit = assetQuantity.mul(tp.sub(entry));
  const tpPercentage = tpNetProfit.div(capital).mul(100);

  const slNetLoss = assetQuantity.mul(sl.sub(entry));
  const slPercentage = slNetLoss.div(capital).mul(100);

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
