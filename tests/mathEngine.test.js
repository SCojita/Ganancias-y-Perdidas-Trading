import { calculatePL } from '../src/core/mathEngine.js';

describe('calculatePL', () => {
  test('calculates exact P&L with $1000 at $50000 entry, TP $55000, SL $45000', () => {
    const result = calculatePL({
      investedCapital: 1000,
      entryPrice: 50000,
      takeProfitPrice: 55000,
      stopLossPrice: 45000,
    });

    expect(result.assetQuantity).toBe(0.02);
    expect(result.takeProfit.netPL).toBe(100);
    expect(result.takeProfit.percentage).toBe(10);
    expect(result.stopLoss.netPL).toBe(-100);
    expect(result.stopLoss.percentage).toBe(-10);
  });

  test('maintains decimal precision with realistic values', () => {
    const result = calculatePL({
      investedCapital: 1234.56,
      entryPrice: 48234.75,
      takeProfitPrice: 51000.50,
      stopLossPrice: 46000.25,
    });

    expect(result.assetQuantity).toBe(0.02559483);
    expect(result.takeProfit.netPL).toBe(70.79);
    expect(result.takeProfit.percentage).toBe(5.73);
    expect(result.stopLoss.netPL).toBe(-57.19);
    expect(result.stopLoss.percentage).toBe(-4.63);
  });
});
