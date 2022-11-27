let frontBoard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

let metodo = "greedy_one";

function boardToFront() {
  let bf = frontBoard.flat();
  const gridElements = document.querySelectorAll(".grid8 > div");
  for(let i = 0; i < bf.length; i++) {
    gridElements[i].innerHTML = bf[i];
  }
  gridElements[bf.indexOf(9)].innerHTML = "";
}

boardToFront();

document.querySelector("fieldset").addEventListener("change", (e) => {metodo = e.target.value});

function shuffleBoard() {
  frontBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  frontBoard = shuffle(frontBoard, 50);
  boardToFront();
}

function solveBoard() {
  if(frontBoard.toString() === "1,2,3,4,5,6,7,8,9") {
    alert("O tabuleiro já está solucionado.");
    return;
  }

  let res, n_mov;
  switch(metodo){
    case "greedy_one":
      res = greedy_depth_one(frontBoard);
      n_mov = res.it + 1;
      break;
    case "greedy_two":
      res = greedy_depth_two(frontBoard);
      n_mov = res.it + 1;
      break;
    case "astar":
      res = a_star(frontBoard);
      n_mov = Object.keys(res.path).length - 1;
      break;
    default:
      alert("Erro desconhecido");
      return;
  }

  frontBoard = res.board;
  boardToFront();
  alert(`Tabuleiro solucionado!\nForam necessários ${n_mov} movimentos`);
}