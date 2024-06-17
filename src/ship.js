export class Ship {
  constructor(name, length) {
    this.name = name;
    this.orientation = "horizontal";
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
