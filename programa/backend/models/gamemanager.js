import Game from "./game.js";

// Stores gameId and every player's moves before applying them.
class MovesBuffer {
  constructor(gameId) {
    this.gameId = gameId;
    this.moveLists = []  // Here are stored every player's moves.
  }

  addMoves(playerId, moves) {
    this.moveLists.push({ player: playerId, moves: moves });
  }

  reset() {
    this.moveLists = [];
  }
}

export default class GameManager {
  static #instance;
  games = []
  gamesMovesBuffer = []  // Each element is a MovesBuffer.

  constructor() {
    if (GameManager.#instance) {
      return GameManager.#instance;
    }
    GameManager.#instance = this;
  }

  addGame(roomName, id, type, track, numLaps, numPlayers) {
    this.games.push(new Game(roomName, id, type, track, numLaps, numPlayers));
    return this.games[this.games.length - 1]
  }

  findGame(targetId) {
    return this.games.find(game => game.id === targetId);
  }

  addMovesBuffer(gameId) {
    this.gamesMovesBuffer.push(new MovesBuffer(gameId));
    return this.gamesMovesBuffer[this.games.length - 1]
  }

  findMovesBuffer(gameId) {
    return this.gamesMovesBuffer.find(mb => mb.gameId === gameId);
  }
}
