import { Ship } from "./ship";

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
    this.alert = "";
    this.uniqueHits = [];
    this.nextAttacks = [];
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
    for (let i = 0; i < this.ships.length; i++) {
      this.ships[i].hits = 0;
      this.ships[i].sunk = false;
      this.ships[i].setPlaced(false);
    }
    this.setAlert("");
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
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);
    if (this.board[x] === undefined || this.board[y] === undefined) {
      return false;
    }

    if (ship.orientation == "horizontal") {
      for (let i = x; i < x + ship.length; i++) {
        if (
          this.board[i] === undefined ||
          this.board[i][y] === undefined ||
          this.board[i][y].ship != null
        ) {
          return false;
        }
      }
    } else {
      for (let i = y; i < y + ship.length; i++) {
        if ((this.board[x][i] === undefined || this.board[x][i].ship) != null) {
          return false;
        }
      }
    }
    return true;
  }

  getRandomCoordinates() {
    const x = Math.floor(Math.random() * this.board.length);
    const y = Math.floor(Math.random() * this.board.length);
    return [x, y];
  }

  getRandomOrientation() {
    const randomNumber = Math.floor(Math.random() * 2);
    return randomNumber === 0 ? "horizontal" : "vertical";
  }

  placeShip(ship, coordinates) {
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);
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
    this.resetBoard();
    for (let i = 0; i < this.ships.length; i++) {
      this.placeShipRandom(this.ships[i]);
    }
  }

  pushToUniqueHitsIfValid(coordinates) {
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);
    const ship = this.board[x][y].ship;
    if (
      !this.uniqueHits.some(
        (item) => this.board[item[0]][item[1]].ship === ship
      )
    ) {
      this.uniqueHits.push(coordinates);
    }
  }

  receiveAttack(coordinates) {
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);

    if (this.board[x] === undefined || this.board[x][y] === undefined) {
      return null;
    }

    const square = this.board[x][y];

    if (square.status === null && square.ship === null) {
      square.status = "miss";
      this.setAlert("Miss!");
      return "miss";
    } else if (square.status === null && square.ship != null) {
      square.ship.hit();

      if (!square.ship.isSunk()) {
        square.status = "hit";
        this.pushToUniqueHitsIfValid(coordinates);
        this.setAlert("Hit!");
        return "hit";
      } else {
        square.ship.sunk = true;
        for (let i = 0; i < this.board.length; i++) {
          this.board[i].forEach(function (item) {
            if (item.ship === square.ship) item.status = "sunk";
          });
        }
        this.uniqueHits.splice(0, 1);
        this.nextAttacks = [];
        this.setAlert(`${square.ship.name} Sunk!`);
        return "sunk";
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

  setAlert(message) {
    this.alert = message;
  }

  getAlert() {
    return this.alert;
  }

  getNextAttack() {
    let coordinates;
    if (this.uniqueHits.length > 0) {
      this.nextAttacks = this.calcNextAttacksOnHit(this.uniqueHits[0]);
      coordinates = this.nextAttacks[0];
      this.nextAttacks.splice(0, 1);
    } else {
      coordinates = this.getRandomCoordinates();
      while (!this.checkValidAttackCoordinates(coordinates)) {
        coordinates = this.getRandomCoordinates();
      }
    }
    return coordinates;
  }

  calcNextAttacksOnHit(coordinates) {
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);
    const ship = this.board[x][y].ship;
    let targets = [];
    let loop1 = true;
    let loop2 = true;
    if (
      this.board[x + 1] != undefined &&
      this.board[x + 1][y].status == "hit" &&
      this.board[x + 1][y].ship == ship
    ) {
      for (let i = 0; i < ship.length; i++) {
        if (
          this.board[x - (1 + i)] &&
          this.board[x - (1 + i)][y].status != "miss" &&
          loop1 === true
        ) {
          targets.push([x - (1 + i), y]);
        } else {
          loop1 = false;
        }
        if (
          this.board[x + (2 + i)] &&
          this.board[x + (2 + i)][y].status != "miss" &&
          loop2 === true
        ) {
          targets.push([x + (2 + i), y]);
        } else {
          loop2 = false;
        }
      }
    } else if (
      this.board[x - 1] != undefined &&
      this.board[x - 1][y].status == "hit" &&
      this.board[x - 1][y].ship == ship
    ) {
      for (let i = 0; i < ship.length; i++) {
        if (
          this.board[x + (1 + i)] &&
          this.board[x + (1 + i)][y].status != "miss" &&
          loop1 === true
        ) {
          targets.push([x + (1 + i), y]);
        } else {
          loop1 = false;
        }
        if (
          this.board[x - (2 + i)] &&
          this.board[x - (2 + i)][y].status != "miss" &&
          loop2 === true
        ) {
          targets.push([x - (2 + i), y]);
        } else {
          loop2 = false;
        }
      }
    } else if (
      this.board[x][y + 1] != undefined &&
      this.board[x][y + 1].status == "hit" &&
      this.board[x][y + 1].ship == ship
    ) {
      for (let i = 0; i < ship.length; i++) {
        if (
          this.board[x][y + (2 + i)] &&
          this.board[x][y + (2 + i)].status != "miss" &&
          loop1 === true
        ) {
          targets.push([x, y + (2 + i)]);
        } else {
          loop1 = false;
        }
        if (
          this.board[x][y - (1 + i)] &&
          this.board[x][y - (1 + i)].status != "miss" &&
          loop2 === true
        ) {
          targets.push([x, y - (1 + i)]);
        } else {
          loop2 = false;
        }
      }
    } else if (
      this.board[x][y - 1] != undefined &&
      this.board[x][y - 1].status == "hit" &&
      this.board[x][y - 1].ship == ship
    ) {
      for (let i = 0; i < ship.length; i++) {
        if (
          this.board[x][y - (2 + i)] &&
          this.board[x][y - (2 + i)].status != "miss" &&
          loop1 === true
        ) {
          targets.push([x, y - (2 + i)]);
        } else {
          loop1 = false;
        }
        if (
          this.board[x][y + (1 + i)] &&
          this.board[x][y + (1 + i)].status != "miss" &&
          loop2 === true
        ) {
          targets.push([x, y + (1 + i)]);
        } else {
          loop2 = false;
        }
      }
    } else {
      targets = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ];
    }
    targets = targets.filter((item) => this.checkValidAttackCoordinates(item));
    return targets;
  }

  checkValidAttackCoordinates(coordinates) {
    const x = Number(coordinates[0]);
    const y = Number(coordinates[1]);
    if (
      this.board[x] === undefined ||
      this.board[y] === undefined ||
      x < 0 ||
      y < 0 ||
      this.board[x][y].status != null
    )
      return false;
    else return true;
  }
}
