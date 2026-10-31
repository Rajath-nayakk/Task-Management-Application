import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  statusText: string;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  statusText: 'DISCONNECTED',
});

import { SOCKET_ORIGIN } from '../api/client';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [statusText, setStatusText] = useState('DISCONNECTED');

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      setIsConnected(false);
      setStatusText('OFFLINE');
      return;
    }

    setStatusText('CONNECTING...');

    const s = io(SOCKET_ORIGIN, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    s.on('connect', () => {
      setIsConnected(true);
      setStatusText('CONNECTED (ONLINE)');
    });

    s.on('disconnect', (reason) => {
      setIsConnected(false);
      setStatusText(`DISCONNECTED (${reason})`);
    });

    s.on('connect_error', (err) => {
      setIsConnected(false);
      setStatusText(`ERROR (${err.message})`);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, statusText }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
