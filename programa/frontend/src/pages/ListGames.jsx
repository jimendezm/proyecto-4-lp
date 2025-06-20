import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from './SocketContext';

export default function ListGames() {
  const [partidas, setPartidas] = useState([]);
  const [jugadoresPorPartida, setJugadoresPorPartida] = useState({});
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const nickname = localStorage.getItem('nickname');
  const idJugador = localStorage.getItem('jugadorId');

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/partidas/disponibles');
        const data = await res.json();
        setPartidas(data);

        // Obtener cantidad de jugadores para cada partida
        const jugadoresMap = {};
        for (const partida of data) {
          const resJugadores = await fetch(`http://localhost:3001/api/jugadores/${partida.id}`);
          const jugadores = await resJugadores.json();
          jugadoresMap[partida.id] = jugadores.length;
        }
        setJugadoresPorPartida(jugadoresMap);

      } catch (err) {
        console.error('Error cargando partidas:', err);
      }
    };

    fetchPartidas();
  }, []);

  const handleJoin = async (idPartida) => {
    if (!nickname || !idJugador) {
      return alert('Faltan datos de sesión. Iniciá sesión nuevamente.');
    }

    try {
      // 1) Asignar jugador a la partida
      await fetch('http://localhost:3001/api/jugadores/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idJugador, idPartida })
      });

      // 2) Emitir por WebSocket (si aplica)
      socket.emit('joinPartida', { idPartida, idJugador });

      // 3) Redirigir al lobby
      navigate('/lobby', { state: { idPartida, idJugador, nickname } });

    } catch (err) {
      console.error('Error al unirse a la partida:', err);
      alert('No se pudo unir a la partida. Intentá de nuevo.');
    }
  };

  return (
    <div className="list-games-page" style={{ padding: '2rem', maxWidth: '700px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Partidas Disponibles</h2>

      {partidas.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No hay partidas disponibles por ahora.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {partidas.map((p) => (
            <li
              key={p.id}
              onClick={() => handleJoin(p.id)}
              style={{
                cursor: 'pointer',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f9f9f9',
                transition: '0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e6f7ff'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <strong>ID:</strong> {p.id} <br />
              <strong>Tipo:</strong> {p.tipo} <br />
              <strong>Pista:</strong> {p.pista} <br />
              <strong>Jugadores:</strong> {jugadoresPorPartida[p.id] || 0}/{p.numJugadores}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
