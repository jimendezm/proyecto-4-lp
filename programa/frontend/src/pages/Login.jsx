import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { SocketContext } from '../pages/SocketContext';
import io from 'socket.io-client';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleLogin = async () => {
    if (!nickname.trim()) {
      return alert('Por favor ingresá un nickname');
    }

    try {
      // 1. Registrar jugador en BD
      const res = await fetch('http://localhost:3001/api/jugadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPartida: null, nickname })
      });

      if (!res.ok) throw new Error('Error al crear jugador');

      // 2. Obtener último jugador (para conseguir su ID)
      const jugadorRes = await fetch('http://localhost:3001/api/jugadores/obtener/ultimo');
      const jugador = await jugadorRes.json();

      if (!jugador || !jugador.id) throw new Error('No se pudo obtener el jugador');

      navigate('/home', {
        state: {
          nickname: jugador.nickname,
          idJugador: jugador.id
        }
      });

    } catch (err) {
      console.error('Error en el login:', err);
      alert('No se pudo registrar el jugador. Intentá de nuevo.');
    }
  };

  return (
    <div className="login-modal">
      <h2>¡Bienvenido a Luiki Kart!</h2>
      <input
        type="text"
        value={nickname}
        placeholder="Escribí tu nickname"
        onChange={e => setNickname(e.target.value)}
      />
      <button onClick={handleLogin}>Aceptar</button>
    </div>
  );
}
