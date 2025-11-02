'use client';

import React, { memo, useMemo } from 'react';
import OrderBookSide from './OrderBookSide';
import Spread from './Spread';
import { OrderBookLevel } from '@/hooks/useOrderBook';

interface OrderBookProps {
  bidLevels: OrderBookLevel[];
  askLevels: OrderBookLevel[];
  spread: {
    value: number;
    percent: number;
  } | null;
  baseCurrency?: string;
}

const OrderBook: React.FC<OrderBookProps> = memo(({
  bidLevels,
  askLevels,
  spread,
  baseCurrency = 'BTC',
}) => {
  const maxBidTotal = useMemo(() => {
    if (bidLevels.length === 0) return 0;
    return Math.max(...bidLevels.map(level => level.total));
  }, [bidLevels]);

  const maxAskTotal = useMemo(() => {
    if (askLevels.length === 0) return 0;
    return Math.max(...askLevels.map(level => level.total));
  }, [askLevels]);

  return (
    <div className="bg-panel border border-border rounded-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 155px)' }}>
      <div className="px-4 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-text">Order Book</h2>
      </div>
      
      <div className="grid grid-cols-2 flex-1 overflow-hidden">
        <div className="border-r border-border py-4">
          <OrderBookSide
            levels={bidLevels}
            maxTotal={maxBidTotal}
            side="bid"
            baseCurrency={baseCurrency}
          />
        </div>
        
        <div className="py-4">
          <OrderBookSide
            levels={askLevels}
            maxTotal={maxAskTotal}
            side="ask"
            baseCurrency={baseCurrency}
          />
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <Spread 
          spread={spread} 
          lowestAsk={askLevels[0]?.price} 
          highestBid={bidLevels[0]?.price} 
        />
      </div>
    </div>
  );
});

OrderBook.displayName = 'OrderBook';

export default OrderBook;