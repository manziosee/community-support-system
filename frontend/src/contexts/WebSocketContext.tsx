import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error' | 'unsupported';

interface WSMessage {
  type: 'NOTIFICATION' | 'STATUS_UPDATE' | 'ASSIGNMENT_UPDATE' | 'REQUEST_UPDATE' | 'PING';
  payload: any;
  timestamp: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: ConnectionStatus;
  lastMessage: WSMessage | null;
  onlineVolunteers: Set<number>;
  sendMessage: (message: any) => void;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
};

function getWsUrl(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://community-support-system.fly.dev/api';
  const wsBase = apiBase.replace(/^https?/, (p) => (p === 'https' ? 'wss' : 'ws')).replace('/api', '');
  return `${wsBase}/ws/notifications`;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 3000;

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const mountedRef = useRef(true);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [onlineVolunteers, setOnlineVolunteers] = useState<Set<number>>(new Set());

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const handleMessage = useCallback((raw: string) => {
    try {
      const msg: WSMessage = JSON.parse(raw);
      setLastMessage(msg);

      if (msg.type === 'NOTIFICATION' && msg.payload?.message) {
        toast.custom(
          (t) => (
            <div
              className={`flex items-start gap-3 bg-white dark:bg-slate-800 border border-primary-100 dark:border-primary-700/40 rounded-2xl shadow-soft-lg px-4 py-3 max-w-sm transition-all ${t.visible ? 'animate-slide-up' : 'opacity-0'}`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">New Notification</p>
                <p className="text-xs text-neutral-500 dark:text-slate-400 mt-0.5 leading-relaxed">{msg.payload.message}</p>
              </div>
            </div>
          ),
          { duration: 5000 }
        );
      }

      if (msg.type === 'STATUS_UPDATE' && msg.payload?.userId && msg.payload?.status) {
        setOnlineVolunteers((prev) => {
          const next = new Set(prev);
          if (msg.payload.status === 'ONLINE') {
            next.add(msg.payload.userId);
          } else {
            next.delete(msg.payload.userId);
          }
          return next;
        });
      }
    } catch {
      // Non-JSON message, ignore
    }
  }, []);

  const connect = useCallback(() => {
    if (!user || !token || !mountedRef.current) return;

    try {
      const url = `${getWsUrl()}?token=${encodeURIComponent(token)}&userId=${user.userId}`;
      setConnectionStatus('connecting');

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) { ws.close(); return; }
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        // Send heartbeat every 30s
        const heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING', timestamp: new Date().toISOString() }));
          } else {
            clearInterval(heartbeat);
          }
        }, 30000);
      };

      ws.onmessage = (event) => handleMessage(event.data);

      ws.onerror = () => {
        if (!mountedRef.current) return;
        setConnectionStatus('error');
      };

      ws.onclose = (event) => {
        if (!mountedRef.current) return;
        setConnectionStatus('disconnected');
        wsRef.current = null;

        // Auto-reconnect unless normal close
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          reconnectTimerRef.current = window.setTimeout(() => {
            if (mountedRef.current) connect();
          }, RECONNECT_DELAY_MS * reconnectAttemptsRef.current);
        }
      };
    } catch {
      // WebSocket not supported or blocked
      setConnectionStatus('unsupported');
    }
  }, [user, token, handleMessage]);

  useEffect(() => {
    mountedRef.current = true;
    connect();
    return () => {
      mountedRef.current = false;
      clearReconnectTimer();
      wsRef.current?.close(1000);
      wsRef.current = null;
    };
  }, [connect]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const reconnect = useCallback(() => {
    clearReconnectTimer();
    wsRef.current?.close();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected: connectionStatus === 'connected',
        connectionStatus,
        lastMessage,
        onlineVolunteers,
        sendMessage,
        reconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
