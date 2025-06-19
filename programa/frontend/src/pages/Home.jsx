// src/pages/Home.jsx
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import kartImg from '../assets/mario-kart.png';

export default function Home() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { nickname } = state;

  useEffect(() => {
    if (!nickname ) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <h1 className="welcome-title">¡Hola, {nickname}!</h1>

      <div className="road">
        <div className="mario-kart">
          <img src={kartImg} alt="Mario Kart" className="kart" />
        </div>
      </div>

      <div className="menu">
        <button onClick={() => navigate('/game-config')}>Crear Partida</button>
        <button onClick={() => navigate('/unirse')}>Unirse a Partida</button>
        <button onClick={() => navigate('/estadisticas')}>Ver Estadísticas</button>
        <button onClick={() => navigate('/ranking')}>Ver Ranking</button>
      </div>
    </div>
  );
}
