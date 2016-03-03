// Credit is given to where credit is due
// http://bl.ocks.org/sjengle/b8bf74974ee2c2c52b88
var dimensions = {
    width:  500,
    height: 400,
    margin: 40
};

var nodeColor = {
    'DIV': 'black',
    'A': 'green',
    'UL': 'red',
    'OL': 'red',
    'LI': 'orange',
    'H1': 'blue',
    'H2': 'blue',
    'H3': 'blue',
    'H4': 'blue',
    'H5': 'blue',
    'P': 'pink',
    'default': 'black'
};

// used to color node by depth
// http://colorbrewer2.org/index.php?type=sequential&scheme=Blues&n=5
var color = d3.scale.ordinal()
    .domain([0, 1, 2, 3, 4])
    .range(["#EFF3FF", "#BDD7E7", "#6BAED6", "#3182BD", "#08519C"]);

function create_svg(id) {
    var node = document.querySelector('#' + id);

    d3.select('#' + id + ' svg').remove();

    // create svg image
    var svg = d3.select("#" + id)
        .append("svg")
        .attr("width", node.offsetWidth)
        .attr("height", node.offsetHeight);

    // draw a rectangle with a light grey background
    svg.append("rect")
        .attr("width", node.offsetWidth)
        .attr("height", node.offsetHeight)
        .style("fill", "#eeeeee");

    // return reference to svg image
    return svg;
}



function create_nodelink(svg, tree, layout, path_generator) {
    // use layout generator to generate positions for nodes and links
    var nodes = layout.nodes(tree);
    var links = layout.links(nodes);

    // the layout sets the following attributes:
    // parent, children, depth, x, y
    // https://github.com/mbostock/d3/wiki/Tree-Layout#wiki-nodes

    // create edges
    svg.selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", path_generator)
        .attr("class", "link");

    // create nodes
    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 7)
        .attr("cx", function(d) { return d.x; }) // set by layout
        .attr("cy", function(d) { return d.y; }) // set by layout
        .attr("id", function(d) { return d.name; })
        .attr("class", "node")
        .style("fill", function(d) {
            return nodeColor[d.tagName] || nodeColor['default'];
        })
        // add mouseover interactivity
        .on("mouseover", function(d) {
            // calculate valid range
            var xmin = 0;
            var xmax = layout.size()[0];

            // necessary for circular layouts
            if (xmax < dimensions.width - dimensions.margin) {
                xmax = dimensions.width / 2;
                xmin = -xmax;
            }

            // show tooltip
            show_tooltip(svg, d3.select(this), xmin, xmax, d);

            // highlight circle
            d3.select(this).style("stroke", "red");
            d3.select(this).style("fill", "red");

            // moves circle to front
            this.parentNode.appendChild(this);
        })
        .on("mouseout", function(d) {
            // remove tooltip
            window.tooltip
                .transition()
                .duration(500)
                .style('opacity', 0);

            // reset circle style
            d3.select(this).style("stroke", "#888888");
            d3.select(this).style("fill", function(d) {
                return nodeColor[d.tagName] || nodeColor['default'];
            });
        })
        .on('click', function(d) {
            var tooltip = nodeTemplate(d);
            $('[node-containers]').append(tooltip);
        });
}

// creates normal, non-circular layouts (either traditional or dendrogram)
function create_normal(id, tree, layout) {

    // create svg image
    var svg = create_svg(id);

    // translate slightly to add margin around plot
    var pad = dimensions.margin / 2;
    var g = svg.append("g")
        .attr("transform", "translate(" + pad + ", " + pad + ")");

    // setup layout to return pixel values within plot area
    var layout = layout.size([dimensions.width  - dimensions.margin,
        dimensions.height - dimensions.margin]);

    // fancy path generator that returns nice curved edges between nodes
    var path_generator = d3.svg.diagonal()
        // again, d.x and d.y have already been transformed by layout
        .projection(function(d) { return [d.x, d.y]; });

    create_nodelink(g, tree, layout, path_generator);

    var height = document.querySelector('g').getBoundingClientRect().height;

    svg
        .style('height', height + dimensions.margin)
        .select('rect')
        .style('height', height + dimensions.margin);
}

/*
 *  TOOLTIP HANDLING
 *  Since this is not the focus of this example, I moved the tooltip code to a
 *  separate file.
 *
 *  This function creates svg text as a tooltip for a specified node. The node
 *  must have the tooltip text as the id, and the cx and cy attributes already
 *  properly set.
 */
function show_tooltip(svg, node, xmin, xmax, d) {
    var tooltip = tooltipTemplate(d);

    window.tooltip
        .transition()
        .style('opacity', .9);
    window.tooltip
        .html(tooltip)
        .style("left", (d3.event.pageX + 20) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");
}