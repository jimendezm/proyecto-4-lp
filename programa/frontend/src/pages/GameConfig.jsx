import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/GameConfig.css';
import pista1Img from '../assets/pista1.png';
import pista2Img from '../assets/pista2.png';
import { SocketContext } from '../pages/SocketContext';

export default function GameConfig() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const pistas = [
    { id: 1, src: pista1Img, name: 'Pista 1' },
    { id: 2, src: pista2Img, name: 'Pista 2' }
  ];

  const [tipo, setTipo] = useState('vs');
  const [pista, setPista] = useState(pistas[0].id);
  const [numVueltas, setNumVueltas] = useState(3);
  const [numJugadores, setNumJugadores] = useState(2);
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const { nickname, idJugador } = state || {};

  const mostrarError = (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje,
      confirmButtonColor: '#d33'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resPartida = await fetch('http://localhost:3001/api/partidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          pista,
          numVueltas,
          numJugadores
        })
      });

      if (!resPartida.ok)
        throw new Error('Error al crear partida, Error: ' + resPartida.status);

      const resUltima = await fetch('http://localhost:3001/api/partidas/ultima');
      if (!resUltima.ok) throw new Error('No se pudo obtener la última partida');

      const ultimaPartida = await resUltima.json();
      const idPartida = ultimaPartida.id;

      const resAsignar = await fetch('http://localhost:3001/api/jugadores/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idJugador,
          idPartida
        })
      });

      if (!resAsignar.ok)
        throw new Error('Error al asignar jugador a la partida');

      socket.emit("joinPartida", { idPartida, idJugador });

      navigate('/lobby', { state: { idPartida, idJugador, nickname } });
    } catch (err) {
      console.error(err);
      mostrarError('No se pudo crear y asignar la partida. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-page">
      <div className="config-content">
        <h2>Crear Partida</h2>
        <form className="config-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de juego:</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="vs">Versus</option>
              <option value="contrarreloj">Contrarreloj</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pista:</label>
            <div className="pistas-grid">
              {pistas.map(p => (
                <div
                  key={p.id}
                  className={`pista-item ${pista === p.id ? 'selected' : ''}`}
                  onClick={() => setPista(p.id)}
                >
                  <img src={p.src} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group inline-group">
            <div>
              <label>Número de vueltas:</label>
              <input
                type="number"
                min={1}
                value={numVueltas}
                onChange={e => setNumVueltas(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Número de jugadores:</label>
              <input
                type="number"
                min={2}
                value={numJugadores}
                onChange={e => setNumJugadores(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Partida'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
