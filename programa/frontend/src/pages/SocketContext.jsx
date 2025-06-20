// src/pages/SocketContext.jsx
import React, { createContext } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const socket = io('');

export const SocketProvider = ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
