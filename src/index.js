import "./style.css";
import { screenController } from "./screen";
import { Player } from "./player";

const player1 = new Player();
const player2 = new Player(false);

const screen = screenController();

const startButton = document.querySelector("#start-btn");
const randomizeButton = document.querySelector("#randomize-btn");
const clearButton = document.querySelector("#clear-btn");
const playButton = document.querySelector("#play-btn");
const enemyBoard = document.querySelector("#enemy-board");
const shipsContainer = document.querySelector("#ships-container");

startButton.addEventListener("click", () => {
  screen.hideStartScreen();
  screen.renderPlaceShipsBoard(player1);
  screen.renderAllDragDropShips(player1);
  screen.showPlaceShipsModal();
});

randomizeButton.addEventListener("click", () => {
  player1.gameboard.placeAllShipsRandom();
  screen.clearDragDropShips();
  screen.renderPlaceShipsBoard(player1);
});

clearButton.addEventListener("click", () => {
  player1.gameboard.resetBoard();
  screen.renderPlaceShipsBoard(player1);
  screen.renderAllDragDropShips(player1);
});

playButton.addEventListener("click", () => {
  if (shipsContainer.textContent == "") {
    player2.gameboard.placeAllShipsRandom();
    screen.closePlaceShipsModal();
    screen.renderGameplay(player1, player2);
  }
});

enemyBoard.addEventListener("click", (event) => {
  const player1Target = event.target;
  const player1Attack = player2.gameboard.receiveAttack([
    player1Target.dataset.x,
    player1Target.dataset.y,
  ]);
  if (player1Attack) {
    screen.renderGameplay(player1, player2);
    if (player2.gameboard.allSunk()) {
      screen.showEndgameModal("You win!");
    } else {
      const player2Target = player1.gameboard.getNextAttack();
      player1.gameboard.receiveAttack(player2Target);
      screen.renderGameplay(player1, player2);
      if (player1.gameboard.allSunk()) {
        screen.showEndgameModal("You lose!");
      }
    }
  }
});

const playAgainButton = document.querySelector("#play-again");
playAgainButton.addEventListener("click", () => {
  screen.clearGameplay();
  player2.gameboard.resetBoard();
  player1.gameboard.resetBoard();
  screen.closeEndgameModal();
  screen.renderPlaceShipsBoard(player1);
  screen.renderAllDragDropShips(player1);
  screen.showPlaceShipsModal();
});
