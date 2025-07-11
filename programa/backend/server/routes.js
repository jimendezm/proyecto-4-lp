import express from 'express';
import {
  crearPartida,
  actualizarEstadoPartida,
  actualizarGanador,
  obtenerPartidasDisponibles,
  obtenerPartidas,
  obtenerUltimaPartida,
  obtenerEstadisticas,
  obtenerRanking
} from '../controllers/partidaController.js';

import {
  agregarJugador,
  obtenerJugadores,
  actualizarPosicionJugador,
  asignarJugadorPartida,
  obtenerUltimoJugador
} from '../controllers/jugadorController.js';

const router = express.Router();

// Partidas
router.post('/partidas', crearPartida);
router.put('/partidas/:id/estado', actualizarEstadoPartida);
router.put('/partidas/:id/ganador', actualizarGanador);
router.get('/partidas/disponibles', obtenerPartidasDisponibles);
router.get('/partidas/juego', obtenerPartidas);
router.get('/partidas/ultima', obtenerUltimaPartida);
router.get('/partidas/estadisticas', obtenerEstadisticas);
router.get('/partidas/ranking', obtenerRanking);

// Jugadores
router.post('/jugadores', agregarJugador);
router.get('/jugadores/:idPartida', obtenerJugadores);
router.put('/jugadores/:id/posicion', actualizarPosicionJugador);
router.post('/jugadores/asignar', asignarJugadorPartida);
router.get('/jugadores/obtener/ultimo', obtenerUltimoJugador);

export default router;
