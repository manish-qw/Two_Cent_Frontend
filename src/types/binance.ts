// types/binance.ts

export type TradingPair = 'BTCUSDT' | 'ETHUSDT' | 'BNBUSDT';

// Aggregate Trade Stream Event
// Stream: <symbol>@aggTrade
export interface BinanceTradeEvent {
  e: 'aggTrade';        // Event type
  E: number;            // Event time
  s: string;            // Symbol
  a: number;            // Aggregate trade ID
  p: string;            // Price
  q: string;            // Quantity
  f: number;            // First trade ID
  l: number;            // Last trade ID
  T: number;            // Trade time
  m: boolean;           // Is the buyer the market maker? (true = sell, false = buy)
  M: boolean;           // Ignore
}

// Diff. Depth Stream Event
// Stream: <symbol>@depth OR <symbol>@depth@100ms
export interface BinanceDepthUpdate {
  e: 'depthUpdate';     // Event type
  E: number;            // Event time
  s: string;            // Symbol
  U: number;            // First update ID in event
  u: number;            // Final update ID in event
  b: [string, string][]; // Bids to be updated [price, quantity]
  a: [string, string][]; // Asks to be updated [price, quantity]
}

// Combined stream wrapper
export interface BinanceCombinedStreamData {
  stream: string;
  data: BinanceTradeEvent | BinanceDepthUpdate;
}