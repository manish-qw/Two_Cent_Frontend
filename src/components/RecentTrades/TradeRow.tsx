'use client';

import React, { memo } from 'react';
import { Trade } from '@/hooks/useRecentTrades';
import { formatPrice, formatAmount, formatTime } from '@/utils/formatters';

interface TradeRowProps {
  trade: Trade;
}

const TradeRow: React.FC<TradeRowProps> = memo(({ trade }) => {
  const isBuy = !trade.isBuyerMaker;
  const priceClass = isBuy ? 'text-green-primary' : 'text-red-primary';
  const animationClass = trade.shouldFlash
    ? isBuy
      ? 'animate-flash-green'
      : 'animate-flash-red'
    : '';

  return (
    <div
      className={`grid grid-cols-3 gap-2 text-xs py-1.5 cursor-pointer hover:bg-border/50 transition-colors duration-150 ease-in-out ${animationClass}`}
    >
      <div className={`${priceClass} font-medium`}>
        {formatPrice(trade.price)}
      </div>
      <div className="text-right text-text-secondary">
        {formatAmount(trade.amount)}
      </div>
      <div className="text-right text-text-dark">
        {formatTime(trade.time)}
      </div>
    </div>
  );
});

TradeRow.displayName = 'TradeRow';

export default TradeRow;
