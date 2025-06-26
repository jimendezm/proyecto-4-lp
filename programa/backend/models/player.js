export default class Player {
  constructor(id, nickname, row, col) {
    this.id = id;
    this.nickname = nickname;
    this.position = null;
    this.coords = { row: row, col: col };
  }
}
