import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { SocketContext } from '../pages/SocketContext';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const handleLogin = async () => {
    if (!nickname.trim()) {
      return alert('Por favor ingresá un nickname');
    }
    try {
      //Registramos al jugador en la BD
      const res = await fetch('http://localhost:3001/api/jugadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPartida: null, nickname })
      });
      const data = await res.json();

      //Navegamos a Home pasando solo datos serializables
      navigate('/home', { state: { nickname } });
    } catch (err) {
      console.error('Error al crear jugador:', err);
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
