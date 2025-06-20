// backend/server/index.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.js'; // Rutas REST

dotenv.config();

const app = express();
const server = http.createServer(app); // Esto lo usás tanto para Express como para WebSocket

// WebSocket con CORS
const io = new Server(server, {
  cors: {
    origin: '*', // en producción especificá el frontend
    methods: ['GET', 'POST']
  }
});

// Middleware global
app.use(cors());
app.use(express.json());

// Rutas REST
app.use('/api', router);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor Luiki Kart activo 🚀');
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  socket.on('movimiento', (data) => {
    console.log('Movimiento recibido:', data);
    socket.broadcast.emit('movimientoJugador', data);
  });

  // 🆕 Cuando alguien se une a una partida
  socket.on('joinPartida', ({ partidaId, jugadorId }) => {
    console.log(`Jugador ${jugadorId} se unió a la partida ${partidaId}`);
    
    // Podés usar "rooms" si más adelante querés enviar eventos a todos los jugadores de una misma partida
    socket.join(`partida-${partidaId}`);

    // Avisar a otros jugadores que alguien se unió (opcional)
    socket.to(`partida-${partidaId}`).emit('jugadorUnido', { jugadorId });
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});


// Exponer instancia de io si la necesitás en otros módulos
export { io };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
