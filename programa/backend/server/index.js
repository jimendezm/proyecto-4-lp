import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // ← Esto carga las variables del archivo .env

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // en producción usá la URL del frontend
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());

// Ruta simple para probar conexión
app.get('/', (req, res) => {
  res.send('Servidor Luiki Kart activo 🚀');
});

// WebSocket básico
io.on('connection', (socket) => {
  console.log('Jugador conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

// Puerto desde .env
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
