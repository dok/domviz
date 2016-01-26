var global = window;

function App () {
    var self = this;
    $(document).ready(function() {
        $("#analyze").click(self.onClick.bind(self));
    });

}

App.prototype.onClick = function() {
    this.beautify();
    var str = $('.base textarea').get(0).value;
    var baseDom = this.parseString(str);
    var baseRoot = this.castToNodes(baseDom.get(0), null);


    var str = $('.target textarea').get(0).value;
    var targetDom = this.parseString(str);
    var targetRoot = this.castToNodes(targetDom.get(0), null);
    this.visualize(baseRoot, targetRoot);
};

App.prototype.beautify = function() {
};

App.prototype.visualize = function(base, target) {
    create_normal("baseVisual", base, d3.layout.tree());
    create_normal("targetVisual", target, d3.layout.tree());
};

App.prototype.castToNodes = function(domNode, parent) {
    var node = new Node(domNode, parent);
    var self = this;
    for(var i = 0; i < domNode.children.length; i++) {
        var child = domNode.children[i];
        node.children.push(self.castToNodes(child, domNode));
    }
    return node;
};

App.prototype.parseString = function(str) {
    return $(str);
}

function Node(dom, parent) {
    this.tagName = dom.tagName;
    this.parent = parent;
    this.className = dom.getAttribute('class');
    this.style = dom.getAttribute('style');
    this.children = [];
}

new App();
