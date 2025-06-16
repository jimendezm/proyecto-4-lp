import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function App() {
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_BACKEND_URL);

    socket.current.on('connect', () => {
      console.log('Conectado con ID:', socket.current.id);
    });

    socket.current.on('disconnect', () => {
      console.log('Desconectado');
    });

    socket.current.on('connect_error', (err) => {
      console.error('Error de conexión:', err.message);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Luiki Kart</h1>
    </div>
  );
}

export default App;
