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

    // In the track, 0 is a wall, 1 is a path, and numbers above 1 are players.
    this.trackMatrix = fs.readFileSync(`./tracks/track${track}.txt`, 'utf-8')
      .split('\n')  // get rows.
      .map(row => row.split(' ').map(Number));  // Number parses to Number type.
    this.trackMatrix.pop();  // The last element is an empty space.
  }

  getNewPlayerCoords() {
    switch (this.players.length) {
      case 0:
        return { row: 10, col: 1 }
        break;
      case 1:
        return { row: 11, col: 1 }
        break;
      case 2:
        return { row: 12, col: 1 }
        break;
      case 3:
        return { row: 10, col: 2 }
        break;
      case 4:
        return { row: 11, col: 2 }
        break;
      case 5:
        return { row: 12, col: 2 }
        break;
      default:
        break;
    }
  }

  addPlayer(id, nickname) {
    const cs = this.getNewPlayerCoords();
    this.players.push(new Player(id, nickname, cs.row, cs.col));
  }

  // Only to initialize positions.
  addPlayersToTrack() {
    this.players.forEach(p => {
      // +2 to start at 2. 0 and 1 are reserved for paths and walls.
      this.trackMatrix[p.coords.row][p.coords.col] = p.id + 2;
    })
    this.trackMatrix.forEach(e => console.log(e));
  }

  // Puts a 0 in 'from' and a 'value' in 'to'.
  applyMove(matrix, from, to, value) {
    matrix[from.row][from.col] = 0;
    matrix[to.row][to.col] = value;
  }

  // Applies a move to a player only if possible.
  // Move is: 'ArrowUp', 'ArrowDown', 'ArrowLeft' or 'ArrowRight'.
  updateState(player, move) {
    const { row, col } = player.coords;
    switch (move) {
      case 'ArrowUp':
        if (this.trackMatrix[row - 1][col] === 1) {  // Empty cell.
          this.applyMove(this.trackMatrix, player.coords, { row: row - 1, col: col });
        }
        break;
      case 'ArrowDown':
        if (this.trackMatrix[row + 1][col] === 1) {  // Empty cell.
          this.applyMove(this.trackMatrix, player.coords, { row: row + 1, col: col });
        }
        break;
      case 'ArrowLeft':
        if (this.trackMatrix[row][col - 1] === 1) {  // Empty cell.
          this.applyMove(this.trackMatrix, player.coords, { row: row, col: col - 1 });
        }
        break;
      case 'ArrowRight':
        if (this.trackMatrix[row][col + 1] === 1) {  // Empty cell.
          this.applyMove(this.trackMatrix, player.coords, { row: row, col: col + 1 });
        }
        break;
      default:
        break;
    }
  }
}
