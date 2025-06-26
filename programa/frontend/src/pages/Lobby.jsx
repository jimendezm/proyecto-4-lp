import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SocketContext } from './SocketContext';
import Swal from 'sweetalert2';
import '../styles/Lobby.css';

export default function Lobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useContext(SocketContext);
  const { idPartida, idJugador, nickname } = location.state || {};

  const [jugadores, setJugadores] = useState([]);
  const [estadoJugadores, setEstadoJugadores] = useState({});
  const [numJugadoresRequeridos, setNumJugadoresRequeridos] = useState(null);

  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Atención',
      text: mensaje,
      confirmButtonColor: '#d33'
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener jugadores actuales
        const resJugadores = await fetch(`http://localhost:3001/api/jugadores/${idPartida}`);
        const dataJugadores = await resJugadores.json();
        setJugadores(dataJugadores);

        // 2. Inicializar estado de jugadores si es la primera vez
        setEstadoJugadores(prev => {
          if (Object.keys(prev).length === 0) {
            const inicial = {};
            dataJugadores.forEach(j => inicial[j.id] = false);
            return inicial;
          }
          return prev;
        });

        // 3. Obtener las partidas disponibles y encontrar esta partida
        const resPartidas = await fetch('http://localhost:3001/api/partidas/disponibles');
        const partidas = await resPartidas.json();
        const partidaActual = partidas.find(p => p.id === idPartida);

        if (partidaActual) {
          setNumJugadoresRequeridos(partidaActual.numJugadores);
        } else {
          mostrarError('No se encontró la partida en la lista de disponibles.');
        }
      } catch (err) {
        console.error('Error al obtener datos del lobby:', err);
      }
    };

    fetchData();
    // socket.emit('joinPartida', { idPartida, idJugador });

    socket.on('jugadorUnido', async ({ idJugador: nuevo }) => {
      try {
        const res = await fetch(`http://localhost:3001/api/jugadores/${idPartida}`);
        const data = await res.json();
        setJugadores(data);
        setEstadoJugadores(prev => {
          const nuevosEstados = { ...prev };
          data.forEach(j => {
            if (!(j.id in nuevosEstados)) {
              nuevosEstados[j.id] = false;
            }
          });
          return nuevosEstados;
        });
      } catch (err) {
        console.error('Error al actualizar lista de jugadores:', err);
      }
    });

    socket.on('actualizarEstadoJugadores', (nuevosEstados) => {
      setEstadoJugadores(nuevosEstados);
    });

    socket.on('todosListos', async () => {
      if (jugadores.length < numJugadoresRequeridos) {
        mostrarError(`Aún faltan jugadores. Se requieren ${numJugadoresRequeridos}. Actualmente hay ${jugadores.length}.`);
      } else {
        try {
          // Actualiza estado de la partida
          await fetch(`http://localhost:3001/api/partidas/${idPartida}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'en_proceso' })
          });

          // Luego navega al juego
          Swal.fire({
            icon: 'success',
            title: '¡Todos listos!',
            text: 'La partida va a comenzar.',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            navigate('/game', { state: { idPartida, jugadores, idJugador } });
          });
        } catch (err) {
          console.error('Error al actualizar estado de la partida:', err);
          mostrarError('No se pudo iniciar la partida. Intenta de nuevo.');
        }
      }
    });


    return () => {
      socket.off('jugadorUnido');
      socket.off('actualizarEstadoJugadores');
      socket.off('todosListos');
    };
  }, []);

  const marcarListo = () => {
    if (jugadores.length < numJugadoresRequeridos) {
      mostrarError(`Aún faltan jugadores. Se requieren ${numJugadoresRequeridos}. Actualmente hay ${jugadores.length}.`);
      return;
    }

    const nuevosEstados = { ...estadoJugadores, [idJugador]: true };
    setEstadoJugadores(nuevosEstados);
    socket.emit('jugadoresListos', { idPartida, jugadores: nuevosEstados });
  };

  const yoEstoyListo = estadoJugadores[idJugador] === true;

  return (
    <div className="lobby-page">
      <div className="lobby-card">
        <h1>Lobby de Partida</h1>
        <h2>Partida ID: {idPartida}</h2>
        <h3>Jugadores:</h3>
        <ul className="jugadores-lista">
          {jugadores.map(j => (
            <li key={j.id} className="jugador-item">
              <span>{j.nickname}</span>
              <span className={estadoJugadores[j.id] ? 'estado-listo' : 'estado-esperando'}>
                {estadoJugadores[j.id] ? 'Listo ✅' : 'Esperando...'}
              </span>
            </li>
          ))}
        </ul>
        <button className="boton-listo" onClick={marcarListo} disabled={yoEstoyListo}>
          {yoEstoyListo ? 'Esperando a los demás...' : 'Estoy Listo'}
        </button>
      </div>
    </div>
  );
}
