import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { SocketContext } from './SocketContext';
import '../styles/ListGames.css';

export default function ListGames() {
  const [partidas, setPartidas] = useState([]);
  const [jugadoresPorPartida, setJugadoresPorPartida] = useState({});
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { state } = useLocation();

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

  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
      confirmButtonColor: '#d33'
    });
  };

  const handleJoin = async (idPartida) => {
    if (!nickname || !idJugador) {
      return mostrarError('Faltan datos de sesión. Iniciá sesión nuevamente.');
    }

    try {
      const resJugadores = await fetch(`http://localhost:3001/api/jugadores/${idPartida}`);
      const jugadores = await resJugadores.json();

      const partida = partidas.find(p => p.id === idPartida);
      if (!partida) {
        return mostrarError('No se encontró la partida seleccionada.');
      }

      if (jugadores.length >= partida.numJugadores) {
        return mostrarError('La partida ya alcanzó el número máximo de jugadores.');
      }

      await fetch('http://localhost:3001/api/jugadores/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idJugador, idPartida })
      });

      socket.emit("joinPartida", { idPartida, idJugador, nickname });

      navigate('/lobby', { state: { idPartida, idJugador, nickname } });
    } catch (err) {
      console.error('Error al unirse a la partida:', err);
      mostrarError('No se pudo unir a la partida. Intentá de nuevo.');
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
