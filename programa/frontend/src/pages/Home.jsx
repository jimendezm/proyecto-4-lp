import React, { useState } from "react";
import "../styles/Home.css";
import kartImg from '../assets/mario-kart.png';

function Home() {
  const [nickname, setNickname] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = () => {
    if (nickname.trim() !== "") {
      setShowWelcome(true);
    }
  };

  return (
    <div className="home-container">
      {!showWelcome && (
        <div className="modal">
          <h2>¡Bienvenido a Luiki Kart!</h2>
          <input
            type="text"
            value={nickname}
            placeholder="Escribí tu nickname"
            onChange={(e) => setNickname(e.target.value)}
          />
          <button onClick={handleSubmit}>Aceptar</button>
        </div>
      )}

      {showWelcome && (
        <>
          <h1 className="welcome-title">¡Hola, {nickname}!</h1>

          <div className="road">
            <div className="mario-kart">
              <div className="mario-kart">
                <img src={kartImg} alt="Mario Kart" className="kart-image" />
              </div>
            </div>
          </div>

          <div className="menu">
            <button>Crear Partida</button>
            <button>Unirse a una Partida</button>
            <button>Ver Estadísticas</button>
            <button>Ver Ranking</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
