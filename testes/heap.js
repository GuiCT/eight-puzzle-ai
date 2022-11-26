const { MinQueue } = Heapify;

// 9! = 362880
const queue = new MinQueue(362880, [], [], BigUint64Array, Uint32Array);
queue.push(new TextEncoder("utf-8").encode("banana"), 10);
queue.push(new TextEncoder("utf-8").encode("batata"), 15);

console.log(queue);