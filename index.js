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

// Função que encontra o espaço vazio de uma matriz
// (Onde o valor é igual a 9)
const findEmptyPosition = (matrixValues) => {
  for (let i = 0; i < matrixValues.length; i++) {
    for (let j = 0; j < matrixValues[i].length; j++) {
      if (matrixValues[i][j] === 9) return [i, j];
    }
  }
};

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
  const allowedDirections = [false, false, false, false];
  // Encontrar onde está o espaço vazio (9)
  const emptyPosition = findEmptyPosition(matrixValues);

  // Verificar quais direções são válidas
  allowedDirections[0] = emptyPosition[0] > 0;
  allowedDirections[1] = emptyPosition[1] < 2;
  allowedDirections[2] = emptyPosition[0] < 2;
  allowedDirections[3] = emptyPosition[1] > 0;

  // Para cada movimento possível, incluir o índice em um array
  // Esse array é retornado
  return allowedDirections
    .map((value, index) => (value ? index : null))
    .filter((value) => value != null);
};

// Função que atualiza uma determinada matriz de acordo
// com o movimento realizado.
// Essa função não gera uma nova matriz.
const updateMatrix = (matrixValues, moveDirection) => {
  // Encontrar onde está o espaço vazio (9)
  const emptyPosition = findEmptyPosition(matrixValues);
  // Se o movimento não é permitido, retorna a matriz inicial
  if (getAllPossibleMoves(matrixValues).indexOf(moveDirection) == -1)
    return matrixValues;
  // Realizar o movimento
  if (moveDirection === 0) {
    // Cima
    matrixValues[emptyPosition[0]][emptyPosition[1]] =
      matrixValues[emptyPosition[0] - 1][emptyPosition[1]];
    matrixValues[emptyPosition[0] - 1][emptyPosition[1]] = 9;
  } else if (moveDirection === 1) {
    // Direita
    matrixValues[emptyPosition[0]][emptyPosition[1]] =
      matrixValues[emptyPosition[0]][emptyPosition[1] + 1];
    matrixValues[emptyPosition[0]][emptyPosition[1] + 1] = 9;
  } else if (moveDirection === 2) {
    // Baixo
    matrixValues[emptyPosition[0]][emptyPosition[1]] =
      matrixValues[emptyPosition[0] + 1][emptyPosition[1]];
    matrixValues[emptyPosition[0] + 1][emptyPosition[1]] = 9;
  } else if (moveDirection === 3) {
    // Esquerda
    matrixValues[emptyPosition[0]][emptyPosition[1]] =
      matrixValues[emptyPosition[0]][emptyPosition[1] - 1];
    matrixValues[emptyPosition[0]][emptyPosition[1] - 1] = 9;
  }
  // Retornar a referência para a mesma matriz.
  return matrixValues;
};

// Função que atualiza uma determinada matriz de acordo
// com o movimento realizado.
// Essa função GERA uma nova matriz.
const updateMatrixNew = (matrixValues, moveDirection) => {
  // Realiza uma cópia da matriz
  const newMatrixValues = matrixValues.map((row) => row.map((value) => value));
  // Atualiza a matriz copiada
  return updateMatrix(newMatrixValues, moveDirection);
};

// Função que verifica se duas matrizes são iguais
const areMatricesEqual = (matrix1, matrix2) => {
  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix1[i].length; j++) {
      if (matrix1[i][j] != matrix2[i][j]) return false;
    }
  }
  return true;
};

// Função que gera uma matriz aleatória 3x3
// Com valores de 1 a 9, sem repetição
const generateRandomMatrix = (numberOfMoves) => {
  const generatedMatrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  for (let i = 0; i < numberOfMoves; i++) {
    const possibleMoves = getAllPossibleMoves(generatedMatrix);
    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    updateMatrix(generatedMatrix, randomMove);
  }
  return generatedMatrix;
};

//#region Solvers

// Função que resolve o puzzle utilizando algoritmo guloso
const greedySolution = (initialMatrix) => {
  const states = [];
  const visitedStates = [initialMatrix];
  let currentState = initialMatrix;
  let currentStateDistance = totalDistance(currentState);
  while (currentStateDistance > 0) {
    // Obtêm todos os movimentos possíveis, e:
    // Remove os estados já visitados.
    // Os ordena por score (distância) de forma ascendente.

    // Movimentos permitidos
    const possibleMoves = getAllPossibleMoves(currentState);

    // Matrizes geradas a partir desses movimentos
    const possibleMatrices = possibleMoves.map((move) =>
      updateMatrixNew(currentState, move)
    );

    // Matrizes geradas a partir desses movimentos, sem as já visitadas, e ordenadas por score
    const possibleMatricesAllowedOrdered = possibleMatrices
      .filter(
        (matrix) =>
          !visitedStates.some((visitedMatrix) =>
            areMatricesEqual(visitedMatrix, matrix)
          )
      )
      .sort(
        (matrix1, matrix2) => totalDistance(matrix1) - totalDistance(matrix2)
      );

    // Se houver matrizes permitidas, escolher a melhor
    if (possibleMatricesAllowedOrdered.length) {
      currentState = possibleMatricesAllowedOrdered[0];
      currentStateDistance = totalDistance(currentState);
      states.push(currentState);
      visitedStates.push(currentState);
    }
    // Caso contrário, utilizar uma das matrizes mas de forma randômica
    else {
      currentState =
        possibleMatrices[Math.floor(Math.random() * possibleMatrices.length)];
      currentStateDistance = totalDistance(currentState);
      states.push(currentState);
    }
    updateBoard(currentState);
  }
  return states;
};

//#endregion Solvers

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
const children = boardElement.children;

// Função que atualiza o tabuleiro e a representação visual
// useState hook do React na marra. Passa a matriz inteira.
const updateBoard = (matrixValues) => {
  // Cada child do tabuleiro é um valor

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = matrixValues[i][j];
      children[positionToIndex(i, j)].innerText =
        matrixValues[i][j] == 9 ? "" : matrixValues[i][j];
    }
  }
};

// A partir do movimento realizado, atualiza a representação visual
// Função evita ter que atualizar o tabuleiro inteiro a cada movimento.
const updateBoardOneMove = (direction) => {
  const emptyPosition = findEmptyPosition(board);

  if (direction == 0) {
    // Movendo o espaço vazio para cima,
    // valor acima vai para baixo.
    children[positionToIndex(emptyPosition[0], emptyPosition[1])].innerText =
      board[emptyPosition[0] - 1][emptyPosition[1]];
    children[
      positionToIndex(emptyPosition[0] - 1, emptyPosition[1])
    ].innerText = "";
  } else if (direction == 1) {
    // Movendo o espaço vazio para direita,
    // valor à direita vai para esquerda.
    children[positionToIndex(emptyPosition[0], emptyPosition[1])].innerText =
      board[emptyPosition[0]][emptyPosition[1] + 1];
    children[
      positionToIndex(emptyPosition[0], emptyPosition[1] + 1)
    ].innerText = "";
  } else if (direction == 2) {
    // Movendo o espaço vazio para baixo,
    // valor abaixo vai para cima.
    children[positionToIndex(emptyPosition[0], emptyPosition[1])].innerText =
      board[emptyPosition[0] + 1][emptyPosition[1]];
    children[
      positionToIndex(emptyPosition[0] + 1, emptyPosition[1])
    ].innerText = "";
  } else if (direction == 3) {
    // Movendo o espaço vazio para esquerda,
    // valor à esquerda vai para direita.
    children[positionToIndex(emptyPosition[0], emptyPosition[1])].innerText =
      board[emptyPosition[0]][emptyPosition[1] - 1];
    children[
      positionToIndex(emptyPosition[0], emptyPosition[1] - 1)
    ].innerText = "";
  }

  updateMatrix(board, direction);
};

// Inicializando a matriz com os valores na variável board
updateBoard(board);
//#endregion Initialization
