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
        const {res,} = getPossibleBoards(this.board, 'city_block');
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