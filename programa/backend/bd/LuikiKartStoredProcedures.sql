
DELIMITER //
CREATE PROCEDURE AgregarPartida (
    IN p_identificador VARCHAR(100),
    IN p_tipo ENUM('vs', 'contrarreloj'),
    IN p_pista VARCHAR(100),
    IN p_numVueltas INT,
    IN p_numJugadores INT
)
BEGIN
    INSERT INTO Partida (identificador, tipo, pista, numVueltas, numJugadores, estado)
    VALUES (p_identificador, p_tipo, p_pista, p_numVueltas, p_numJugadores, 'espera');
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE AgregarJugador (
    IN p_idPartida INT,
    IN p_nickname VARCHAR(100)
)
BEGIN
    INSERT INTO Jugador (idPartida, nickname)
    VALUES (p_idPartida, p_nickname);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ObtenerJugadoresPorPartida (
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
CREATE PROCEDURE ActualizarGanador (
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
CREATE PROCEDURE ActualizarPosicionJugador (
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
CREATE PROCEDURE ObtenerPartidasDisponibles ()
BEGIN
    SELECT id, identificador, tipo, pista, numVueltas, numJugadores, ganador
    FROM Partida
    WHERE estado = 'espera';
END //
DELIMITER ;


DELIMITER //
CREATE PROCEDURE ActualizarEstadoPartida (
    IN p_idPartida INT,
    IN p_nuevoEstado ENUM('espera', 'en_proceso', 'finalizada')
)
BEGIN
    UPDATE Partida
    SET estado = p_nuevoEstado
    WHERE id = p_idPartida;
END //
DELIMITER ;


