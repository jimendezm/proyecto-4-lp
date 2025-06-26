import Player from './player.js';
import fs from 'fs';

export default class Game {
  constructor(roomName, id, type, track, numLaps, numPlayers) {
    this.roomName = roomName;
    this.id = id;
    this.type = type;
    this.track = track;  // track id.
    this.numLaps = numLaps;
    this.numPlayers = numPlayers;
    this.winner = null;
    this.players = [];

    this.trackMatrix = fs.readFileSync(`../tracks/track${track}.txt`, 'utf-8')
      .split('\n')  // get rows.
      .map(row => row.split(' ').map(Number))  // Number parses to Number type.
  }

  getNewPlayerCoords() {
    switch (this.players.length) {
      case 0:
        return { row: 10, col: 0 }
        break;
      case 1:
        return { row: 11, col: 0 }
        break;
      case 2:
        return { row: 12, col: 0 }
        break;
      case 3:
        return { row: 10, col: 1 }
        break;
      case 4:
        return { row: 11, col: 1 }
        break;
      case 5:
        return { row: 12, col: 1 }
        break;
      default:
        break;
    }
  }

  addPlayer(id, nickname) {
    const cs = this.getNewPlayerCoords();
    this.players.push(new Player(id, nickname, cs.row, cs.col));
  }

  getState()
}
