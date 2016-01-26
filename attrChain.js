function attrChain(node, attr, fin, depth) {
    var str = '';
    if(node.hasAttribute && node.hasAttribute(attr)) {
        console.log(node.tagName + ' ' + node.getAttribute(attr));
        str += node.tagName + ' ' + node.getAttribute(attr) + ' '
    }

    if(node.parentNode) {
        attrChain(node.parentNode, attr, str, ++depth);
    }
}