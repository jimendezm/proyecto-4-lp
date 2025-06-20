import { pool } from '../bd/connection.js';

export const agregarJugador = async (req, res) => {
  const { idPartida, nickname } = req.body;
  try {
    await pool.query('CALL AgregarJugador(?, ?)', [idPartida, nickname]);
    res.status(201).json({ message: 'Jugador agregado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerJugadores = async (req, res) => {
  const idPartida = req.params.idPartida;
  try {
    const [rows] = await pool.query('CALL ObtenerJugadoresPorPartida(?)', [idPartida]);
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarPosicionJugador = async (req, res) => {
  const idJugador = req.params.id;
  const { posicion } = req.body;
  try {
    await pool.query('CALL ActualizarPosicionJugador(?, ?)', [idJugador, posicion]);
    res.json({ message: 'Posición actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const asignarJugadorPartida = async (req, res) => {
  const { idJugador, idPartida } = req.body;
  try {
    await pool.query('CALL AsignarJugadorPartida(?, ?)', [idJugador, idPartida]);
    res.status(200).json({ message: 'Jugador asignado a partida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerUltimoJugador = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL ObtenerUltimoJugador()');
    res.json(rows[0][0]); // solo el jugador más reciente
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

