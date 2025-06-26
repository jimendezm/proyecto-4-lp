import Player from './player.js';

export default class Game {
  constructor(roomName, id, type, track, numLaps, numPlayers) {
    this.roomName = roomName;
    this.id = id;
    this.type = type;
    this.track = track;
    this.numLaps = numLaps;
    this.numPlayers = numPlayers;
    this.winner = null;
    this.players = [];
  }

  addPlayer(id, nickname) {
    this.players.push(new Player(id, nickname));
  }
}
