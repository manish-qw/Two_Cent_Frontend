'use client';

import React, { memo } from 'react';
import TradeRow from './TradeRow';
import { Trade } from '@/hooks/useRecentTrades';

interface RecentTradesProps {
  trades: Trade[];
  baseCurrency?: string;
}

const RecentTrades: React.FC<RecentTradesProps> = memo(({ trades, baseCurrency = 'BTC' }) => {
  return (
    <div className="bg-panel border border-border rounded-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 155px)' }}>
      <div className="px-4 py-4 border-b border-border flex-shrink-0">
        <h2 className="text-lg font-semibold text-text">Recent Trades</h2>
      </div>

      <div className="px-4 py-4 flex flex-col flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-2 text-xs text-text-dark mb-3 pb-2 border-b border-border flex-shrink-0">
          <div>Price (USDT)</div>
          <div className="text-right">Amount ({baseCurrency})</div>
          <div className="text-right">Time</div>
        </div>

        <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pb-8">
          {trades.length === 0 ? (
            <div className="text-center text-text-muted py-8">
              Waiting for trades...
            </div>
          ) : (
            trades.map((trade) => (
              <TradeRow key={`${trade.id}-${trade.time}`} trade={trade} />
            ))
          )}
        </div>
      </div>
    </div>
  );
});

RecentTrades.displayName = 'RecentTrades';

export default RecentTrades;
