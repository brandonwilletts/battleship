import { Ship } from "./ship.js";
import { Gameboard } from "./gameboard.js";
import { Player } from "./player.js";

//Run tests using npm test

describe("Ship", () => {
  const battleship = new Ship("battleship", 5);

  test("Ship hit twice, hits = 2, isSunk = false", () => {
    battleship.hit();
    battleship.hit();
    expect(battleship.hits).toBe(2);
    expect(battleship.sunk).toBe(false);
  });

  test("Ship hit five times - hits, 5, isSunk = true", () => {
    battleship.hit();
    battleship.hit();
    battleship.hit();
    expect(battleship.hits).toBe(5);
    expect(battleship.isSunk()).toBe(true);
  });
});

const gameboard = new Gameboard(10);
gameboard.placeShip(gameboard.ships[1], [0, 0]);

describe("Gameboard", () => {
  test("createGameboard = 10 x 10 grid", () => {
    expect(gameboard.board.length).toBe(10);
    expect(gameboard.board[0].length).toBe(10);
    expect(gameboard.board[gameboard.board.length - 1].length).toBe(10);
  });

  test("allSunk = false", () => {
    expect(gameboard.allSunk()).toBe(false);
  });

  test("allSunk = true", () => {
    for (let i = 0; i < gameboard.ships.length; i++) {
      gameboard.ships[i].sunk = true;
    }
    expect(gameboard.allSunk()).toBe(true);
  });
});

describe("Ship Placement", () => {
  describe("Horizontal", () => {
    test("shipPlacementIsValid / horizontal - ship out of bounds = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[0], [9, 9])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / horizontal - coordinates don't exist = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[0], [10, 10])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / horizontal - another ship overlaps = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[0], [0, 0])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / horizontal = true", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[0], [4, 4])).toBe(
        true
      );
    });
  });

  describe("Vertical", () => {
    gameboard.ships[2].orientation = "vertical";

    test("shipPlacementIsValid / vertical - ship out of bounds = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[2], [9, 9])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / vertical - coordinates don't exist = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[2], [10, 10])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / vertical - another ship overlaps = false", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[2], [0, 0])).toBe(
        false
      );
    });

    test("shipPlacementIsValid / vertical = true", () => {
      expect(gameboard.shipPlacementIsValid(gameboard.ships[2], [4, 4])).toBe(
        true
      );
    });
  });
});

describe("Receive Attack", () => {
  describe("Miss", () => {
    test("Return value = miss", () => {
      expect(gameboard.receiveAttack([9, 9])).toBe("Miss!");
    });

    test("Board value = miss", () => {
      gameboard.receiveAttack([9, 9]);
      expect(gameboard.board[9][9].status).toBe("miss");
    });

    test("Previous miss = null", () => {
      gameboard.receiveAttack([9, 9]);
      expect(gameboard.receiveAttack([9, 9])).toBe(null);
    });
  });

  describe("Hit", () => {
    test("Return value = hit", () => {
      expect(gameboard.receiveAttack([0, 0])).toBe("Hit!");
    });

    test("Board value = hit", () => {
      expect(gameboard.board[0][0].status).toBe("hit");
    });

    test("Ship to have hits = 1", () => {
      expect(gameboard.ships[1].hits).toBe(1);
    });

    test("Ship = sunk", () => {
      gameboard.receiveAttack([1, 0]);
      gameboard.receiveAttack([2, 0]);
      gameboard.receiveAttack([3, 0]);
      expect(gameboard.ships[1].isSunk()).toBe(true);
    });

    test("Previous hit = null", () => {
      gameboard.receiveAttack([0, 0]);
      expect(gameboard.receiveAttack([0, 0])).toBe(null);
    });
  });

  describe("Out-of-bounds", () => {
    test("receiveAttack = out-of-bounds", () => {
      expect(gameboard.receiveAttack([10, 10])).toBe(null);
    });
  });
});

describe("Player", () => {
  const player = new Player("John");

  test("name", () => {
    expect(player.name).toBe("John");
  });

  test("realPlayer", () => {
    expect(player.realPlayer).toBe(true);
  });

  test("gameboard size = 10x10", () => {
    expect(player.gameboard.board.length).toBe(10);
    expect(player.gameboard.board[9].length).toBe(10);
  });
});
