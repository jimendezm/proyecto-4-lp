CREATE DATABASE luikikart;
USE luikikart;

CREATE TABLE Partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('vs', 'contrarreloj') NOT NULL,
    pista VARCHAR(100) NOT NULL,
    numVueltas INT NOT NULL,
    numJugadores INT NOT NULL,
    ganador VARCHAR(100) NULL
);

CREATE TABLE Jugador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPartida INT NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    posicion INT NULL,
    FOREIGN KEY (idPartida) REFERENCES Partida(id)
);
