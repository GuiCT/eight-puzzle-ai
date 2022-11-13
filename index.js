// Declaração de funções
//#region Declarations

// Converter posição (i, j) para índice de 0 a 9
const positionToIndex = (i, j) => 3 * i + j;
// Converter índice de 0 a 9 em posição (i, j)
const indexToPosition = (index) => [Math.floor(index / 3), index % 3];

// Função que calcula a soma das distâncias absolutas de uma matriz
// Utilizado como parâmetro para a resolução do problema
const totalDistance = (matrixValues) =>
  // Para cada entrada na matriz, verificar a diferença da posição atual para a ideal
  // Soma distância calculada atual a distância da linha
  matrixValues.reduce(
    (accumulatedDistance, row, i) =>
      accumulatedDistance +
      // Soma distância da linha
      row.reduce((accumulatedRowDistance, value, j) => {
        const idealPosition = indexToPosition(value - 1);
        const distanceToIdeal =
          Math.abs(idealPosition[0] - i) + Math.abs(idealPosition[1] - j);
        return accumulatedRowDistance + distanceToIdeal;
      }, 0),
    0
  );

// Função que retorna todas os movimentos válidos
// Retorna todas as matrizes resultantes possíveis
const getAllPossibleMoves = (matrixValues) => {
  // Direções possíveis, inicializando todas como falso.
  // Cima, Direita, Baixo e Esquerda
  // Sempre em relação a um valor adjacente ao vazio
  // Exemplo: Cima
  /*
    1 2 3    1 2 3
    4 5 6 -> 4 5 9
    7 8 9    7 8 6
  */
  const allowedDirections = [false, false, false, false]
  // Encontrar onde está o espaço vazio (9)
  const emptyPosition = [2, 2];
  outer_loop:
  for (let i = 0; i < matrixValues.length; i++) {
    for (let j = 0; j < matrixValues[i].length; j++) {
      if (matrixValues[i][j] == 9) {
        emptyPosition = [i, j];
        break outer_loop;
      }
    }
  }

  // Verificar quais direções são válidas
  if (emptyPosition[0] > 0)
    allowedDirections[0] = true;
  if (emptyPosition[1] < 2)
    allowedDirections[1] = true;
  if (emptyPosition[0] < 2)
    allowedDirections[2] = true;
  if (emptyPosition[1] > 0)
    allowedDirections[3] = true;
  
  // TODO: montar matrizes a partir dos movimentos possíveis.
  // allowedDirections.foreach...
}

//#endregion Declarations

// Inicializando o tabuleiro/matriz
//#region Initialization

// Estado inicial da matriz. Utilizando 9 para espaço vazio
const board = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Tag <div> com a tabuleiro
const boardElement = document.getElementsByClassName("grid8")[0];

// Função que atualiza o tabuleiro e a representação visual
// useState hook do React na marra.
const updateBoard = (matrixValues) => {
  // Cada child do tabuleiro é um valor
  const children = boardElement.children;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = matrixValues[i][j];
      children[positionToIndex(i, j)].innerText =
        matrixValues[i][j] == 9 ? "" : matrixValues[i][j];
    }
  }
};

// Inicializando a matriz com os valores na variável board
updateBoard(board);

//#endregion Initialization
