// src/pages/Lobby.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SocketContext } from './SocketContext';
import '../styles/Lobby.css'; 

export default function Lobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useContext(SocketContext);
  const { idPartida, idJugador, nickname } = location.state || {};

  const [jugadores, setJugadores] = useState([]);
  const [estadoJugadores, setEstadoJugadores] = useState({});

  useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await fetch(`http://localhost:3001/api/jugadores/${idPartida}`);
        const data = await response.json();
        setJugadores(data);

        // Solo inicializar estado si aún está vacío
        setEstadoJugadores(prev => {
            if (Object.keys(prev).length === 0) {
            const inicial = {};
            data.forEach(j => inicial[j.id] = false);
            return inicial;
            }
            return prev; // no tocar si ya hay estado
        });

        } catch (err) {
        console.error('Error al obtener jugadores:', err);
        }
    };

    fetchData();
    socket.emit('joinPartida', { idPartida, idJugador });

    socket.on('jugadorUnido', ({ idJugador: nuevo }) => {
    fetch(`http://localhost:3001/api/jugadores/${idPartida}`)
        .then(res => res.json())
        .then(data => {
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
        });
    });



    // Recibir actualización de estados
    socket.on('actualizarEstadoJugadores', (nuevosEstados) => {
      setEstadoJugadores(nuevosEstados);
    });

    // Todos listos
    socket.on('todosListos', () => {
      alert('¡Todos los jugadores están listos! Comenzando...');
      navigate('/home', { state: { idPartida, jugadores } });
    });

    return () => {
        socket.off('jugadorUnido');
        socket.off('actualizarEstadoJugadores');
        socket.off('todosListos');
    };
    }, []);


  const marcarListo = () => {
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
