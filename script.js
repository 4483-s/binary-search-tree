class Node {
  constructor(data) {
    this.left = null;
    this.right = null;
    this.data = data;
  }
}
function Tree(arr) {
  const array = Array.from(new Set(arr.toSorted((a, b) => a - b)));
  let root = binaryTree(array);
  function binaryTree(arr) {
    if (arr.length === 1) {
      return new Node(arr[0]);
    }
    let mid = Math.floor(arr.length / 2);
    const root = new Node(arr[mid]);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid + 1);
    root.left = left.length ? binaryTree(left) : null;
    root.right = right.length ? binaryTree(right) : null;

    return root;
  }
  function insert(value) {
    const node = new Node(value);
    if (!root) {
      root = node;
      return;
    }
    let currentNode = root;
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
      // if same value is met, return
      else {
        console.error("Invalid  or dublicated value, exiting...");
        return;
      }
    }
  }
  function deleteItem(value) {
    const [parent, target] = find(value, true);
    const targetIsRoot = target === root;
    const targetAtRight = parent.right === target;
    if (!target.right && !target.left) {
      //doesn't prevent remove root
      targetAtRight ? (parent.right = null) : (parent.left = null);
    }
    //when target has left
    else if (!target.right && target.left) {
      targetAtRight
        ? (parent.right = target.left)
        : (parent.left = target.left);
    }
    //when target has right
    else if (target.right && !target.left) {
      targetAtRight
        ? (parent.right = target.right)
        : (parent.left = target.right);
    }
    //when target has right and left
    else if (target.right && target.left) {
      let swap = target.right;
      while (swap.left) {
        swap = swap.left;
      }
      swap.left = target.left;
      const par = find(swap.data, true)[0];
      if (swap.right)
        par.right === swap ? (par.right = swap.right) : (par.left = swap.right);
      else par.right === swap ? (par.right = null) : (par.left = null);
      targetAtRight ? (parent.right = swap) : (parent.left = swap);
      swap.right = target.right;
    }
    if (targetIsRoot) {
      root = parent.right ? parent.right : parent.left;
    }
  }
  // if given parent is true, find the parent of target value as well then return a array
  function find(value, parent) {
    let currentNode = root;
    let tempParent;
    if (parent) {
      tempParent = new Node(0);
      root.data > tempParent.data
        ? (tempParent.right = root)
        : (tempParent.left = root);
    }
    while (true) {
      if (!currentNode) return null;
      if (value > currentNode.data) {
        if (tempParent) tempParent = currentNode;
        currentNode = currentNode.right;
      } else if (value < currentNode.data) {
        if (tempParent) tempParent = currentNode;
        currentNode = currentNode.left;
      } else if (value === currentNode.data) {
        return parent ? [tempParent, currentNode] : currentNode;
      }
    }
  }
  function levelOrderForEach(callback) {
    if (!callback) {
      console.error("no callback, exiting...");
      return;
    }
    const arr = [];
    arr.push(root);
    while (arr.length) {
      const len = arr.length;
      arr.forEach((v) => {
        callback(v);
        if (v.left) arr.push(v.left);
        if (v.right) arr.push(v.right);
      });
      arr.splice(0, len);
    }
  }
  function recLevelOrderForEach(callback) {
    if (!callback) {
      console.error("no callback, exiting...");
      return;
    }
    const arr = [];
    arr.push(root);
    function rec(arr) {
      let len = arr.length;
      if (!len) return;
      arr.forEach((v) => {
        callback(v);
        if (v.left) arr.push(v.left);
        if (v.right) arr.push(v.right);
      });
      arr.splice(0, len);
      rec(arr);
    }
    rec(arr);
  }
  function inOrderForEach(callback) {
    if (!callback) {
      console.error("no callback, exiting...");
      return;
    }
    function rec(node) {
      if (node.left) rec(node.left);
      callback(node);
      if (node.right) rec(node.right);
    }
    rec(root);
  }
  function preOrderForEach(callback) {
    if (!callback) {
      console.error("no callback, exiting...");
      return;
    }
    function rec(node) {
      callback(node);
      if (node.left) rec(node.left);
      if (node.right) rec(node.right);
    }
    rec(root);
  }
  function postOrderForEach(callback) {
    if (!callback) {
      console.error("no callback, exiting...");
      return;
    }
    function rec(node) {
      if (node.left) rec(node.left);
      if (node.right) rec(node.right);
      callback(node);
    }
    rec(root);
  }
  function height(value) {
    const arr = [];
    levelOrderForEach((v) => {
      arr.push(v.data);
    });
    let deepest = arr[arr.length - 1];
    let depthOfValue = depth(value);
    let depthOfDeepest = depth(deepest);
    if (
      typeof depthOfDeepest === "number" &&
      typeof depthOfValue === "number"
    ) {
      return depthOfDeepest - depthOfValue;
    }
    return null;
  }
  function depth(value) {
    let count = 0;
    let temp = root;
    while (true) {
      if (!temp) return null;
      if (value > temp.data) {
        temp = temp.right;
      } else if (value < temp.data) {
        temp = temp.left;
      } else if (temp.data === value) {
        return count;
      } else {
        return null;
      }
      count++;
    }
  }
  function isBalanced() {
    let result = true;
    levelOrderForEach((v) => {
      let leftHeight = v.left ? height(v.left.data) + 1 : 0;
      let rightHeight = v.right ? height(v.right.data) + 1 : 0;
      if (Math.abs(leftHeight - rightHeight) > 1) {
        result = false;
      }
    });
    return result;
  }
  function rebalance() {
    const arr = [];
    inOrderForEach((v) => {
      arr.push(v.data);
    });
    root = binaryTree(arr);
  }
  return {
    rebalance,
    isBalanced,
    height,
    depth,
    preOrderForEach,
    postOrderForEach,
    inOrderForEach,
    recLevelOrderForEach,
    levelOrderForEach,
    insert,
    deleteItem,
    find: (v) => find(v, false),
    get root() {
      return root;
    },
  };
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
