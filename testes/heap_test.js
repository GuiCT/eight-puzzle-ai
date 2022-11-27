const {MinQueue} = require("heapify");

const queue = new MinQueue();

queue.push(0, 3);
queue.push(1, 15);

console.log(queue.peekPriority(), queue.pop());