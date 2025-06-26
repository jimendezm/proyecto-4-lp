import { pool } from '../bd/connection.js';

export const crearPartida = async (req, res) => {
  const { tipo, pista, numVueltas, numJugadores } = req.body;
  try {
    await pool.query('CALL AgregarPartida(?, ?, ?, ?)', [
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

// en espera
export const obtenerPartidasDisponibles = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL ObtenerPartidasDisponibles()');
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// en proceso
export const obtenerPartidas = async (req, res) => {
  try {
    const [rows] = await pool.query('CALL ObtenerPartidas()');
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

export const obtenerEstadisticas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS idPartida,
        p.pista AS pista,
        jp.nickname AS nickname,
        jp.posicion
      FROM Partida p
      JOIN Jugador jp ON p.id = jp.idPartida
      WHERE p.estado = 'finalizada'
      ORDER BY p.id, jp.posicion ASC
    `);

    // Agrupar por partida
    const partidas = {};
    for (const row of rows) {
      const { idPartida, pista, nickname, posicion } = row;
      if (!partidas[idPartida]) {
        partidas[idPartida] = {
          id: idPartida,
          pista,
          jugadores: []
        };
      }
      partidas[idPartida].jugadores.push({ nickname, posicion });
    }

    res.json(Object.values(partidas));
  } catch (err) {
    console.error('Error al obtener estadísticas:', err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

export const obtenerRanking = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        p.id AS idPartida,
        p.pista,
        p.numVueltas,
        p.tiempo,
        j.nickname AS ganador
      FROM Partida p
      JOIN Jugador j ON p.id = j.idPartida AND j.posicion = 1
      WHERE p.estado = 'finalizada'
      ORDER BY p.tiempo ASC
    `);
    res.json(result);
  } catch (err) {
    console.error('Error al obtener ranking:', err);
    res.status(500).json({ error: 'Error al obtener ranking de partidas.' });
  }
};

