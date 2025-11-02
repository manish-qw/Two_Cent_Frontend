// hooks/useOrderBook.ts
'use client';

import { useReducer, useEffect, useMemo, useState } from 'react';
import { BinanceDepthUpdate } from '@/types/binance';

export interface OrderBookLevel {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookState {
  bids: Map<string, string>; // price -> quantity
  asks: Map<string, string>;
}

type OrderBookAction =
  | { type: 'UPDATE_BIDS'; payload: [string, string][] }
  | { type: 'UPDATE_ASKS'; payload: [string, string][] }
  | { type: 'RESET' };

function orderBookReducer(state: OrderBookState, action: OrderBookAction): OrderBookState {
  switch (action.type) {
    case 'UPDATE_BIDS': {
      const newBids = new Map(state.bids);
      action.payload.forEach(([price, quantity]) => {
        // IMPORTANT: quantity '0' means remove this price level
        if (quantity === '0' || parseFloat(quantity) === 0) {
          newBids.delete(price);
        } else {
          newBids.set(price, quantity);
        }
      });
      return { ...state, bids: newBids };
    }
    case 'UPDATE_ASKS': {
      const newAsks = new Map(state.asks);
      action.payload.forEach(([price, quantity]) => {
        // IMPORTANT: quantity '0' means remove this price level
        if (quantity === '0' || parseFloat(quantity) === 0) {
          newAsks.delete(price);
        } else {
          newAsks.set(price, quantity);
        }
      });
      return { ...state, asks: newAsks };
    }
    case 'RESET':
      return { bids: new Map(), asks: new Map() };
    default:
      return state;
  }
}

export function useOrderBook(depthUpdate: BinanceDepthUpdate | null) {
  const [state, dispatch] = useReducer(orderBookReducer, {
    bids: new Map(),
    asks: new Map(),
  });
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (depthUpdate && depthUpdate.s !== currentSymbol) {
      dispatch({ type: 'RESET' });
      setCurrentSymbol(depthUpdate.s);
    }
  }, [depthUpdate, currentSymbol]);

  // Process depth updates
  useEffect(() => {
    if (!depthUpdate) return;

    if (depthUpdate.b && depthUpdate.b.length > 0) {
      dispatch({ type: 'UPDATE_BIDS', payload: depthUpdate.b });
    }

    if (depthUpdate.a && depthUpdate.a.length > 0) {
      dispatch({ type: 'UPDATE_ASKS', payload: depthUpdate.a });
    }
  }, [depthUpdate]);

  // Memoized sorted bids with cumulative totals
  const bids = useMemo((): OrderBookLevel[] => {
    const bidArray = Array.from(state.bids.entries())
      .map(([price, amount]) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
      }))
      .sort((a, b) => b.price - a.price) // DESC - highest first
      .slice(0, 20); // Top 20 levels

    // Calculate cumulative totals
    let cumulativeTotal = 0;
    return bidArray.map((level) => {
      cumulativeTotal += level.amount;
      return {
        ...level,
        total: cumulativeTotal,
      };
    });
  }, [state.bids]);

  // Memoized sorted asks with cumulative totals
  const asks = useMemo((): OrderBookLevel[] => {
    const askArray = Array.from(state.asks.entries())
      .map(([price, amount]) => ({
        price: parseFloat(price),
        amount: parseFloat(amount),
      }))
      .sort((a, b) => a.price - b.price) // ASC - lowest first
      .slice(0, 20); // Top 20 levels

    // Calculate cumulative totals
    let cumulativeTotal = 0;
    return askArray.map((level) => {
      cumulativeTotal += level.amount;
      return {
        ...level,
        total: cumulativeTotal,
      };
    });
  }, [state.asks]);

  // Calculate spread
  const spread = useMemo(() => {
    if (asks.length === 0 || bids.length === 0) return null;
    
    const lowestAsk = asks[0].price;
    const highestBid = bids[0].price;
    const spreadValue = lowestAsk - highestBid;
    const spreadPercent = (spreadValue / lowestAsk) * 100;

    return {
      value: spreadValue,
      percent: spreadPercent,
    };
  }, [asks, bids]);

  return { bids, asks, spread };
}