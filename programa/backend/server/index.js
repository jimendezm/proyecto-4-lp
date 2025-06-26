import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes.js'; // Rutas REST
import { setInterval } from 'timers';
import GameManager from '../models/gamemanager.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // Esto lo usás tanto para Express como para WebSocket

// WebSocket con CORS
const io = new Server(server, {
  cors: {
    origin: '*', 
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

// Almacenamos el estado de los jugadores por partida
const estadoJugadoresGlobal = {};

// WebSocket events
io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  // Unirse a una partida
  // Alguien se une a una partida
  socket.on('joinPartida', async ({ idPartida, idJugador, nickname }) => {
    const room = `partida_${idPartida}`;
    socket.join(room);
    console.log(`Jugador ${idJugador} se unió a ${room}`);

    const resPartidas = await fetch('http://localhost:3001/api/partidas/disponibles');
    const partidas = await resPartidas.json();
    const partida = partidas.find(p => p.id === idPartida);

    const gm = new GameManager();
    const foundGame = gm.findGame(idPartida);
    if (foundGame) {
      // If there's already a game with that id...
      foundGame.addPlayer(idJugador, nickname);
    } else {
      const newGame = gm.addGame(
        room,
        idPartida,
        partida.tipo,
        partida.pista,
        partida.numVueltas,
        partida.numJugadores
      );
      newGame.addPlayer(idJugador, nickname);
    }

    // Enviar el estado actual de los jugadores al nuevo jugador
    const estados = estadoJugadoresGlobal[idPartida] || {};
    socket.emit('actualizarEstadoJugadores', estados);

    // Notificar al resto que alguien nuevo se unió
    socket.to(room).emit('jugadorUnido', { idJugador });
  });

  // Jugador marca que está listo
  socket.on('jugadoresListos', ({ idPartida, jugadores }) => {
    const room = `partida_${idPartida}`;
    estadoJugadoresGlobal[idPartida] = jugadores;

    console.log(`Estados actualizados en ${room}:`, jugadores);

    // Notificar a todos el nuevo estado
    io.to(room).emit('actualizarEstadoJugadores', jugadores);

    // Verificar si todos están listos
    const todosListos = Object.values(jugadores).every(val => val === true);
    if (todosListos) {
      console.log(`Todos listos en ${room}`);

      const gm = new GameManager();
      const game = gm.findGame(idPartida);
      game.addPlayersToTrack();

      io.to(room).emit('todosListos');
      // Se da un segundo para que todos reciban el evento.
      setTimeout(() => {}, 1000);
      const intervalRef = setInterval(() => {
        io.to(room).emit('requestMoves');
      }, 500);
    }
  });

  socket.on('receiveMoves', ({ gameId, user, moves }) => {
    console.log(gameId, user, moves);
    const gm = new GameManager();
    const game = gm.findGame(gameId);

  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

// Exponer instancia de io 
export { io };

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
