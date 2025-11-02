'use client';

import React, { memo } from 'react';
import { formatPrice, formatAmount } from '@/utils/formatters';

interface OrderBookRowProps {
  price: number;
  amount: number;
  total: number;
  depthPercentage: number;
  side: 'bid' | 'ask';
}

const OrderBookRow: React.FC<OrderBookRowProps> = memo(({
  price,
  amount,
  total,
  depthPercentage,
  side,
}) => {
  const isBid = side === 'bid';
  
  return (
    <div className="relative grid grid-cols-3 gap-2 text-xs py-1.5 cursor-pointer hover:bg-border/50 transition-colors duration-150 ease-in-out">
      {/* Depth bar */}
      <div
        className={`absolute top-0 bottom-0 ${
          isBid
            ? 'right-0 bg-gradient-to-l from-green-primary/15 to-transparent'
            : 'left-0 bg-gradient-to-r from-red-primary/15 to-transparent'
        }`}
        style={{ width: `${depthPercentage}%` }}
      />
      
      {/* Content */}
      <div className={`relative z-10 ${isBid ? 'text-right' : 'text-left'} ${
        isBid ? 'text-green-primary' : 'text-red-primary'
      } font-medium`}>
        {formatPrice(price)}
      </div>
      <div className="relative z-10 text-right text-text-secondary">
        {formatAmount(amount)}
      </div>
      <div className="relative z-10 text-right text-text-muted">
        {formatAmount(total, 3)}
      </div>
    </div>
  );
});

OrderBookRow.displayName = 'OrderBookRow';

export default OrderBookRow;
