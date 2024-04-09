// Define the dimensions for the SVG
var width = 600;
var height = 600;
var radius = Math.min(width, height) / 2;

// Append SVG to the #pie-chart div
var svg = d3.select("#pie-chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Define color scales
var color = d3.scaleOrdinal(d3.schemeCategory10);

// Load data from import-goods.csv and export-goods.csv
Promise.all([d3.csv("import-goods.csv"), d3.csv("export-goods.csv")])
  .then(function(dataArray) {
    var importData = dataArray[0];
    var exportData = dataArray[1];

    // Merge import and export data
    var data = importData.concat(exportData);

    // Parse data
    data.forEach(function(d) {
      d.Years = +d.Years;
      for (var i = 1; i < Object.keys(d).length; i++) {
        d[Object.keys(d)[i]] = +d[Object.keys(d)[i]];
      }
    });

    // Get list of columns except for Years
    var columns = Object.keys(data[0]).slice(1);

    // Define pie function
    var pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d3.sum(columns, function(column) {
          return d[column];
        });
      });

    // Define arc function
    var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    // Generate arcs
    var arcs = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");

    // Append paths
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", function(d) {
        return color(d.data.Years);
      });

    // Append labels
    arcs.append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("dy", ".35em")
      .style("fill", "white")
      .text(function(d) {
        let sum = "";
        for (var i = 0; i < columns.length; i++) {
            sum += columns[i] + ": " + d.data[columns[i]] + "\n";
        }
        return sum;
      });

    // Create legend for combined data
    var legend = d3.legendColor()
      .shapeWidth(30)
      .cells(5)
      .orient("vertical")
      .scale(color);

    svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(-300, -200)")
      .style("fill", "white")
      .call(legend);

  })
  .catch(function(error) {
    console.log("Error loading CSV files:", error);
  });
