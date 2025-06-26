import React, { useEffect, useState, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import pista1Img from '../assets/pista1.png';
import pista2Img from '../assets/pista2.png';
import '../styles/Game.css';
import { SocketContext } from './SocketContext';
import TrackGrid from './TrackGrid.jsx'

const colores = [
  '#e72020', '#4de32a', '#28cae1', '#f477dc', '#fbf230', '#a05ff5', '#ffa500', '#00ffff'
];

const pistas = {
  1: pista1Img,
  2: pista2Img,
};

// Shows a 3..2..1..GO message before starting the race.
// onFinish: What to do when count finishes.
const StartCountdown = ({ onFinish }) => {
  const [count, setCount] = useState(3);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      setMessage('GO!');
      const timer = setTimeout(() => {
        setMessage('');
        onFinish();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onFinish]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '10rem',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '0 0 10px rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      {message || (count > 0 ? count : '')}
    </div>
  );
};

export default function Game() {
  const socket = useContext(SocketContext);
  const { state } = useLocation();
  const { idPartida, jugadores, idJugador } = state || {};
  const [ raceStarted, setRaceStarted ] = useState(false);
  const moves = useRef([]);  // Here are stored player movements.
  const move = useRef('');  // Here is stored the current movement.
  const location = useLocation();
  console.log(location.state);

  const [jugadoresConColor, setJugadoresConColor] = useState([]);
  const [pistaSeleccionada, setPistaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPartidaYJugadores = async () => {
      try {
        const resPartidas = await fetch('http://localhost:3001/api/partidas/juego');
        const partidas = await resPartidas.json();
        const partida = partidas.find(p => p.id === idPartida);
        setPistaSeleccionada(partida.pista);

        const resJugadores = await fetch(`http://localhost:3001/api/jugadores/${idPartida}`);
        const data = await resJugadores.json();

        const coloresDisponibles = [...colores];
        const asignados = data.map(jugador => {
          const color = coloresDisponibles.splice(
            Math.floor(Math.random() * coloresDisponibles.length),
            1
          )[0] || '#cccccc';
          return { ...jugador, color, x: 1, y: 12 };
        });
        setJugadoresConColor(asignados);
      } catch (error) {
        console.error('Error al cargar partida o jugadores:', error);
      }
    };

    if (idPartida) {
      fetchPartidaYJugadores();
    }
  }, [idPartida]);

  const handleRaceStart = () => {
    setRaceStarted(true);
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
        move.current = e.code;
      } else {
        move.current = '';
      }
    });
    const intervalRef = setInterval(() => {
      if (move.current !== '' && moves.current.length < 3) {
        moves.current = [ ...moves.current, move.current ];
      }
    }, 100);

    socket.on('requestMoves', () => {
      socket.emit('receiveMoves', {
        gameId: idPartida,
        user: idJugador,
        moves: moves.current
      });
      console.log(moves.current);
      moves.current = [];
      move.current = '';
    });
  }

  return (
    <div className="game-wrapper">
      {!raceStarted && <StartCountdown onFinish={handleRaceStart()} />}

      <div className="sidebar">
        <h3>Jugadores</h3>
        <table className="jugadores-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {jugadoresConColor.map(j => (
              <tr key={j.id}>
                <td>
                  <div className="color-box" style={{ backgroundColor: j.color }}></div>
                </td>
                <td>{j.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="track-container">
        {pistaSeleccionada && (
          
        )}
        <div className="overlay-grid">
          {jugadoresConColor.map(j => (
            <div
              key={j.id}
              className="player-block"
              style={{
                backgroundColor: j.color,
                gridRow: j.y,
                gridColumn: j.x,
              }}
            >
              <span className="player-name">{j.nickname}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
