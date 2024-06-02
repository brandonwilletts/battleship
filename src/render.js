const boardContainer = document.querySelector(".board");

export function renderBoard(board) {
  for (let i = 0; i < board.length; i++) {
    const col = document.createElement("div");
    col.classList.add("board-col");
    boardContainer.appendChild(col);

    for (let j = 0; j < board[i].length; j++) {
      const square = document.createElement("button");
      square.textContent = `${i}, ${j}`;
      square.classList.add("square");
      square.dataset.x = `${i}`;
      square.dataset.y = `${j}`;

      switch (board[i][j]) {
        case 0:
          square.classList.add("empty");
          break;
        case "miss":
          square.classList.add("miss");
          break;
        case "hit":
          square.classList.add("hit");
          break;
        case "sunk":
          square.classList.add("sunk");
          break;
        default:
          square.classList.add("ship");
          break;
      }
      col.appendChild(square);
    }
  }
}

export function deleteBoard() {
  boardContainer.textContent = "";
}

export function setAlert(string) {
  const alert = document.querySelector(".alert");
  alert.textContent = string;
}
