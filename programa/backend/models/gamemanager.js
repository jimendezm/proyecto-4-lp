import Game from "./game.js";

export default class GameManager {
  static #instance;
  games = []

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
}
