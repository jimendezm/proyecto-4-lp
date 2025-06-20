import { pool } from '../bd/connection.js';

export const crearPartida = async (req, res) => {
  const { identificador, tipo, pista, numVueltas, numJugadores } = req.body;
  try {
    await pool.query('CALL AgregarPartida(?, ?, ?, ?, ?)', [
      tipo, pista, numVueltas, numJugadores
    ]);
    res.status(201).json({ message: 'Partida creada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarEstadoPartida = async (req, res) => {
  const idPartida = req.params.id;
  const { estado } = req.body;
  try {
    await pool.query('CALL ActualizarEstadoPartida(?, ?)', [idPartida, estado]);
    res.json({ message: 'Estado actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizarGanador = async (req, res) => {
  const idPartida = req.params.id;
  const { nickname } = req.body;
  try {
    await pool.query('CALL ActualizarGanador(?, ?)', [idPartida, nickname]);
    res.json({ message: 'Ganador actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerPartidasDisponibles = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL ObtenerPartidasDisponibles()');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerUltimaPartida = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL ObtenerUltimaPartida()');
    res.json(rows[0][0]); // Devuelve solo el objeto de la última partida
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
