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