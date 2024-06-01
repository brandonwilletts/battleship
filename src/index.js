import "./style.css";
import { Ship, Gameboard, Player } from "./classes.js";

const gameboard = new Gameboard(10);
gameboard.placeShip(gameboard.ships[0], [0, 0]);
gameboard.receiveAttack([0, 0]);

console.table(gameboard.board);
console.log(gameboard.board[0][0]);
