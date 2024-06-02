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

class Square {
  constructor(status = null, ship = null) {
    this.status = status;
    this.ship = ship;
  }
}

export class Gameboard {
  constructor(gridSize) {
    this.board = this.createBoard(gridSize);
    this.ships = this.createShips();
  }

  createBoard(gridSize) {
    let board = [];
    for (let i = 0; i < gridSize; i++) {
      let column = [];
      for (let j = 0; j < gridSize; j++) {
        const square = new Square();
        column.push(square);
      }
      board.push(column);
    }
    return board;
  }

  resetBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j].status = null;
        this.board[i][j].ship = null;
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
        if (
          this.board[i] === undefined ||
          this.board[i][y] === undefined ||
          this.board[i][y].ship != null
        )
          return false;
      }
    } else {
      for (let i = y; i < y + ship.length; i++) {
        if ((this.board[x][i] === undefined || this.board[x][i].ship) != null)
          return false;
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
    const randomNumber = Math.floor(Math.random() * 2);
    return randomNumber === 0 ? "horizontal" : "vertical";
  }

  placeShip(ship, coordinates) {
    const x = coordinates[0];
    const y = coordinates[1];
    if (this.shipPlacementIsValid(ship, coordinates)) {
      if (ship.orientation == "horizontal") {
        for (let i = x; i < x + ship.length; i++) {
          this.board[i][y].ship = ship;
        }
      } else {
        for (let i = y; i < y + ship.length; i++) {
          this.board[x][i].ship = ship;
        }
      }
    } else {
      return false;
    }
  }

  placeShipRandom(ship) {
    ship.orientation = this.getRandomOrientation();
    const placeShip = this.placeShip(ship, this.getRandomCoordinates());
    if (placeShip === false) {
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
    const square = this.board[x][y];

    if (this.board[x] === undefined || square === undefined) {
      return null;
    }

    if (square.status === null && square.ship === null) {
      square.status = "miss";
      return "Miss!";
    } else if (square.status === null && square.ship != null) {
      square.ship.hit();

      if (!square.ship.isSunk()) {
        square.status = "hit";
        return "Hit!";
      } else {
        square.ship.sunk = true;

        for (let i = 0; i < this.board.length; i++) {
          this.board[i].forEach(function (item) {
            if (item.ship === square.ship) item.status = "sunk";
          });
        }

        if (!this.allSunk()) {
          return `${square.ship.name} Sunk!`;
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
