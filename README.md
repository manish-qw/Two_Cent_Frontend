# OrderBook Pro - Real-Time Order Book Visualizer

A high-performance, real-time stock order book visualizer built with Next.js, TypeScript, and TailwindCSS, streaming live market data from the Binance WebSocket API.

## Design Compliance

This application **fully implements** the comprehensive design specification including:
- Exact color palette (#0a0a0f, #111827, #10b981, #ef4444, etc.)
- Precise typography (Courier New monospace, exact font sizes: 28px, 18px, 14px, 12px)
- Pixel-perfect spacing (24px gaps, 16px padding, 80px header, 50px footer)
- Correct responsive breakpoints (1024px, 768px)
- Proper depth bar gradients (15% opacity, correct directions)
- 150ms transitions on all interactive elements
- Flash animations (500ms green/red for trades)
- 2:1 desktop layout ratio

See [DESIGN_COMPLIANCE.md](./DESIGN_COMPLIANCE.md) for complete specification checklist.

## Features

- **Real-Time WebSocket Integration**: Live streaming of order book depth and trade data from Binance
- **High-Performance State Management**: Efficient state updates using `useReducer` with O(1) price level updates
- **Optimized Rendering**: Memoized components and calculations to prevent unnecessary re-renders
- **Visual Depth Chart**: Dynamic background bars showing cumulative order book depth
- **Live Trade Feed**: 50 most recent trades with flash animations for buy/sell indicators
- **Multi-Pair Support**: Switch between BTC/USDT, ETH/USDT, and BNB/USDT
- **Responsive Design**: Professional UI that works on desktop and mobile
- **Auto-Reconnection**: Automatic WebSocket reconnection with exponential backoff

## Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Run the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

The app will automatically connect to the Binance WebSocket API and start streaming live data.

## Project Structure

```
order-book-visualizer/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main page component
│   │   └── globals.css         # Global styles & Tailwind imports
│   ├── components/
│   │   ├── OrderBook/
│   │   │   ├── OrderBook.tsx           # Main order book container
│   │   │   ├── OrderBookSide.tsx       # Bid/Ask side component
│   │   │   ├── OrderBookRow.tsx        # Individual price level row
│   │   │   └── Spread.tsx              # Spread display
│   │   ├── RecentTrades/
│   │   │   ├── RecentTrades.tsx        # Recent trades list
│   │   │   └── TradeRow.tsx            # Individual trade row
│   │   └── TradingPair/
│   │       └── PairSelector.tsx        # Trading pair dropdown
│   ├── hooks/
│   │   ├── useBinanceSocket.ts         # WebSocket connection manager
│   │   ├── useOrderBook.ts             # Order book state with useReducer
│   │   └── useRecentTrades.ts          # Recent trades state
│   ├── types/
│   │   └── binance.ts                  # TypeScript interfaces
│   └── utils/
│       ├── orderBookHelpers.ts         # Sorting & calculation helpers
│       └── formatters.ts               # Number formatting utilities
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Technical Architecture

### State Management (useReducer)

The order book uses `useReducer` for predictable, high-performance state updates:

```typescript
// Order book reducer handles depth updates efficiently
const orderBookReducer = (state: OrderBookState, action: OrderBookAction) => {
  // O(1) price level updates using Map data structure
  // Automatic removal of zero-quantity levels
  // Memory-efficient with automatic trimming
}
```

**Why useReducer?**
- Predictable state transitions for complex updates
- Efficient batching of multiple price level changes
- Easy to test and debug
- Better performance than multiple useState calls

### WebSocket Architecture

The `useBinanceSocket` hook manages dual WebSocket connections:

1. **Aggregate Trade Stream** (`@aggTrade`): Real-time completed trades
2. **Depth Update Stream** (`@depth@100ms`): Order book updates every 100ms

**Features**:
- Automatic reconnection with exponential backoff
- Connection state monitoring
- Error handling and recovery
- Clean disconnection on component unmount

### Performance Optimizations

1. **Memoization**:
   - `React.memo` on all child components
   - `useMemo` for sorted order book levels
   - `useCallback` for event handlers

2. **Efficient Data Structures**:
   - `Map` for O(1) price level lookups and updates
   - Pre-sorted arrays for rendering
   - Minimal array operations

3. **Render Optimization**:
   - Only re-render changed components
   - Virtualization-ready structure
   - Batched state updates

4. **Trade Flash Animation**:
   - CSS animations instead of JavaScript
   - Automatic cleanup after 500ms

## API Integration

### Binance WebSocket Endpoints

The application connects to these Binance WebSocket streams:

- **Aggregate Trades**: `wss://stream.binance.com:9443/ws/{symbol}@aggTrade`
- **Order Book Depth**: `wss://stream.binance.com:9443/ws/{symbol}@depth@100ms`

Where `{symbol}` is lowercase, e.g., `btcusdt`, `ethusdt`, `bnbusdt`.

### Data Processing

**Trade Events**:
```typescript
{
  e: "aggTrade",     // Event type
  p: "70234.50",     // Price
  q: "0.5234",       // Quantity
  m: false,          // Is buyer market maker (false = buy)
  T: 1636502825000   // Trade timestamp
}
```

**Depth Updates**:
```typescript
{
  e: "depthUpdate",
  b: [               // Bids to update
    ["70234.50", "0.5234"],  // [price, quantity]
    ["70233.00", "0.0000"]   // 0 quantity = remove
  ],
  a: [               // Asks to update
    ["70235.00", "0.4321"],
    ["70236.00", "0.0000"]
  ]
}
```

## Design Choices

### Why Next.js?
- Server-side rendering capabilities for production
- Built-in routing and API routes (extensible)
- Excellent TypeScript support
- Optimized bundling and code splitting

### Why TailwindCSS?
- Utility-first approach for rapid UI development
- Consistent design system
- Small bundle size with purging
- Easy responsive design

### Why Client-Side WebSockets?
- Real-time data requires persistent connections
- Lower latency than polling
- Efficient bandwidth usage
- Better user experience

## Key Calculations

### Spread Calculation
```typescript
spread = lowestAsk - highestBid
spreadPercent = (spread / midPrice) * 100
```

### Cumulative Total
Each row shows the cumulative sum from the best price:
- **Bids**: Sum from highest to current price
- **Asks**: Sum from lowest to current price

### Depth Visualization
Background bar width is proportional to cumulative total:
```typescript
depthPercentage = (rowTotal / maxTotal) * 100
```

## Testing the Application

### Manual Testing

1. **Order Book Updates**:
   - Verify prices update in real-time
   - Check bid/ask sorting (descending/ascending)
   - Confirm depth bars scale correctly

2. **Recent Trades**:
   - Watch for flash animations on new trades
   - Verify buy/sell color coding (green/red)
   - Check trade list maintains 50 max items

3. **Pair Switching**:
   - Switch between trading pairs
   - Verify WebSocket reconnection
   - Confirm data clears and repopulates

4. **Connection Resilience**:
   - Test with network disconnection
   - Verify auto-reconnection attempts
   - Check error message display

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Vercel auto-detects Next.js configuration
4. Deploy with one click

**Live Demo**: Deploy to get your live URL

### Deploy to Netlify

```bash
npm run build
```

Upload the `.next` folder or connect your Git repository.

## Environment Variables

Currently no environment variables are required. All endpoints are hardcoded to Binance public WebSocket API.

For production with API keys (e.g., private order streams):
```env
NEXT_PUBLIC_WS_ENDPOINT=wss://stream.binance.com:9443/ws
```

## Troubleshooting

### WebSocket Connection Issues

**Problem**: "WebSocket connection error"
**Solution**: 
- Check internet connection
- Verify Binance API is not blocked by firewall/ISP
- Clear browser cache

### No Data Showing

**Problem**: Order book or trades not displaying
**Solution**:
- Check browser console for errors
- Verify WebSocket connection status (green "Live" indicator)
- Try switching trading pairs

### Performance Issues

**Problem**: Lag or stuttering
**Solution**:
- Close browser dev tools (significant performance impact)
- Check CPU usage
- Reduce number of visible price levels (modify `MAX_LEVELS` in hooks)

## License

This project is for educational purposes as part of a frontend engineering assignment.

## Author

Created for the Two-Cent Frontend Engineering Assignment

---

## Acknowledgments

- Binance for providing public WebSocket API
- Next.js team for excellent documentation
- TailwindCSS for the utility-first CSS framework

## Support

For questions or issues, please refer to:
- [Binance API Documentation](https://binance-docs.github.io/apidocs/spot/en/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
