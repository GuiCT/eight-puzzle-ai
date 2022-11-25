let p = [
    [1, 2, 3],
    [5, 6, 0],
    [7, 8, 4]
];

// Tabuleiro "objetivo" (onde se quer chegar)
/*let goal = [
    [1, 2, 3],
    [5, 6, 0],
    [7, 8, 4]
];*/

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
    0: [2, 2]
};

/*
    As gambiarras nas funções utilitárias não são nossa culpa.
    JS não possui algumas funcionalidades muito básicas, ao passo em que
    possui coisas funcionalidades complexas.
*/

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

// Checa se o tabuleiro pode ser resolvido
// Baseado em: https://math.stackexchange.com/questions/293527/how-to-check-if-a-8-puzzle-is-solvable
function isSolvable(b) {
    let bf = b.flat();
    bf.splice(bf.indexOf(0), 1); // Remove o elemento vazio

    let inv = 0; // Número de inversões possíveis
    for(let i = 0; i < 8; i++) {
        for(let j = i + 1; j < 8; j++) {
            if(bf[j] > bf[i]) {
                inv++;
            }
        }
    }

    return (inv % 2 === 0);
}

// Obtém todos os movimentos possíveis a partir do tabuleiro atual
function getPossibleBoards() {
    // Posição do espaço vazio
    let [i, j] = indexOf2D(p, 0);
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
    mov.forEach(m => {
        let auxP = deepCopy2D(p);
        aux = auxP[m[0]][m[1]];
        auxP[m[0]][m[1]] = 0;
        auxP[i][j] = aux;
        b.push(auxP);
    });

    return b;
}

/*
    Retorna a soma das distâncias City Block (Manhattan, L1) dos números
    até a casa onde deveriam estar. Considera-se esse um
    bom método de avaliação para ver se o puzzle está mais
    perto ou não de ser resolvido.
    Fonte: https://science.slc.edu/~jmarshall/courses/2005/fall/cs151/lectures/heuristic-search/
*/
function city_block(b) {
    let sum = 0;
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            let [goalI, goalJ] = goal[b[i][j]];
            sum += Math.abs(i - goalI) + Math.abs(j - goalJ);
        }
    }
    return sum;
}

let res = getPossibleBoards();
res.forEach(board => {
    console.table(board)
    console.log(isSolvable(board))
})