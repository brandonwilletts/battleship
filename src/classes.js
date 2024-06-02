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

export class Gameboard {
  constructor(gridSize) {
    this.board = this.createBoard(gridSize);
    this.ships = this.createShips();
  }

  createBoard(gridSize) {
    let rows = [];
    for (let i = 0; i < gridSize; i++) {
      let column = [];
      for (let j = 0; j < gridSize; j++) {
        column.push(0);
      }
      rows.push(column);
    }
    return rows;
  }

  resetBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  createShips() {
    const carrier = new Ship("Carrier", 5);
    const battleship = new Ship("Battleship", 4);
    const cruiser = new Ship("Cruiser", 3);
    const submarine = new Ship("Submarine", 3);
    const destroyer = new Ship("Destroyer", 2);
    return [carrier, battleship, cruiser, submarine, destroyer];
  }

  shipPlacementIsValid(ship, coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];
    if (this.board[x] === undefined || this.board[y] === undefined)
      return false;
    if (ship.orientation == "horizontal") {
      for (let i = x; i < x + ship.length; i++) {
        if (this.board[i] === undefined || this.board[i][y] != 0) return false;
      }
    } else {
      for (let i = y; i < y + ship.length; i++) {
        if (this.board[x][i] != 0) return false;
      }
    }
    return true;
  }

  getRandomCoordinates() {
    const x = Math.floor(Math.random() * (this.board.length - 1));
    const y = Math.floor(Math.random() * (this.board.length - 1));
    return [x, y];
  }

  getRandomOrientation() {
    const binaryNumber = Math.floor(Math.random() * 2);
    return binaryNumber === 0 ? "horizontal" : "vertical";
  }

  placeShip(ship, coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];
    if (this.shipPlacementIsValid(ship, coordinates)) {
      if (ship.orientation == "horizontal") {
        for (let i = x; i < x + ship.length; i++) {
          this.board[i][y] = ship;
        }
      } else {
        for (let i = y; i < y + ship.length; i++) {
          this.board[x][i] = ship;
        }
      }
    } else {
      return false;
    }
  }

  placeShipRandom(ship) {
    ship.orientation = this.getRandomOrientation();
    const place = this.placeShip(ship, this.getRandomCoordinates());
    if (place === false) {
      this.placeShipRandom(ship);
    }
  }

  placeAllShipsRandom() {
    for (let i = 0; i < this.ships.length; i++) {
      this.placeShipRandom(this.ships[i]);
    }
  }

  receiveAttack(coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];

    if (this.board[x] === undefined || this.board[x][y] === undefined) {
      return null;
    }

    if (this.board[x][y] === 0) {
      this.board[x][y] = "miss";
      return "Miss!";
    } else if (this.ships.some((item) => item === this.board[x][y])) {
      const ship = this.board[x][y];
      ship.hit();
      if (!ship.isSunk()) {
        this.board[x][y] = "hit";
        return "Hit!";
      } else if (ship.isSunk()) {
        ship.sunk = true;
        this.board[x][y] = "sunk";
        if (!this.allSunk()) {
          return `${ship.name} Sunk!`;
        } else {
          return "Game Over!";
        }
      }
    } else {
      return null;
    }
  }

  allSunk() {
    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].sunk) return false;
    }
    return true;
  }
}

export class Player {
  constructor(name, realPlayer = true, gridSize = 10) {
    this.name = name;
    this.realPlayer = realPlayer;
    this.gameboard = new Gameboard(gridSize);
  }
}
