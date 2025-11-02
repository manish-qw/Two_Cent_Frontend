// hooks/useBinanceSocket.ts
'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { BinanceTradeEvent, BinanceDepthUpdate, TradingPair, BinanceCombinedStreamData } from '@/types/binance';

interface UseBinanceSocketReturn {
  isConnected: boolean;
  lastTrade: BinanceTradeEvent | null;
  lastDepthUpdate: BinanceDepthUpdate | null;
  error: string | null;
}

export const useBinanceSocket = (pair: TradingPair): UseBinanceSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastTrade, setLastTrade] = useState<BinanceTradeEvent | null>(null);
  const [lastDepthUpdate, setLastDepthUpdate] = useState<BinanceDepthUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wsTradeRef = useRef<WebSocket | null>(null);
  const wsDepthRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const tradeConnectedRef = useRef(false);
  const depthConnectedRef = useRef(false);
  const isSwitchingPairRef = useRef(false);
  
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;

  const connectWebSockets = useCallback(() => {
    try {
      // Mark that we're switching pairs (intentional disconnect)
      isSwitchingPairRef.current = true;
      
      // Close old connections if they exist
      if (wsTradeRef.current) {
        wsTradeRef.current.close();
      }
      if (wsDepthRef.current) {
        wsDepthRef.current.close();
      }
      
      // Reset connection state
      tradeConnectedRef.current = false;
      depthConnectedRef.current = false;
      
      const symbol = pair.toLowerCase();
      
      // Try without port specification - works better with some firewalls
      const tradeUrl = `wss://stream.binance.com/ws/${symbol}@aggTrade`;
      const depthUrl = `wss://stream.binance.com/ws/${symbol}@depth@100ms`;
      
      const tradeWs = new WebSocket(tradeUrl);
      
      tradeWs.onopen = () => {
        tradeConnectedRef.current = true;
        setError(null);
        reconnectAttemptsRef.current = 0;
        if (depthConnectedRef.current) {
          isSwitchingPairRef.current = false;
          setIsConnected(true);
        }
      };
      
      tradeWs.onmessage = (event: MessageEvent) => {
        try {
          const data: BinanceTradeEvent = JSON.parse(event.data);
          if (data.e === 'aggTrade') {
            setLastTrade(data);
          }
        } catch (err) {}
      };
      
      tradeWs.onerror = () => {
        setError('Connection error');
      };
      
      tradeWs.onclose = () => {
        tradeConnectedRef.current = false;
        if (!isSwitchingPairRef.current) {
          setIsConnected(false);
        }
      };
      
      // Depth WebSocket
      const depthWs = new WebSocket(depthUrl);
      
      depthWs.onopen = () => {
        depthConnectedRef.current = true;
        if (tradeConnectedRef.current) {
          isSwitchingPairRef.current = false;
          setIsConnected(true);
        }
      };
      
      depthWs.onmessage = (event: MessageEvent) => {
        try {
          const data: BinanceDepthUpdate = JSON.parse(event.data);
          if (data.e === 'depthUpdate') {
            setLastDepthUpdate(data);
          }
        } catch (err) {}
      };
      
      depthWs.onerror = () => {};
      
      depthWs.onclose = () => {
        depthConnectedRef.current = false;
        if (!isSwitchingPairRef.current) {
          setIsConnected(false);
        }
      };
      
      wsTradeRef.current = tradeWs;
      wsDepthRef.current = depthWs;
    } catch (err) {
      setError('Failed to connect');
    }
  }, [pair]);

  useEffect(() => {
    connectWebSockets();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (wsTradeRef.current) {
        if (wsTradeRef.current.readyState <= WebSocket.OPEN) {
          wsTradeRef.current.close();
        }
      }
      
      if (wsDepthRef.current) {
        if (wsDepthRef.current.readyState <= WebSocket.OPEN) {
          wsDepthRef.current.close();
        }
      }
    };
  }, [connectWebSockets]);

  return {
    isConnected,
    lastTrade,
    lastDepthUpdate,
    error,
  };
};