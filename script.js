class Node {
  constructor(data) {
    this.left = null;
    this.right = null;
    this.data = data;
  }
}
class Tree {
  constructor(arr) {
    this.root = this.buildTree(
      Array.from(new Set(arr.toSorted((a, b) => a - b))),
    );
  }
  buildTree(arr) {
    if (!arr.length) return null;
    if (arr.length === 1) return new Node(arr[0]);
    const midIndex = Math.floor(arr.length / 2);
    const left = arr.slice(0, midIndex);
    const right = arr.slice(midIndex + 1);
    const root = new Node(arr[midIndex]);
    const l = this.buildTree(left);
    const r = this.buildTree(right);
    root.left = l;
    root.right = r;
    return root;
  }
  insert(value) {
    const node = new Node(value);
    if (!this.root) {
      this.root = node;
      return;
    }
    const fn = (ro) => {
      if (ro.data === value) return false;
      const toLeft = ro.data > value;
      if (toLeft) {
        if (ro.left) {
          fn(ro.left);
          return;
        }
        ro.left = node;
      } else {
        if (ro.right) {
          fn(ro.right);
          return;
        }
        ro.right = node;
      }
    };
    fn(this.root);
  }
  deleteItem(value) {
    const [target, parent] = this.#verboseFind(value, true);
    if (!target) return null;
    const chrght = this.#childAtRight(target, parent);
    //target has no child
    if (!target.left && !target.right)
      chrght ? (parent.right = null) : (parent.left = null);
    //target has left child
    else if (target.left && !target.right)
      chrght ? (parent.right = target.left) : (parent.left = target.left);
    //target has right child
    else if (!target.left && target.right)
      chrght ? (parent.right = target.right) : (parent.left = target.right);
    //target has two children
    else {
      let swapTarget = target.right;
      while (swapTarget.left) {
        swapTarget = swapTarget.left;
      }
      swapTarget.left = target.left;
      const parentOfSwap = this.#verboseFind(swapTarget.data, true)[1];
      if (swapTarget.right) {
        this.#childAtRight(swapTarget, parentOfSwap)
          ? (parentOfSwap.right = swapTarget.right)
          : (parentOfSwap.left = swapTarget.right);
      } else {
        this.#childAtRight(swapTarget, parentOfSwap)
          ? (parentOfSwap.right = null)
          : (parentOfSwap.left = null);
      }
      swapTarget.right = target.right;
      chrght ? (parent.right = swapTarget) : (parent.left = swapTarget);
    }
    if (target === this.root) this.root = parent.right;
  }
  #childAtRight(child, parent) {
    return parent.right === child;
  }
  #verboseFind(value, findParent) {
    if (!this.root) return null;
    let parent;
    if (findParent) {
      parent = new Node(null);
      parent.right = this.root;
    }
    const fn = (ro) => {
      if (ro.data === value) return ro;
      parent = ro;
      const toLeft = ro.data > value;
      const toRight = ro.data < value;
      if (toLeft) {
        return ro.left ? fn(ro.left) : null;
      } else if (toRight) {
        return ro.right ? fn(ro.right) : null;
      } else return null;
    };
    return findParent ? [fn(this.root), parent] : fn(this.root);
  }
  find(value) {
    return this.#verboseFind(value);
  }
  #throwErr() {
    throw new Error("Fatal Error: callback is not given, exiting...");
  }
  levelOrderForEach(callback) {
    if (!callback) this.#throwErr();
    const q = [];
    const fn = (node) => {
      if (!node) return;
      callback(q[0]);
      q.shift();
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
      fn(q[0]);
    };
    fn(this.root);
  }
  inOrderForEach(callback) {
    if (!callback) this.#throwErr();
    const fn = (node) => {
      if (!node) return;
      fn(node.left);
      callback(node);
      fn(node.right);
    };
    fn(this.root);
  }
  preOrderForEach(callback) {
    if (!callback) this.#throwErr();
    const fn = (node) => {
      if (!node) return;
      callback(node);
      fn(node.left);
      fn(node.right);
    };
    fn(this.root);
  }
  postOrderForEach(callback) {
    if (!callback) this.#throwErr();
    const fn = (node) => {
      if (!node) return;
      fn(node.left);
      fn(node.right);
      callback(node);
    };
    fn(this.root);
  }
  height(value) {
    const target = this.find(value);
    if (!target) return null;
    const fn = (node) => {
      if (!node) return 0;
      if (this.#chldlss(node)) return 0;
      return 1 + Math.max(fn(node.left), fn(node.right));
    };
    return fn(target);
  }
  depth(value) {
    const fn = (node) => {
      if (!node) return null;
      if (node.data === value) return 0;
      const pre = fn(value > node.data ? node.right : node.left);
      return pre === null ? null : 1 + pre;
    };
    return fn(this.root);
  }
  isBalanced() {
    let result = true;
    this.inOrderForEach((v) => {
      let leftHeight = 0;
      let rightHeight = 0;
      if (v.left) leftHeight = 1 + this.height(v.left.data);
      if (v.right) rightHeight = 1 + this.height(v.right.data);
      if (Math.abs(leftHeight - rightHeight) > 1) result = false;
    });
    return result;
  }
  reBalance() {
    if (this.isBalanced()) return;
    const a = [];
    this.inOrderForEach((v) => {
      a.push(v.data);
    });
    this.root = this.buildTree(a);
  }
  #chldlss(node) {
    return !node.left && !node.right;
  }
}
const ar = (len, max) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.floor(Math.random() * max));
  }
  return arr;
};
let n = new Tree(ar(30, 90));
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
