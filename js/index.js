const spnRes = document.querySelector(".spnResultado"),
spnMetodo = document.querySelector(".spnMetodo"),
spnMov = document.querySelector(".spnMov"),
met_map = {
  "greedy_one": "Análise em um nível",
  "greedy_two": "Análise em dois níveis",
  "astar": "A*"
};

// Valor do tabuleiro, método a ser utilizado e número de embaralhamento, em estrutura de dados
let frontBoard = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
], metodo = "greedy_one", n_mov = 20;

// Exibe a matrix 3x3 na tela
function boardToFront() {
  let bf = frontBoard.flat();
  const gridElements = document.querySelectorAll(".grid8 > div");
  for(let i = 0; i < bf.length; i++) {
    gridElements[i].innerHTML = bf[i];
  }
  gridElements[bf.indexOf(9)].innerHTML = "";
}

// Exibe a matriz padrão
boardToFront();

// Sempre que o usuário mudar o método, atualizar a variável que o guarda
document.querySelector("fieldset").addEventListener("change", (e) => {metodo = e.target.value});

// Sempre que o usuário mudar o número de embaralhamento, atualizar a variável que o guarda
document.querySelector("#nshuffle").addEventListener("input", (e) => {
  n_mov = e.target.value;
  document.querySelector(".ns > span").innerHTML =  e.target.value;
});

// Embaralha o tabuleiro
function shuffleBoard() {
  frontBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ];
  frontBoard = shuffle(frontBoard, n_mov);
  boardToFront();

  spnRes.innerHTML = "embaralhado";
  spnRes.classList.add("errado");
  spnMov.innerHTML = n_mov;
  spnMetodo.innerHTML = "-";
}

// Resolve o tabuleiro, de acordo com o método escolhido pelo usuário
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
  spnRes.classList.remove("errado");
  spnRes.innerHTML = "solucionado";
  spnMov.innerHTML = n_mov;
  spnMetodo.innerHTML = met_map[metodo];
  //alert(`Tabuleiro solucionado!\nForam necessários ${n_mov} movimentos`);
}