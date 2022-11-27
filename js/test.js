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
    9: [2, 2]
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
    let p_sum = -1;
    let usedChildren = {}, it = 0;
    while(p_sum != 0) {
        let chosenChild = -1;
        // Pega os possíveis movimentos
        const {res, queue} = getPossibleBoards(p);
        const queueAux = new MinQueue(res.length);
        // Avalia os filhos dos possíveis caminhos
        // Pega o caminho com o melhor filho
        // Aplica-se o desempate pelo pai menos visitado
        for(let i = 0; i < res.length; i++){
            const b_val = queue.peekPriority();
            // Vê qual é o pai da melhor criança
            chosenChild = queue.pop();
            const r = res[chosenChild].toString();
            // Se esse pai nunca foi usado, vai nele
            if(usedChildren[r] == undefined)
                break;
            // Senão, vamos ver a próxima melhor criança, e pegar o pai dela
            queueAux.push(i, usedChildren[r] * b_val);
        }
        // Se nossas opções se esgotaram, pegamos o pai da melhor criança
        // De acordo com o nosso critério de desempate (já apresentado)
        if(queueAux.size == res.length)
            // chosenChild = queueAux.pop();
            chosenChild = Math.floor(Math.random() * res.length);

        const r = res[chosenChild].toString();
        if(usedChildren[r] === undefined)
            usedChildren[r] = 0;
        
        usedChildren[r] += 1;
        p = res[chosenChild];
        p_sum = sum_city_block(p);
        it += 1;
    }

    return {board: p, it: it};
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

function greedy_depth_two(puzzle) {
    let p = deepCopy2D(puzzle);
    let p_sum = -1;
    let usedChildren = {}, it = 0;
    while(p_sum != 0) {
        let chosenChild = -1;
        // Pega os possíveis movimentos
        const {parents, res, queue} = get_grandchildren(p);
        const queueAux = new MinQueue(res.length);
        // Avalia os filhos dos possíveis caminhos
        // Pega o caminho com o melhor filho
        // Aplica-se o desempate pelo pai menos visitado
        for(let i = 0; i < res.length; i++){
            const b_val = queue.peekPriority();
            // Vê qual é o pai da melhor criança
            chosenChild = queue.pop();
            const r = res[chosenChild].board.toString();
            // Se esse pai nunca foi usado, vai nele
            if(usedChildren[r] == undefined)
                break;
            // Senão, vamos ver a próxima melhor criança, e pegar o pai dela
            queueAux.push(i, usedChildren[r] * b_val);
        }
        // Se nossas opções se esgotaram, pegamos o pai da melhor criança
        // De acordo com o nosso critério de desempate (já apresentado)
        if(queueAux.size == res.length) {
            //chosenChild = queueAux.pop();
            chosenChild = Math.floor(Math.random() * res.length);
        }

        const r = res[chosenChild].board.toString();
        if(usedChildren[r] === undefined)
            usedChildren[r] = 0;
        
        usedChildren[r] += 1;
        p = parents[res[chosenChild].parent];
        p_sum = sum_city_block(p);
        it += 1;
    }

    return {board: p, it: it};
}

/*
    Para o A*, achamos melhor implementar uma classe,
    para melhor visualizar as propriedades de cada nó.
    Ademais, como a busca agora é diferente, a quantidade de movimentos
    não é mais simplesmente (nº de interções + 1).
*/
class BoardLeaf {
    constructor(board, parent) {
        this.board = board;
        this.parent = parent;
        this.g = 0;
        if(parent !== undefined)
            this.g = parent.g + 1;
        this.h = sum_city_block(board);
    }

    get f() {
        return this.g + this.h;
    }

    get children() {
        const {res,} = getPossibleBoards(this.board);
        return res.map(b => new BoardLeaf(b, this));
    }

    get path() {
        let path = [];
        let current = this;
        while(current !== undefined) {
            path.push(current);
            current = current.parent;
        }
        return path;
    }
}

function a_star(puzzle) {
    let p = new BoardLeaf(puzzle);
    let i = 1;
    let it = 0;

    // Array com os nós já abertos
    let used = [p];
    const queue = new MinQueue(3628800);

    // A variável p_sum, neste caso, é desnecessária, visto que p.h já indica
    // se o tabuleiro é o final ou não
    while(p.h != 0) {
        const children = p.children;
        // Coloca os filhos de p na fila
        children.forEach(c => {
            used.push(c);
            queue.push(i, c.f);
            i++;
        });
        // Pega o nó com menor f
        p = used[queue.pop()];
        it++;
    }

    return {board: p.board, it: it, path: p.path};
}

// Function to shuffle the board, preventing it from being already solved
function shuffle(board, number_of_shuffles) {
    let i = 0;
    let last_move = -1;
    while(i < number_of_shuffles) {
        const moves = getPossibleBoards(board).res;
        const move = Math.floor(Math.random() * moves.length);
        if(moves[move].toString() != last_move) {
            board = moves[move];
            last_move = moves[move].toString();;
            i++;
        }
    }
    return board;
}

obj = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

obj = shuffle(obj, 100);

let res, res2, res3;
setTimeout(function(){
    res = greedy_depth_one(obj);
    console.log("\nGreedy Heurística 1");
    console.table(res.board);
    console.log(res.it + 1, "movimentos");
}, 0);

setTimeout(function(){
    res2 = greedy_depth_two(obj);
    console.log("\nGreedy Heurística 2");
    console.table(res2.board);
    console.log(res2.it + 1, "movimentos");
}, 0);

setTimeout(function(){
    res3 = a_star(obj);
    console.log("\nA*");
    console.table(res2.board);
    console.log(Object.keys(res3.path).length - 1, "movimentos");
}, 0);