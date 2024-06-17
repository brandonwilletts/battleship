import "./style.css";
import { screenController } from "./screen";
import { Player } from "./player";

const player = new Player();
const cpu = new Player(false);

const screen = screenController();

const startButton = document.querySelector("#start-btn");
startButton.addEventListener("click", () => {
  player.gameboard.placeAllShipsRandom();
  screen.hideStartScreen();
  screen.renderPlaceShips(player);
  screen.showPlaceShipsModal();
});

const randomizeButton = document.querySelector("#randomize");
randomizeButton.addEventListener("click", () => {
  player.gameboard.placeAllShipsRandom();
  screen.renderPlaceShips(player);
});

const playButton = document.querySelector("#play-btn");
playButton.addEventListener("click", () => {
  enemyAlert.textContent = "";
  playerAlert.textContent = "";
  cpu.gameboard.placeAllShipsRandom();
  screen.closePlaceShipsModal();
  screen.renderGameplay(player, cpu);
});

const enemyBoard = document.querySelector("#enemy-board");
const enemyAlert = document.querySelector("#enemy-alert");
const playerAlert = document.querySelector("#player-alert");
enemyBoard.addEventListener("click", (event) => {
  const square = event.target;
  const playerAttack = cpu.gameboard.receiveAttack([
    square.dataset.x,
    square.dataset.y,
  ]);
  if (playerAttack) {
    enemyAlert.textContent = playerAttack;
    screen.renderGameplay(player, cpu);

    if (cpu.gameboard.allSunk()) {
      screen.showEndgameModal("You win!");
    } else {
      let cpuAttack = player.gameboard.receiveAttack(
        player.gameboard.getRandomCoordinates()
      );
      while (!cpuAttack) {
        cpuAttack = player.gameboard.receiveAttack(
          player.gameboard.getRandomCoordinates()
        );
      }
      playerAlert.textContent = cpuAttack;
      screen.renderGameplay(player, cpu);

      if (player.gameboard.allSunk()) {
        screen.showEndgameModal("You lose!");
      }
    }
  }
});

const playAgainButton = document.querySelector("#play-again");
playAgainButton.addEventListener("click", () => {
  cpu.gameboard.resetBoard();
  player.gameboard.resetBoard();
  player.gameboard.placeAllShipsRandom();
  screen.closeEndgameModal();
  screen.renderPlaceShips(player);
  screen.showPlaceShipsModal();
});
