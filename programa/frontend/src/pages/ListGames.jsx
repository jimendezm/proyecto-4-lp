import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SocketContext } from './SocketContext';
import '../styles/ListGames.css';

export default function ListGames() {
  const [partidas, setPartidas] = useState([]);
  const [jugadoresPorPartida, setJugadoresPorPartida] = useState({});
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { state } = useLocation();

  // Desestructuramos nickname e idJugador
  const { nickname, idJugador } = state || {};

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/partidas/disponibles');
        const data = await res.json();
        setPartidas(data);

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
    console.log('Unirse a la partida: ' + idPartida + ' con jugador: ' + idJugador);
    if (!nickname || !idJugador) {
      return alert('Faltan datos de sesión. Iniciá sesión nuevamente.');
    }

    try {
      await fetch('http://localhost:3001/api/jugadores/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idJugador, idPartida })
      });
      socket.emit("joinPartida", { idPartida, idJugador });

      navigate('/lobby', { state: { idPartida, idJugador, nickname } });
    } catch (err) {
      console.error('Error al unirse a la partida:', err);
      alert('No se pudo unir a la partida. Intentá de nuevo.');
    }
  };

  return (
    <div className="list-games-page">
      <h2>Partidas Disponibles</h2>

      {partidas.length === 0 ? (
        <p className="no-games">No hay partidas disponibles por ahora.</p>
      ) : (
        <ul className="games-list">
          {partidas.map((p) => (
            <li
              key={p.id}
              className="game-item"
              onClick={() => handleJoin(p.id)}
            >
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Tipo:</strong> {p.tipo}</p>
              <p><strong>Pista:</strong> {p.pista}</p>
              <p><strong>Jugadores:</strong> {jugadoresPorPartida[p.id] || 0}/{p.numJugadores}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
