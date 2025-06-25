USE luikikart;
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AgregarPartida (
    IN p_tipo VARCHAR(20),
    IN p_pista VARCHAR(100),
    IN p_numVueltas INT,
    IN p_numJugadores INT
)
BEGIN
    INSERT INTO Partida (tipo, pista, numVueltas, numJugadores, estado)
    VALUES (p_tipo, p_pista, p_numVueltas, p_numJugadores, 'espera');
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AgregarJugador (
    IN p_idPartida INT,
    IN p_nickname VARCHAR(100)
)
BEGIN
    INSERT INTO Jugador (idPartida, nickname)
    VALUES (p_idPartida, p_nickname);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ObtenerJugadoresPorPartida (
    IN p_idPartida INT
)
BEGIN
    SELECT id, nickname, posicion
    FROM Jugador
    WHERE idPartida = p_idPartida
    ORDER BY id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ActualizarGanador (
    IN p_idPartida INT,
    IN p_nicknameGanador VARCHAR(100)
)
BEGIN
    UPDATE Partida
    SET ganador = p_nicknameGanador
    WHERE id = p_idPartida;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ActualizarPosicionJugador (
    IN p_idJugador INT,
    IN p_posicion INT
)
BEGIN
    UPDATE Jugador
    SET posicion = p_posicion
    WHERE id = p_idJugador;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ObtenerPartidasDisponibles ()
BEGIN
    SELECT id, tipo, pista, numVueltas, numJugadores, ganador
    FROM Partida
    WHERE estado = 'espera';
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ObtenerPartidas ()
BEGIN
    SELECT id, tipo, pista, numVueltas, numJugadores, ganador
    FROM Partida
    WHERE estado = 'en_proceso';
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ActualizarEstadoPartida (
    IN p_idPartida INT,
    IN p_nuevoEstado ENUM('espera', 'en_proceso', 'finalizada')
)
BEGIN
    UPDATE Partida
    SET estado = p_nuevoEstado
    WHERE id = p_idPartida;
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AsignarJugadorPartida(
  IN pIdJugador   INT,
  IN pIdPartida   INT
)
BEGIN
  UPDATE Jugador
    SET idPartida = pIdPartida
  WHERE id = pIdJugador;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS ObtenerUltimoJugador()
BEGIN
  SELECT id, nickname, idPartida, posicion
  FROM Jugador
  ORDER BY id DESC
  LIMIT 1;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ObtenerUltimaPartida()
BEGIN
  SELECT *
  FROM Partida
  ORDER BY id DESC
  LIMIT 1;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS ObtenerPartida(IN p_idPartida INT)
BEGIN
  SELECT *
  FROM Partida as p
  WHERE p.id = p_idPartida;
END //
DELIMITER ;

