// Order book helper functions

import { OrderBookLevel } from '@/types/binance';

export const sortBids = (bids: Map<number, number>): OrderBookLevel[] => {
  const levels: OrderBookLevel[] = [];
  const sortedPrices = Array.from(bids.keys()).sort((a, b) => b - a);
  
  let cumulativeTotal = 0;
  for (const price of sortedPrices) {
    const amount = bids.get(price) || 0;
    cumulativeTotal += amount;
    levels.push({
      price,
      amount,
      total: cumulativeTotal,
    });
  }
  
  return levels;
};

export const sortAsks = (asks: Map<number, number>): OrderBookLevel[] => {
  const levels: OrderBookLevel[] = [];
  const sortedPrices = Array.from(asks.keys()).sort((a, b) => a - b);
  
  let cumulativeTotal = 0;
  for (const price of sortedPrices) {
    const amount = asks.get(price) || 0;
    cumulativeTotal += amount;
    levels.push({
      price,
      amount,
      total: cumulativeTotal,
    });
  }
  
  return levels;
};

export const calculateSpread = (
  bids: Map<number, number>,
  asks: Map<number, number>
): number => {
  const highestBid = Math.max(...Array.from(bids.keys()));
  const lowestAsk = Math.min(...Array.from(asks.keys()));
  
  if (!isFinite(highestBid) || !isFinite(lowestAsk)) {
    return 0;
  }
  
  return lowestAsk - highestBid;
};

export const getMaxTotal = (levels: OrderBookLevel[]): number => {
  if (levels.length === 0) return 0;
  return Math.max(...levels.map(level => level.total));
};

export const calculateDepthPercentage = (total: number, maxTotal: number): number => {
  if (maxTotal === 0) return 0;
  return (total / maxTotal) * 100;
};

export const trimOrderBook = (
  levels: Map<number, number>,
  maxLevels: number = 20
): Map<number, number> => {
  const sortedPrices = Array.from(levels.keys()).sort((a, b) => b - a);
  const trimmedLevels = new Map<number, number>();
  
  for (let i = 0; i < Math.min(maxLevels, sortedPrices.length); i++) {
    const price = sortedPrices[i];
    const amount = levels.get(price);
    if (amount !== undefined) {
      trimmedLevels.set(price, amount);
    }
  }
  
  return trimmedLevels;
};
