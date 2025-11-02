'use client';

import React, { memo } from 'react';
import { TradingPair } from '@/types/binance';

interface PairSelectorProps {
  currentPair: TradingPair;
  onPairChange: (pair: TradingPair) => void;
}

const pairs: TradingPair[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'];

const pairDisplayNames: Record<TradingPair, string> = {
  BTCUSDT: 'BTC/USDT',
  ETHUSDT: 'ETH/USDT',
  BNBUSDT: 'BNB/USDT',
};

const PairSelector: React.FC<PairSelectorProps> = memo(({ currentPair, onPairChange }) => {
  return (
    <select
      value={currentPair}
      onChange={(e) => onPairChange(e.target.value as TradingPair)}
      className="bg-border-light border border-border-light rounded px-3 py-1.5 text-text text-sm font-mono cursor-pointer hover:bg-border focus:outline-none focus:ring-2 focus:ring-green-primary/50"
    >
      {pairs.map((pair) => (
        <option key={pair} value={pair}>
          {pairDisplayNames[pair]}
        </option>
      ))}
    </select>
  );
});

PairSelector.displayName = 'PairSelector';

export default PairSelector;
