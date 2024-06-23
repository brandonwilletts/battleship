export function screenController() {
  const placeShipsDialog = document.querySelector("#place-ships");
  const dialogBoardContainer = document.querySelector("#place-ships-board");
  const endgameDialog = document.querySelector("#endgame");
  const enemyAlert = document.querySelector("#enemy-alert");
  const playerAlert = document.querySelector("#player-alert");
  const shipsContainer = document.querySelector("#ships-container");
  const orientationButton = document.querySelector("#orientation-btn");
  const gameplay = document.querySelector(".gameplay");
  const playerBoardContainer = document.querySelector("#player-board");
  const enemyBoardContainer = document.querySelector("#enemy-board");

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

  function renderDragDropShip(ship) {
    const shipDiv = document.createElement("div");
    shipDiv.setAttribute("id", ship.name);
    shipDiv.classList.add("drag-and-drop", "board");
    for (let i = 0; i < ship.length; i++) {
      const square = document.createElement("div");
      square.classList.add("square", "ship");
      shipDiv.appendChild(square);
    }

    const name = document.createElement("div");
    name.classList.add("ship-label");
    name.textContent = ship.name;

    const shipContainer = document.createElement("div");
    shipContainer.appendChild(name);
    shipContainer.appendChild(shipDiv);

    return shipContainer;
  }

  function renderAllDragDropShips(player) {
    shipsContainer.textContent = "";
    for (let i = 0; i < player.gameboard.ships.length; i++) {
      if (player.gameboard.ships[i].placed === false) {
        const ship = renderDragDropShip(player.gameboard.ships[i]);
        shipsContainer.appendChild(ship);
      }
    }
    addEventListenersToDragDropShips(player);
  }

  function clearDragDropShips() {
    shipsContainer.textContent = "";
  }

  function renderPlaceShipsBoard(player) {
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
    const h2 = endgameDialog.querySelector("h2");
    h2.textContent = message;
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
    gameplay.style.cssText = "display: flex;";

    playerBoardContainer.textContent = "";
    const playerBoard = renderBoard(player.gameboard);
    playerBoardContainer.appendChild(playerBoard);

    enemyBoardContainer.textContent = "";
    const enemyBoard = renderBoard(enemy.gameboard, true);
    enemyBoardContainer.appendChild(enemyBoard);

    playerAlert.textContent = player.gameboard.getAlert();
    enemyAlert.textContent = enemy.gameboard.getAlert();
  }

  function clearGameplay() {
    gameplay.style.cssText = "display: none;";
    playerBoardContainer.textContent = "";
    enemyBoardContainer.textContent = "";
    playerAlert.textContent = "";
    enemyAlert.textContent = "";
  }

  function addEventListenersToDragDropShips(player) {
    const ships = document.querySelectorAll(".drag-and-drop");
    const board = document.querySelector("#place-ships-board > .board");
    let selectedElement;
    let selectedShip;

    for (const ship of ships) {
      ship.addEventListener("click", (event) => {
        ships.forEach((item) => item.classList.remove("selected-ship"));
        selectedElement = event.target.parentElement;
        selectedElement.classList.add("selected-ship");
        selectedShip = player.gameboard.ships.find(
          (ship) => ship.name == selectedElement.getAttribute("id")
        );
        selectedShip.setOrientation("horizontal");
        orientationButton.textContent = "Flip Vertical";
      });
    }

    orientationButton.addEventListener("click", (event) => {
      if (selectedShip) {
        selectedShip.toggleOrientation();
        if (selectedShip.getOrientation() == "horizontal") {
          orientationButton.textContent = "Flip Vertical";
        } else {
          orientationButton.textContent = "Flip Horizontal";
        }
      }
    });

    board.addEventListener("mouseover", (event) => {
      const x = event.target.dataset.x;
      const y = event.target.dataset.y;
      const coordinates = [x, y];

      if (selectedShip) {
        if (player.gameboard.shipPlacementIsValid(selectedShip, coordinates)) {
          if (selectedShip.orientation == "horizontal") {
            for (let i = 0; i < selectedShip.length; i++) {
              let coordX = Number(x) + i;
              let square = document.querySelector(
                `[data-x="${coordX}"][data-y="${y}"]`
              );
              square.classList.add("place-ship-hover");
              square.classList.remove("empty");
            }
          } else {
            for (let i = 0; i < selectedShip.length; i++) {
              let coordY = Number(y) + i;
              let square = document.querySelector(
                `[data-x="${x}"][data-y="${coordY}"]`
              );
              square.classList.add("place-ship-hover");
              square.classList.remove("empty");
            }
          }
        }
      }
    });

    board.addEventListener("mouseout", (event) => {
      const x = event.target.dataset.x;
      const y = event.target.dataset.y;
      const coordinates = [x, y];

      if (selectedShip) {
        if (player.gameboard.shipPlacementIsValid(selectedShip, coordinates)) {
          if (selectedShip.orientation == "horizontal") {
            for (let i = 0; i < selectedShip.length; i++) {
              let coordX = Number(x) + i;
              let square = document.querySelector(
                `[data-x="${coordX}"][data-y="${y}"]`
              );
              square.classList.remove("place-ship-hover");
              square.classList.add("empty");
            }
          } else {
            for (let i = 0; i < selectedShip.length; i++) {
              let coordY = Number(y) + i;
              let square = document.querySelector(
                `[data-x="${x}"][data-y="${coordY}"]`
              );
              square.classList.remove("place-ship-hover");
              square.classList.add("empty");
            }
          }
        }
      }
    });

    board.addEventListener("click", (event) => {
      const x = event.target.dataset.x;
      const y = event.target.dataset.y;
      const coordinates = [x, y];

      if (selectedShip) {
        if (player.gameboard.shipPlacementIsValid(selectedShip, coordinates)) {
          player.gameboard.placeShip(selectedShip, coordinates);
          selectedShip.setPlaced(true);
          renderPlaceShipsBoard(player);
          renderAllDragDropShips(player);
        }
      }

      selectedElement = null;
      selectedShip = null;
    });
  }

  return {
    renderBoard,
    renderPlaceShipsBoard,
    showPlaceShipsModal,
    closePlaceShipsModal,
    renderGameplay,
    hideStartScreen,
    showEndgameModal,
    closeEndgameModal,
    renderAllDragDropShips,
    clearDragDropShips,
    clearGameplay,
  };
}
