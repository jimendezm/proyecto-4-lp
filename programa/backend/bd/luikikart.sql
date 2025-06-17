CREATE DATABASE luikikart;
USE luikikart;

CREATE TABLE Partida (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identificador VARCHAR(100) NOT NULL UNIQUE,
    tipo ENUM('vs', 'contrarreloj') NOT NULL,
    pista VARCHAR(100) NOT NULL,
    numVueltas INT NOT NULL,
    numJugadores INT NOT NULL,
    ganador VARCHAR(100) DEFAULT NULL,
    estado ENUM('espera', 'en_proceso', 'finalizada') DEFAULT 'espera'
);

CREATE TABLE Jugador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idPartida INT NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    posicion INT NULL,
    FOREIGN KEY (idPartida) REFERENCES Partida(id)
);

CREATE USER 'luiki_user'@'localhost' IDENTIFIED BY 'luikipass';
GRANT ALL PRIVILEGES ON luikikart.* TO 'luiki_user'@'localhost';

