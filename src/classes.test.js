import { Ship } from "./classes.js";

//Run tests using npm test

//Ship

const battleship = new Ship(5);

test("Ship hit twice - hits, isSunk", () => {
  battleship.hit();
  battleship.hit();
  expect(battleship.hits).toBe(2);
  expect(battleship.sunk).toBe(false);
});

test("Ship hit five times - hits, isSunk", () => {
  battleship.hit();
  battleship.hit();
  battleship.hit();
  expect(battleship.hits).toBe(5);
  expect(battleship.isSunk()).toBe(true);
});
