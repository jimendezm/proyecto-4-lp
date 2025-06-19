// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import kartImg from '../assets/mario-kart.png';

export default function Home() {
  const [nickname, setNickname] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const navigate = useNavigate();

  // Conectar WebSocket y capturar playerId
  useEffect(() => {
    const newSocket = io('');
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setPlayerId(newSocket.id);
    });
    return () => newSocket.disconnect();
  }, []);

  // Una vez ingresado el nickname y conectado, escondemos modal
  const handleSubmit = () => {
    if (nickname.trim() !== '' && playerId) {
      setShowModal(false);
      try {
        fetch('http://localhost:3001/api/jugadores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idPartida: null,    // se asignará luego
            nickname
          })
        });
        setShowModal(false);
      } catch (err) {
        console.error('Error al agregar jugador:', err);
        alert('No se pudo registrar el jugador. Intentá de nuevo.');
      }
    }
  };

  return (
    <div className="home-container">
      {showModal && (
        <div className="modal">
          <h2>¡Bienvenido a Luiki Kart!</h2>
          <input
            type="text"
            value={nickname}
            placeholder="Escribí tu nickname"
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={!playerId}>Aceptar</button>
        </div>
      )}

      {!showModal && (
        <>    
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
        </>
      )}
    </div>
  );
}
