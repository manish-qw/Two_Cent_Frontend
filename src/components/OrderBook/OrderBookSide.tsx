'use client';

import React, { memo } from 'react';
import OrderBookRow from './OrderBookRow';
import { OrderBookLevel } from '@/hooks/useOrderBook';
import { calculateDepthPercentage } from '@/utils/orderBookHelpers';

interface OrderBookSideProps {
  levels: OrderBookLevel[];
  maxTotal: number;
  side: 'bid' | 'ask';
  baseCurrency?: string;
}

const OrderBookSide: React.FC<OrderBookSideProps> = memo(({
  levels,
  maxTotal,
  side,
  baseCurrency = 'BTC',
}) => {
  const isBid = side === 'bid';
  
  return (
    <div className="px-4 h-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 text-xs text-text-dark mb-3 pb-2 border-b border-border flex-shrink-0">
        <div className={isBid ? 'text-right' : 'text-left'}>
          Price (USDT)
        </div>
        <div className="text-right">Amount ({baseCurrency})</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pb-8">
        {levels.map((level) => (
          <OrderBookRow
            key={level.price}
            price={level.price}
            amount={level.amount}
            total={level.total}
            depthPercentage={calculateDepthPercentage(level.total, maxTotal)}
            side={side}
          />
        ))}
      </div>
    </div>
  );
});

OrderBookSide.displayName = 'OrderBookSide';

export default OrderBookSide;
