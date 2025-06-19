// src/App.jsx
import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SocketContext } from './pages/SocketContext';
import { io } from 'socket.io-client';
import { Router } from './routes/router';

function App() {
  // Memoizar para no reconectar en cada render
  const socket = useMemo(() => io('http://localhost:3001'), []);

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
