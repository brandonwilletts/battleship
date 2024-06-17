export function screenController() {
  const placeShipsDialog = document.querySelector("#place-ships");
  const dialogBoardContainer = placeShipsDialog.firstChild;
  const endgameDialog = document.querySelector("#endgame");

  function renderBoard(gameboard, enemyBoard = false) {
    const board = gameboard.board;

    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board");

    for (let i = 0; i < board.length; i++) {
      const col = document.createElement("div");
      col.classList.add("board-col");
      boardContainer.appendChild(col);

      for (let j = 0; j < board[i].length; j++) {
        const squareBtn = document.createElement("button");
        squareBtn.classList.add("square");
        if (enemyBoard == true) {
          squareBtn.classList.add("enemy");
        }
        squareBtn.dataset.x = `${i}`;
        squareBtn.dataset.y = `${j}`;

        const square = board[i][j];

        if (square.status === "miss") squareBtn.classList.add("miss");
        else if (square.status === "hit") squareBtn.classList.add("hit");
        else if (square.status === "sunk") {
          squareBtn.classList.remove("hit");
          squareBtn.classList.add("sunk");
        } else if (
          square.status === null &&
          square.ship != null &&
          enemyBoard != true
        )
          squareBtn.classList.add("ship");
        else squareBtn.classList.add("empty");

        col.appendChild(squareBtn);
      }
    }
    return boardContainer;
  }

  function renderPlaceShips(player) {
    const board = renderBoard(player.gameboard);
    dialogBoardContainer.textContent = "";
    dialogBoardContainer.appendChild(board);
  }

  function showPlaceShipsModal() {
    placeShipsDialog.showModal();
  }

  function closePlaceShipsModal() {
    placeShipsDialog.close();
  }

  function showEndgameModal(message) {
    const h1 = endgameDialog.querySelector("h1");
    h1.textContent = message;
    endgameDialog.showModal();
  }

  function closeEndgameModal() {
    endgameDialog.close();
  }

  function hideStartScreen() {
    const startScreen = document.querySelector(".start-screen");
    startScreen.style.cssText = "display: none;";
  }

  function renderGameplay(player, enemy) {
    const gameplay = document.querySelector(".gameplay");
    gameplay.style.cssText = "display: flex;";

    const playerBoardContainer = document.querySelector("#player-board");
    playerBoardContainer.textContent = "";
    const playerBoard = renderBoard(player.gameboard);
    playerBoardContainer.appendChild(playerBoard);

    const enemyBoardContainer = document.querySelector("#enemy-board");
    enemyBoardContainer.textContent = "";
    const enemyBoard = renderBoard(enemy.gameboard, true);
    enemyBoardContainer.appendChild(enemyBoard);
  }

  return {
    renderBoard,
    renderPlaceShips,
    showPlaceShipsModal,
    closePlaceShipsModal,
    renderGameplay,
    hideStartScreen,
    showEndgameModal,
    closeEndgameModal,
  };
}
