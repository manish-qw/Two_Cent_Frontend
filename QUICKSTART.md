# 🚀 Quick Start Guide

Get your real-time order book visualizer running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript 5.3
- TailwindCSS 3.3
- All necessary type definitions

## Step 2: Start Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

## Step 3: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) and you'll see:

✅ Live order book with real-time updates  
✅ Recent trades streaming from Binance  
✅ Connection status indicator (green pulsing dot)  
✅ Default pair: BTC/USDT

## What You'll See

### Header
- **OrderBook Pro** logo
- Trading pair selector (BTC/USDT, ETH/USDT, BNB/USDT)
- Live connection indicator
- Last price display
- 24h change percentage

### Main Content
- **Left Panel (66%)**: Order Book
  - Bids (green) on left side
  - Asks (red) on right side
  - Depth visualization bars
  - Spread display at bottom

- **Right Panel (33%)**: Recent Trades
  - 50 most recent trades
  - Flash animations (green for buys, red for sells)
  - Scrollable list

### Footer
- Data source information

## Features to Try

1. **Switch Trading Pairs**: Use dropdown to switch between BTC/USDT, ETH/USDT, BNB/USDT
2. **Watch Live Updates**: Order book and trades update in real-time
3. **See Flash Animations**: New trades flash briefly when they appear
4. **Check Depth Bars**: Background bars show cumulative order depth
5. **Test Responsive Design**: Resize browser to see mobile/tablet layout

## Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy automatically

Your live URL will be ready in ~2 minutes!

## Troubleshooting

**No data showing?**
- Check browser console for errors
- Verify you're connected (green dot should be pulsing)
- Try switching trading pairs

**Slow performance?**
- Close browser DevTools (significant impact)
- Check if other tabs are using high CPU
- Ensure you're on a modern browser (Chrome, Firefox, Edge)

**Connection issues?**
- Check internet connection
- Verify Binance API is accessible in your region
- Look for "Disconnected" status in header

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [DESIGN_COMPLIANCE.md](./DESIGN_COMPLIANCE.md) for design specs
- Review code structure in `src/` folder

## Key Files

```
src/
├── app/page.tsx              # Main application
├── hooks/
│   ├── useBinanceSocket.ts   # WebSocket connection
│   ├── useOrderBook.ts       # Order book state
│   └── useRecentTrades.ts    # Trades state
└── components/
    ├── OrderBook/            # Order book components
    └── RecentTrades/         # Trades components
```

Happy trading! 📈
