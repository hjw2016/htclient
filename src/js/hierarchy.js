/**
 * @author huangjingwei
 * @description 金字塔形数组构造和遍历
 */
var toHierarchy = function(flatArray) {
    var current, parent;
    for (var k = flatArray.length - 1; k >= 0; k--) {
        current = flatArray[k]
        if (current.pid === "" || current.pid == null) {
            continue
        }
        parent = getParent(current, flatArray)
        if (parent == null) {
            continue
        }
        if (!parent.children) {
            parent.children = []
        }
        parent.children.unshift(current)
        flatArray.splice(k, 1)
    }
    return flatArray

    function getParent(child, nodes) {
        for (var i = 0, len = nodes.length; i < len; i++) {
            if (nodes[i].id === child.pid) {
                return nodes[i]
            }
        }
        return null
    }
};
var depthOrderTraverse = function(hierarchy, iteratee) {
    if (!hierarchy) {
        return
    }
    var stack = []
    if ({}.toString.apply(hierarchy) == "[object Array]") {
        [].push.apply(stack, hierarchy)
    } else {
        stack.push(hierarchy)
    }
    while (stack.length) {
        var node = stack.pop()
        if (iteratee && iteratee(node)) {
            return node
        }
        if (node.children) {
            [].push.apply(stack, node.children)
        }
    }
};
var levelOrderTraverse = function(hierarchy, iteratee) {
    if (!hierarchy) {
        return
    }
    var queue = []
    if ({}.toString.apply(hierarchy) == "[object Array]") {
        [].push.apply(queue, hierarchy)
    } else {
        queue.push(hierarchy)
    }
    while (queue.length) {
        var node = queue.shift()
        if (iteratee && iteratee(node)) {
            return node
        }
        if (node.children) {
            [].push.apply(queue, node.children)
        }
    }
}
export { toHierarchy, depthOrderTraverse, levelOrderTraverse}