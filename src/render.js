const boardContainer = document.querySelector(".board");

export function renderBoard(board) {
  for (let i = 0; i < board.length; i++) {
    const col = document.createElement("div");
    col.classList.add("board-col");
    boardContainer.appendChild(col);

    for (let j = 0; j < board[i].length; j++) {
      const squareBtn = document.createElement("button");
      squareBtn.classList.add("square");
      squareBtn.dataset.x = `${i}`;
      squareBtn.dataset.y = `${j}`;

      const square = board[i][j];

      if (square.status === "miss") squareBtn.classList.add("miss");
      else if (square.status === "hit") squareBtn.classList.add("hit");
      else if (square.status === "sunk") {
        squareBtn.classList.remove("hit");
        squareBtn.classList.add("sunk");
      } else if (square.status === null && square.ship != null)
        squareBtn.classList.add("ship");
      else squareBtn.classList.add("empty");

      col.appendChild(squareBtn);
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
