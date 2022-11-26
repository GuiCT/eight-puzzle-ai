const {MinQueue} = require("heapify");

let obj;

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

// Função utilitária - retorna a posição do valor mínimo do array
function minFrom(arr) {
    return arr.indexOf(Math.min.apply(null, arr));
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
function getPossibleBoards(p) {
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

function greedy_depth_one(puzzle) {
    let p = deepCopy2D(puzzle);
    // Soma dist. city block p/ matriz principal
    let p_sum = -1;
    /*
        É necessário um critério par quebra de loop quando todos
        os filhos de um nó já foram visitados, mas precisa continuar a busca.
        Neste caso, "ranqueamos" os nós visitados por nº de visitas e decidimos
        continuara pusca pelo menos visitado.
    */
    let usedBoards = {};
    let it = 0;
    while(p_sum != 0) {
        // Pega os possíveis movimentos
        const res = getPossibleBoards(p);
        // Avalia eles por city block
        const queue = new MinQueue(res.length);
        for(let i = 0; i < res.length; i++) {
            queue.push(i, sum_city_block(res[i]));
        }
        // Segunda fila, para possibilidades já usadas. Pode ser necesária.
        const queueAux = new MinQueue(res.length);

        // Pega o melhor, aparentemente (nível 1), dos possíveis caminhos
        let next = -1;

        // Se todos os caminhos já foram visitados: desempata.
        // Critério de desempate: número de visitas * valor do caminho (original, não absurdo)
        for(let i = 0; i < res.length; i++) {
            const b_val = queue.peekPriority();
            next = queue.pop();
            const r = res[next].toString();
            if(usedBoards[r] == undefined)
                break;
            queueAux.push(i, usedBoards[r] * b_val);
        }

        // Tudo repetida
        if(queueAux.size == res.length)
            next = queueAux.pop()

        // Adiciona o tabuleiro escolhido aos tabuleiros já utilizados
        const r = res[next].toString();
        if(usedBoards[r] === undefined){
            usedBoards[r] = 0;
        }

        usedBoards[r] += 1;
        // Troca p pelo escolhido e reavalia a soma
        p = res[next];
        p_sum = sum_city_block(p);
        it += 1;
    }

    return {board: p, it: it};
}

obj = [
    [8,7,0],
    [2,4,6],
    [1,5,3]
];

let res = greedy_depth_one(obj);
console.table(obj);
console.table(res.board);
console.log(res.it, "iterações");

/*const queue = new MinQueue();
queue.push(1, 2);
queue.push(1, 3);
console.log(queue)*/