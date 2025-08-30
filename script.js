class Node {
  constructor(data) {
    this.left = null;
    this.right = null;
    this.data = data;
  }
}
class Tree {
  constructor(arr) {
    this.arr = Array.from(new Set(arr.toSorted((a, b) => a - b)));
    this.root = this.binaryTree(this.arr);
  }
  binaryTree(arr) {
    if (arr.length === 1) {
      return new Node(arr[0]);
    }
    let mid = Math.floor(arr.length / 2);
    const root = new Node(arr[mid]);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid + 1);
    root.left = left.length ? this.binaryTree(left) : null;
    root.right = right.length ? this.binaryTree(right) : null;

    return root;
  }
  insert(value) {
    const node = new Node(value);
    let currentNode = this.root;
    while (true) {
      if (currentNode.data < value) {
        if (!currentNode.right) {
          currentNode.right = node;
          return;
        }
        currentNode = currentNode.right;
      } else if (currentNode.data > value) {
        if (!currentNode.left) {
          currentNode.left = node;
          return;
        }
        currentNode = currentNode.left;
      }
    }
  }
  deleteItem(value) {}
}
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};
const test = [1, 2, 9, 88, 99];
const ar = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
