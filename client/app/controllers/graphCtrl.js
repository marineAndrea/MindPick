angular.module('thesis.graph', [])

.controller('GraphCtrl', function ($scope) {
  $scope.dthree = function() {

    var findColor = function(relationship) {
      if (relationship === "supporting") {
        return "#53A65F";
      } else if (relationship === "related") {
        return "#30302E";  
      } else if (relationship === "undermining") {
        return "#A63822";
      }
    };

    // Constants for the SVG
    var width = $(".dThreeContainer").width();
    var height = 640;

    // Set up the colour scale
    var colors = ["#418248", "#338C64", "#2A7574", "#356A8C", "#3E4B82", "#445082", "#49378C", "#5B2D75", "#8C3984", "#82414A"];

    // Set up the force layout
    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([width, height]);

    // Append a SVG to the body of the html page. Assign this SVG as an object to svg
    var svg = d3.select(".dThreeContainer").append("svg")
        .attr("width", width)
        .attr("height", height);

    // This involves using the tooltip library by labratrevenge. The tooltip here will give the name of the node but can easily be adapted to display any of the underlying data by modifying html attribute of the tip.
    // Set up tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
        return  d.topic + "";
    });
    svg.call(tip);

    // Here we add the possibility of pinning a node a particular point. This is useful when exploring large networks. Drag a node to pin it down. Double click on a node to release it.
    var node_drag = d3.behavior.drag()
        .on("dragstart", dragstart)
        .on("drag", dragmove)
        .on("dragend", dragend);
    function dragstart(d, i) {
        force.stop(); // stops the force auto positioning before you start dragging
    }
    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
    }
    function dragend(d, i) {
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        force.resume();
    }
    function releasenode(d) {
        d.fixed = false; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        //force.resume();
    }

    d3.json("../../articles.json", function(error, graph) {
      if (error) throw error;

      // Creates the graph data structure out of the json data
      force.nodes(graph.nodes)
          .links(graph.links)
          .start();

      // Create all the line svgs but without locations yet
      var link = svg.selectAll(".link")
          .data(graph.links)
          .enter().append("line")
          .attr("class", "link")
          // .style("stroke-width", function (d) {
          //   return Math.sqrt(3);
          // })
          .style("marker-end",  "url(#suit)") // Modified line 
          .style("stroke", function(d) { 
            return findColor(d.relationship); 
          });

      // Do the same with the circles for the nodes - no 
      var node = svg.selectAll(".node")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("class", "node")
          // .attr("r", 8)
          .attr("r", function(d) { 
            return 3 + d.popIdx; 
          })
          .style("fill", function (d) {
          return colors[d.ctrIdx - 1];
      })
          // .call(force.drag)
          .call(node_drag) //Added
          .on('click', connectedNodes) //Added code 
          .on('dblclick', releasenode)
          .on('mouseover', tip.show) //Added
          .on('mouseout', tip.hide) //Added 
          // leads to article's page with right click
          .on('contextmenu', function(d, i) {
            d3.event.preventDefault();
            window.location.href = d.url;
          });

      // Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
      force.on("tick", function () {
          link.attr("x1", function (d) {
              return d.source.x;
          })
              .attr("y1", function (d) {
              return d.source.y;
          })
              .attr("x2", function (d) {
              return d.target.x;
          })
              .attr("y2", function (d) {
              return d.target.y;
          });

          node.attr("cx", function (d) {
              return d.x;
          })
              .attr("cy", function (d) {
              return d.y;
          });
      });


      // When the graph is huge it's nice to have some search functionality. We can use some jquery to create an autocompleting search box so the first thing is to add references to the jquery-ui libraries.
      var optArray = [];
      for (var i = 0; i < graph.nodes.length - 1; i++) {
          optArray.push(graph.nodes[i].topic);
      }
      optArray = optArray.sort();
      $(function () {
          $("#search").autocomplete({
              source: optArray
          });
      });


      // If you are dealing with a directed graph and you wish to use arrows to indicate direction your can just append this bit of code
      svg.append("defs").selectAll("marker")
          .data(["suit", "licensing", "resolved"])
        .enter().append("marker")
          .attr("id", function(d) { return d; })
          .attr("viewBox", "0 -5 10 10")
          .attr("refX", 25)
          .attr("refY", 0)
          .attr("markerWidth", 6)
          .attr("markerHeight", 6)
          .attr("orient", "auto")
        .append("path")
          .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
          .style("stroke", "#4679BD")
          .style("opacity", "0.6");




      // This is about fading out nodes and links that aren't connected to the node you've doubleclicked on. I've based this on the this answer on Stackoverflow.
      // Toggle stores whether the highlighting is on
      var toggle = 0;
      // Create an array logging what is connected to what
      var linkedByIndex = {};
      for (i = 0; i < graph.nodes.length; i++) {
          linkedByIndex[i + "," + i] = 1;
      }
      graph.links.forEach(function (d) {
          linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });
      // This function looks up whether a pair are neighbours
      function neighboring(a, b) {
          return linkedByIndex[a.index + "," + b.index];
      }
      function connectedNodes() {
          if (toggle === 0) {
              //Reduce the opacity of all but the neighbouring nodes
              d = d3.select(this).node().__data__;
              node.style("opacity", function (o) {
                  return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
              });
              link.style("opacity", function (o) {
                  return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
              });
              //Reduce the op
              toggle = 1;
          } else {
              //Put them back to opacity=1
              node.style("opacity", 1);
              link.style("opacity", 1);
              toggle = 0;
          }
      }

    });


    // When the graph is huge it's nice to have some search functionality. We can use some jquery to create an autocompleting search box so the first thing is to add references to the jquery-ui libraries.
    function searchNode() {
      //find the node
      var selectedVal = document.getElementById('search').value;
      var node = svg.selectAll(".node");
      if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
      } else {
        var selected = node.filter(function (d, i) {
          return d.topic != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link");
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
          .duration(5000)
          .style("opacity", 1);
      }
    }

    $("#click").click(function () {
      searchNode();
    });
  };

  $scope.dthree();
});