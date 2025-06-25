import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import pista1Img from '../assets/pista1.png';
import pista2Img from '../assets/pista2.png';
import '../styles/Game.css';

const colores = [
  '#e72020', '#4de32a', '#28cae1', '#f477dc', '#fbf230', '#a05ff5', '#ffa500', '#00ffff'
];

const pistas = {
  1: pista1Img,
  2: pista2Img,
};

export default function Game() {
  const { state } = useLocation();
  const { idPartida } = state || {};

  const [jugadoresConColor, setJugadoresConColor] = useState([]);
  const [pistaSeleccionada, setPistaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPartidaYJugadores = async () => {
      try {
        const resPartidas = await fetch('http://localhost:3001/api/partidas/disponibles');
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

  return (
    <div className="game-wrapper">
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
          <img
            src={pistas[pistaSeleccionada]}
            alt={`Pista ${pistaSeleccionada}`}
            className="track-image"
          />
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
