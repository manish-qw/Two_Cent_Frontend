// components/OrderBook/Spread.tsx
'use client';

import React, { memo } from 'react';

interface SpreadProps {
  spread: {
    value: number;
    percent: number;
  } | null;
  lowestAsk?: number;
  highestBid?: number;
}

const Spread: React.FC<SpreadProps> = memo(({ spread, lowestAsk, highestBid }) => {
  if (!spread || !lowestAsk || !highestBid) {
    return (
      <div className="px-4 py-3 bg-border/50 border-t border-border flex items-center justify-center gap-4">
        <span className="text-xs text-text-dark">Spread</span>
        <span className="text-sm font-semibold text-text-muted">Loading...</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-3 bg-border/50 border-t border-border flex items-center justify-center gap-4">
      <span className="text-xs text-text-dark">Spread</span>
      <span className="text-sm font-semibold text-yellow-primary">
        {spread.value.toFixed(2)} USDT
      </span>
      <span className="text-xs text-text-dark">
        ({spread.percent.toFixed(4)}%)
      </span>
    </div>
  );
});

Spread.displayName = 'Spread';

export default Spread;