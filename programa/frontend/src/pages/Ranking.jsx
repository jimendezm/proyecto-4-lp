import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import pista1 from '../assets/pista1.png';
import pista2 from '../assets/pista2.png';
import '../styles/ListGames.css';  // Reutiliza estilos base
import '../styles/Ranking.css';    // Estilos específicos si deseas

const pistas = {
  "Pista 1": pista1,
  "Pista 2": pista2
};

export default function Ranking() {
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { nickname, idJugador } = state || {};

  const goTo = (path) => {
    navigate(path, { state: { nickname, idJugador } });
  };

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/partidas/ranking');
        const data = await res.json();
        setRanking(data);
      } catch (error) {
        console.error('Error al obtener el ranking:', error);
      }
    };
    fetchRanking();
  }, []);

  return (
    <div className="list-games-page">
      <h2>Ranking de Ganadores</h2>

      {ranking.length === 0 ? (
        <p className="no-games">No hay partidas finalizadas aún.</p>
      ) : (
        <ul className="games-list">
          {ranking.map((p) => (
            <li key={p.idPartida} className="game-item">
              <p><strong>ID:</strong> {p.idPartida}</p>
              <p><strong>Pista:</strong> {p.pista}</p>
              <p><strong>Vueltas:</strong> {p.numVueltas}</p>
              <p><strong>Ganador:</strong> {p.ganador}</p>
              <p><strong>Tiempo:</strong> {p.tiempo}</p>
              <img
                src={pistas[p.pista]}
                alt={`Pista ${p.pista}`}
                className="ranking-track-img"
              />
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => goTo('/home')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
        Volver al Inicio
      </button>
    </div>
  );
}
