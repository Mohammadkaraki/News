import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Article } from '@/types/api';

interface RealTimeUpdateEvent {
  type: 'NEW_ARTICLE';
  article: Article;
  timestamp: string;
}

interface UseRealTimeUpdatesOptions {
  onNewArticle?: (article: Article) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useRealTimeUpdates({
  onNewArticle,
  onError,
  enabled = true
}: UseRealTimeUpdatesOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!enabled) return;

    const connectSocket = () => {
      try {
        // Connect to WebSocket server
        const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
          transports: ['websocket', 'polling'],
          timeout: 10000,
          forceNew: true
        });

        socketRef.current = socket;

        socket.on('connect', () => {
          console.log('🔌 Connected to real-time updates');
          reconnectAttempts.current = 0;
        });

        socket.on('newArticle', (data: RealTimeUpdateEvent) => {
          console.log('📰 New article received:', data.article.title);
          if (onNewArticle) {
            onNewArticle(data.article);
          }
        });

        socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected from real-time updates:', reason);
          
          // Auto-reconnect for certain disconnect reasons
          if (reason === 'io server disconnect') {
            // Server initiated disconnect, try to reconnect
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              console.log(`🔄 Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
              setTimeout(connectSocket, 2000 * reconnectAttempts.current);
            }
          }
        });

        socket.on('connect_error', (error) => {
          console.warn('🔌 WebSocket connection error:', error.message);
          if (onError) {
            onError(new Error(`WebSocket connection failed: ${error.message}`));
          }
        });

        socket.on('error', (error) => {
          console.error('🔌 WebSocket error:', error);
          if (onError) {
            onError(new Error(`WebSocket error: ${error}`));
          }
        });

      } catch (error) {
        console.error('🔌 Failed to initialize WebSocket:', error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    connectSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log('🔌 Cleaning up WebSocket connection');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [enabled, onNewArticle, onError]);

  return {
    isConnected: socketRef.current?.connected || false,
    socket: socketRef.current
  };
} 