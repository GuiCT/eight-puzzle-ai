const { MinQueue } = Heapify;

// Posições objetivo para cada número
let goal = {
    1: [0, 0],
    2: [0, 1],
    3: [0, 2],
    4: [1, 0],
    5: [1, 1],
    6: [1, 2],
    7: [2, 0],
    8: [2, 1],
    9: [2, 2]
};

// Função utilitária - indexOf 2D
function indexOf2D(arr, k) {
    for (var i = 0; i < arr.length; i++) {
        var index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
}

// Função utilitária - cópia profunda de um array 2d
function deepCopy2D(arr) {
    return JSON.parse(JSON.stringify(arr));
}

/*
    Retorna a soma das distâncias City Block (Manhattan, L1) dos números
    até a casa onde deveriam estar. Considera-se esse um
    bom método de avaliação para ver se o puzzle está mais
    perto ou não de ser resolvido.
    Fonte: https://science.slc.edu/~jmarshall/courses/2005/fall/cs151/lectures/heuristic-search/
*/
function sum_city_block(b) {
    let sum = 0;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            let [goalI, goalJ] = goal[b[i][j]];
            sum += Math.abs(i - goalI) + Math.abs(j - goalJ);
        }
    }
    return sum;
}

// Obtém todos os movimentos possíveis a partir do tabuleiro atual
// Retorna os movimentos e uma fila com os melhores
function getPossibleBoards(p) {
    // Posição do espaço vazio
    let [i, j] = indexOf2D(p, 9);
    // Há métodos mais econômicos de se fazer isso
    // Possíveis novas localizações para o espaço vazio
    let mov = [
        [i, j + 1],
        [i, j - 1],
        [i + 1, j],
        [i - 1, j]
    ].filter(a => (!a.includes(-1) && !a.includes(3)));
    // b = possíveis resultados
    // o restante é uma funçaõ simples de troca,
    // mas que mantém a matriz original "p" intacta
    let b = [], aux;
    const queue = new MinQueue(mov.length);
    for(let v = 0; v < mov.length; v++) {
        let auxP = deepCopy2D(p);
        aux = auxP[mov[v][0]][mov[v][1]];
        auxP[mov[v][0]][mov[v][1]] = 9;
        auxP[i][j] = aux;
        b.push(auxP);
        queue.push(v, sum_city_block(auxP));
    }

    return {res: b, queue: queue};
}

function get_grandchildren(puzzle) {
    const {res,} = getPossibleBoards(puzzle);
    const gcQueue = new MinQueue(res.length * 4);
    let gc = [];
    for(let i = 0; i < res.length; i++) {
        getPossibleBoards(res[i]).res.forEach(b => {
            gc.push({parent: i, board: b})
            gcQueue.push(gc.length - 1, sum_city_block(b));
        });
    }
    return {parents: res, res: gc, queue: gcQueue};
}

// Função para embaralhar o tabuleiro
function shuffle(board, number_of_shuffles) {
    let i = 0;
    let last_move = -1;
    while(i < number_of_shuffles) {
        const moves = getPossibleBoards(board).res;
        const move = Math.floor(Math.random() * moves.length);
        if(moves[move].toString() != last_move) {
            board = moves[move];
            last_move = moves[move].toString();
            i++;
        }
    }
    return board;
  }