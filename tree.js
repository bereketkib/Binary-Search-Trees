import Node from "./node.js";

export default class Tree {
    constructor(dataArray) {
        this.root = this.buildTree(dataArray);
    }

    buildTree(dataArray) {
        const sortedArray = [...new Set(dataArray)].sort((a, b) => a - b);

        const build = (start, end) => {
            if (start > end) return null;
            const mid = Math.floor((start + end) / 2);
            const newNode = new Node(sortedArray[mid]);
            newNode.left = build(start, mid - 1);
            newNode.right = build(mid + 1, end);
            return newNode;
        };

        return build(0, sortedArray.length - 1);
    }

    insert(value, node = this.root) {
        if (!this.root) {
            this.root = new Node(value);
            return;
        }

        if (value < node.data) {
            if (!node.left) {
                node.left = new Node(value);
            } else {
                this.insert(value, node.left);
            }
        } else {
            if (!node.right) {
                node.right = new Node(value);
            } else {
                this.insert(value, node.right);
            }
        }
    }
    
    delete(value, node = this.root) {
        if (!node) {
            return null;
        }

        if (value < node.data) {
            node.left = this.delete(value, node.left);
        } else if (value > node.data) {
            node.right = this.delete(value, node.right);
        } else {
            if (!node.left && !node.right) {
                node = null;
            } else if (!node.left) {
                node = node.right;
            } else if (!node.right) {
                node = node.left;
            } else {
                const minRight = this.findMin(node.right);
                node.data = minRight.data;
                node.right = this.delete(minRight.data, node.right);
            }
        }

        return node;
    }

    findMin(node = this.root) {
        while (node.left) {
            node = node.left;
        }
        return node;
    }

    find(value, node = this.root) {
        if (node === null || node.data === value) return node;
        if (value < node.data) {
            return this.find(value, node.left);
        } else {
            return this.find(value, node.right);
        }
    }

    levelOrder(callback) {
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node) {
                callback(node.data);
                queue.push(node.left, node.right);
            }
        }
    }

    inorder(callback, node = this.root) {
        if (node) {
          this.inorder(callback, node.left);
          callback(node.data);
          this.inorder(callback, node.right);
        }
      }
    
      preorder(callback, node = this.root) {
        if (node) {
          callback(node.data);
          this.preorder(callback, node.left);
          this.preorder(callback, node.right);
        }
      }
    
      postorder(callback, node = this.root) {
        if (node) {
          this.postorder(callback, node.left);
          this.postorder(callback, node.right);
          callback(node.data);
        }
      }
    
      height(node = this.root) {
        if (node === null) return -1;
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
      }
    
      depth(node) {
        if (node === null || node === this.root) return 0;
        const parent = this.findParent(this.root, node);
        return 1 + this.depth(parent);
      }
    
      findParent(root, node, parent = null) {
        if (root === null) return null;
        if (root === node) return parent;
        if (node.data < root.data) {
          return this.findParent(root.left, node, root);
        } else {
          return this.findParent(root.right, node, root);
        }
      }
    
      isBalanced(node = this.root) {
        if (node === null) return true;
        const leftHeight = this.height(node.left);
        const rightHeight = this.height(node.right);
        if (Math.abs(leftHeight - rightHeight) <= 1) {
          return this.isBalanced(node.left) && this.isBalanced(node.right);
        }
        return false;
      }
    
      rebalance() {
        const dataArray = [];
        this.levelOrder((value) => dataArray.push(value));
        this.root = this.buildTree(dataArray);
      }
}