import "./style.css";
import { Player } from "./classes.js";
import { renderBoard, deleteBoard, setAlert } from "./render.js";

const player = new Player("Steve");

player.gameboard.placeAllShipsRandom();
renderBoard(player.gameboard.board);

const randomize = document.querySelector(".randomize");
randomize.addEventListener("click", () => {
  player.gameboard.resetBoard();
  player.gameboard.placeAllShipsRandom();
  deleteBoard();
  renderBoard(player.gameboard.board);
});

const board = document.querySelector(".board");
board.addEventListener("click", (event) => {
  let receiveAttack = player.gameboard.receiveAttack([
    event.target.dataset.x,
    event.target.dataset.y,
  ]);
  if (receiveAttack) setAlert(`${receiveAttack}`);
  deleteBoard();
  renderBoard(player.gameboard.board);
});
