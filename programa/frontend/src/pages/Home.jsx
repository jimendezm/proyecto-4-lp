import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import kartImg from '../assets/mario-kart.png';

export default function Home() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Desestructuramos nickname e idJugador
  const { nickname, idJugador } = state || {};

  useEffect(() => {
    if (!nickname || !idJugador) {
      navigate('/');
    }
  }, [nickname, idJugador, navigate]);

  const goTo = (path) => {
    navigate(path, { state: { nickname, idJugador } });
  };

  return (
    <div className="home-container">
      <h1 className="welcome-title">¡Hola, {nickname}!</h1>

      <div className="road">
        <div className="mario-kart">
          <img src={kartImg} alt="Mario Kart" className="kart" />
        </div>
      </div>

      <div className="menu">
        <button onClick={() => goTo('/game-config')}>Crear Partida</button>
        <button onClick={() => goTo('/unirse')}>Unirse a Partida</button>
        <button onClick={() => goTo('/estadisticas')}>Ver Estadísticas</button>
        <button onClick={() => goTo('/ranking')}>Ver Ranking</button>
      </div>
    </div>
  );
}
