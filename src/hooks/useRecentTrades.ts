// hooks/useRecentTrades.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { BinanceTradeEvent } from '@/types/binance';

export interface Trade {
  id: number;
  price: number;
  amount: number;
  time: number;
  isBuyerMaker: boolean; // true = sell (red), false = buy (green)
  shouldFlash: boolean;
}

const MAX_TRADES = 50;

export function useRecentTrades(tradeEvent: BinanceTradeEvent | null) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [currentSymbol, setCurrentSymbol] = useState<string | null>(null);

  useEffect(() => {
    if (tradeEvent && tradeEvent.s !== currentSymbol) {
      setTrades([]);
      setCurrentSymbol(tradeEvent.s);
    }
  }, [tradeEvent, currentSymbol]);

  useEffect(() => {
    if (!tradeEvent) return;

    const newTrade: Trade = {
      id: tradeEvent.a,
      price: parseFloat(tradeEvent.p),
      amount: parseFloat(tradeEvent.q),
      time: tradeEvent.T,
      isBuyerMaker: tradeEvent.m,
      shouldFlash: true,
    };

    setTrades((prev) => {
      const updated = [newTrade, ...prev].slice(0, MAX_TRADES);
      return updated;
    });

    setTimeout(() => {
      setTrades((prev) =>
        prev.map((t) =>
          t.id === newTrade.id ? { ...t, shouldFlash: false } : t
        )
      );
    }, 500);
  }, [tradeEvent]);

  return { trades };
}