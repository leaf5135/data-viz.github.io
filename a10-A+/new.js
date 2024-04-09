// Set graph margins and dimensions
var margin = { top: 25, right: 100, bottom: 100, left: 100 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// Set ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.22);
var y = d3.scaleLinear()
    .range([height, 0]);
var svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Annotations
const annotations = [
    {
        note: {
        label: 'Mumps became nationally notifiable in 1968 with almost 150,000 cases reported',
        title: 'Mumps outbreak in 1968',
        },
        x: 150,
        y: 250,
        dy: -50,
        dx: 100,
        width: 200,
        type: d3.annotationLabel,
    },
];

const makeAnnotations = d3.annotation()
    .annotations(annotations);

svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);

// Get data
d3.csv("https://gist.githubusercontent.com/andrewdiep1/34b3b0bca4f61a26bc710bc9b5467008/raw/8e227b241dd4d9e403014ad9047d5917c9897b0a/health-bar.csv").then(function (data) {

    data.forEach(function (d) {
        d.number = +d.number;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return d.disease; }));
    y.domain([0, d3.max(data, d => d.number)]);

    // Define color scale
    var colorScale = d3.scaleSequential()
        .domain([0, 150000])
        .range([colorbrewer.OrRd[9][0], colorbrewer.OrRd[9][8]]);

    // Append rectangles for bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.disease); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.number); })
        .attr("height", function (d) { return height - y(d.number); })
        .attr("fill", function(d) { return colorScale(d.number); })
        .on("mouseover", showTooltip)
        .on("mousemove", updateTooltip)
        .on("mouseleave", hideTooltip);

    // Add legend
    svg.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(" + (width + 20) + "," + 20 + ")")
        .style("fill", "white");

    var legendSequential = d3.legendColor()
        .shapeWidth(30)
        .cells(5)
        .orient("vertical")
        .scale(colorScale);

    // Add title to legend
    svg.select(".legendSequential")
        .append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "start")
        .style("font-size", "16px")
        .style("fill", "white")
        .text("Number of infections");

    svg.select(".legendSequential")
        .call(legendSequential);

    // Add x axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add y axis
    svg.append("g")
        .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0f")));

    // Add x axis label
    svg.append("text")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "20px")
        .text("Disease type");

    // Add y axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "20px")
        .text("Number of infections");

    // Create tooltip
    var tooltip = d3.select("#bar-chart")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Tooltip functions
    function showTooltip(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`<div>Disease: ${d.disease}</div><div>Number of infections: ${d.number}</div>`)
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");
    }

    function updateTooltip(event) {
        tooltip
            .style("left", event.pageX + "px")
            .style("top", event.pageY + "px");
    }

    function hideTooltip() {
        tooltip.style("opacity", 0);
    }

});