export class Ship {
  constructor(name, length) {
    this.name = name;
    this.orientation = "horizontal";
    this.placed = false;
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

  getOrientation() {
    return this.orientation;
  }

  setOrientation(orientation) {
    this.orientation = orientation;
  }

  toggleOrientation() {
    if (this.orientation === "horizontal") {
      this.setOrientation("vertical");
    } else {
      this.setOrientation("horizontal");
    }
  }

  setPlaced(boolean) {
    if (boolean === true) {
      this.placed = true;
    } else {
      this.placed = false;
    }
  }
}
