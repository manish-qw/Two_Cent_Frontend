'use client';

import { useState, useMemo } from 'react';
import { TradingPair } from '@/types/binance';
import { useBinanceSocket } from '@/hooks/useBinanceSocket';
import { useOrderBook } from '@/hooks/useOrderBook';
import { useRecentTrades } from '@/hooks/useRecentTrades';
import OrderBook from '@/components/OrderBook/OrderBook';
import RecentTrades from '@/components/RecentTrades/RecentTrades';
import PairSelector from '@/components/TradingPair/PairSelector';
import { formatPrice, formatPercent } from '@/utils/formatters';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState<TradingPair>('BTCUSDT');
  const baseCurrency = selectedPair.replace('USDT', '');
  const { isConnected, lastTrade, lastDepthUpdate, error } = useBinanceSocket(selectedPair);
  const { bids, asks, spread } = useOrderBook(lastDepthUpdate);
  const { trades } = useRecentTrades(lastTrade);

  const lastPrice = useMemo(() => {
    if (trades && trades.length > 0) {
      return trades[0].price;
    }
    if (bids && asks && bids.length > 0 && asks.length > 0) {
      return (bids[0].price + asks[0].price) / 2;
    }
    return 0;
  }, [trades, bids, asks]);

  const priceChange = useMemo(() => {
    if (!trades || trades.length < 10) return 0;
    const oldPrice = trades[trades.length - 1].price;
    const newPrice = trades[0].price;
    return (newPrice - oldPrice) / oldPrice;
  }, [trades]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-panel border-b border-border">
        <div className="max-w-[1920px] mx-auto px-6" style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
          <div className="flex justify-between items-center w-full">
            {/* Left side */}
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-green-primary">OrderBook Pro</h1>
              <div className="flex items-center gap-3">
                <PairSelector currentPair={selectedPair} onPairChange={setSelectedPair} />
                <div className="flex items-center gap-1">
                  <div 
                    className={`w-2 h-2 rounded-full ${error ? 'bg-red-primary' : 'bg-green-primary animate-pulse'}`}
                  />
                  <span className="text-xs text-text-muted">
                    {error ? 'Disconnected' : 'Live'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-text-dark">Last Price</div>
                <div className="font-bold text-green-primary" style={{ fontSize: '28px' }}>
                  ${lastPrice > 0 ? formatPrice(lastPrice) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-dark">24h Change</div>
                <div 
                  className={`font-semibold ${priceChange >= 0 ? 'text-green-primary' : 'text-red-primary'}`} 
                  style={{ fontSize: '18px' }}
                >
                  {formatPercent(priceChange * 100)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Toast - Fixed Position */}
      {error && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="bg-red-primary/20 border border-red-primary rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-primary animate-pulse"></div>
              <p className="text-red-primary text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Book - Takes 2 columns */}
          <div className="lg:col-span-2">

            <OrderBook
              bidLevels={bids || []}
              askLevels={asks || []}
              spread={spread}
              baseCurrency={baseCurrency}
            />
          </div>

          {/* Recent Trades - Takes 1 column */}
          <div className="lg:col-span-1">
            <RecentTrades trades={trades || []} baseCurrency={baseCurrency} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1920px] mx-auto">
        <div className="px-6 py-2" style={{ minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-center text-xs text-text-dark">
            Real-time data from Binance WebSocket API | Updates every millisecond
          </p>
        </div>
      </footer>
    </div>
  );
}
