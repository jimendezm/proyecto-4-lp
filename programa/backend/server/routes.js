import express from 'express';
import {
  crearPartida,
  actualizarEstadoPartida,
  actualizarGanador,
  obtenerPartidasDisponibles
} from '../controllers/partidaController.js';

import {
  agregarJugador,
  obtenerJugadores,
  actualizarPosicionJugador,
  asignarJugadorPartida
} from '../controllers/jugadorController.js';

const router = express.Router();

// Partidas
router.post('/partidas', crearPartida);
router.put('/partidas/:id/estado', actualizarEstadoPartida);
router.put('/partidas/:id/ganador', actualizarGanador);
router.get('/partidas/disponibles', obtenerPartidasDisponibles);

// Jugadores
router.post('/jugadores', agregarJugador);
router.get('/jugadores/:idPartida', obtenerJugadores);
router.put('/jugadores/:id/posicion', actualizarPosicionJugador);
router.post('/jugadores/asignar', asignarJugadorPartida);

export default router;
