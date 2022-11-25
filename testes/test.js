let p = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

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

// Função utilitária - checa se o tabuleiro pode ser resolvido
// Baseado em: https://math.stackexchange.com/questions/293527/how-to-check-if-a-8-puzzle-is-solvable
function isSolvable(b) {
    let bf = b.flat();
    bf.splice(bf.indexOf(9), 1); // Remove o elemento vazio

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
    mov.forEach(m => {
        let auxP = deepCopy2D(p);
        aux = auxP[m[0]][m[1]];
        auxP[m[0]][m[1]] = 9;
        auxP[i][j] = aux;
        b.push(auxP);
    });

    return b;
}

let res = getPossibleBoards();
res.forEach(board => {
    console.table(board)
})