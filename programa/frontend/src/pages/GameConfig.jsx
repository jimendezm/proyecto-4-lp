// src/components/CreateGameModal.jsx
import React, { useState, useContext } from 'react';
import '../styles/GameConfig.css';
import { useNavigate } from 'react-router-dom';

/**
 * Props:
 *  - isOpen: boolean
 *  - pistas: array of { id, src, name }
 *  - onClose: function()
 */
export default function GameConfig({ isOpen, pistas, onClose }) {
  const { playerId } = useContext(PlayerContext);
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('vs');
  const [pista, setPista] = useState(pistas[0]?.id || null);
  const [numVueltas, setNumVueltas] = useState(3);
  const [numJugadores, setNumJugadores] = useState(2);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1) Crear partida en backend
      const resp = await fetch('http://localhost:3001/api/partidas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identificador: `P-${Date.now()}`,
          tipo,
          pista,
          numVueltas,
          numJugadores
        })
      });
      const data = await resp.json();
      const newPartidaId = data.id || data.insertId || data.partidaId;

      // 2) Asignar jugador a la nueva partida
      await fetch('http://localhost:3001/api/jugadores/asignar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idJugador: playerId, idPartida: newPartidaId })
      });

      // 3) Navegar a la sala de juego
      onClose();
      navigate(`/partida/${newPartidaId}`);
    } catch (err) {
      console.error('Error creando partida:', err);
      alert('No se pudo crear la partida. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content create-modal">
        <h2>Crear Partida</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
