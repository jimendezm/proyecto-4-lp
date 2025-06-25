import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pista1 from '../assets/pista1.png';
import pista2 from '../assets/pista2.png';
import '../styles/ListGames.css'; 
import '../styles/Statistics.css'; 
const pistas = {
  'Pista 1': pista1,
  'Pista 2': pista2
};
export default function Statistics() {
  const [partidas, setPartidas] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/partidas/estadisticas');
        const data = await res.json();
        setPartidas(data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };
    fetchEstadisticas();
  }, []);

  const abrirModal = (partida) => setPartidaSeleccionada(partida);
  const cerrarModal = () => setPartidaSeleccionada(null);

  return (
    <div className="list-games-page">
      <h2>Estadísticas de Partidas</h2>
      {partidas.length === 0 ? (
        <p className="no-games">No hay partidas registradas.</p>
      ) : (
        <ul className="games-list">
          {partidas.map(p => (
            <li key={p.id} className="game-item" onClick={() => abrirModal(p)}>
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Pista:</strong> {p.pista}</p>
              <p><strong>Jugadores:</strong> {p.jugadores.length}</p>
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1.5rem' }}>
        Volver al Inicio
      </button>

      {partidaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Partida #{partidaSeleccionada.id}</h3>
            <img
              src={pistas[partidaSeleccionada.pista]}
              alt="Pista"
              className="modal-track-img"
              style={{ width: '100%', borderRadius: '10px', marginBottom: '1rem' }}
            />
            <h4>Resultados</h4>
            <table className="tabla-posiciones">
              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Jugador</th>
                </tr>
              </thead>
              <tbody>
                {partidaSeleccionada.jugadores
                  .sort((a, b) => a.posicion - b.posicion)
                  .map(j => (
                    <tr key={j.nickname}>
                      <td>{j.posicion}</td>
                      <td>{j.nickname}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button className="cerrar-btn" onClick={cerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
