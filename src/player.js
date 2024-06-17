import { Gameboard } from "./gameboard";

export class Player {
  constructor(realPlayer = true, gridSize = 10) {
    this.realPlayer = realPlayer;
    this.gameboard = new Gameboard(gridSize);
  }
}
