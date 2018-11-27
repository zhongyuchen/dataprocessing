function barchart(dataset, country) {
    // draw bar chart

    // graph specs
    var width = 1000;
    var height = 625;
    var padding = {top: 50, bottom: 50, left: 50, right: 50, between:1};
    var tickcnt = 15;
    var lowerbound = 0;
    var step = (width - padding.left - padding.right) / dataset.length;

    // x axis scale
    var xscale = d3.scaleBand()
        .domain(country)
        .range([0, width - padding.left - padding.right]);

    // y axis scale
    var yscale = d3.scaleLinear()
        .domain([lowerbound, d3.max(dataset, function(d) { return d; })])
        .range([height - padding.bottom, padding.top]);

    // svg
    var svg = d3.select("#barchart").append("svg").attr("width", width).attr("height", height);

    // initialize tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<span style='color:red'>" + d + "</span> <strong>KTOE</strong>";
        });

    // invoke the tip in the context of the visualization
    svg.call(tip);

    // draw bar chart
    svg.selectAll(".bar").data(dataset).enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d, i) {
            return padding.left + i * step;
        })
        .attr("y", function(d) {
            return yscale(d);
        })
        .attr("width", step - padding.between)
        .attr("height", function(d) {
            return height - yscale(d) - padding.bottom;
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // y axis
    var yaxis = d3.axisLeft(yscale)
        .ticks(tickcnt);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + 0 + ")")
        .call(yaxis);
    svg.append("text")
        .text("KTOE")
        .style("font-size", "20px")
        .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

    // x axis
    var xaxis = d3.axisBottom(xscale);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
        .call(xaxis);
    svg.append("text")
        .text("LOCATION")
        .style("font-size", "20px")
        .attr("transform", "translate(" + (width - padding.right - padding.left) + "," + (height - padding.bottom / 3) + ")");

    // title
    svg.append("text")
        .text("Renewable Energy in KTOE, 2016")
        .style("font-size", "25px")
        .attr("transform", "translate(" + (width / 2 - 200) + "," + padding.top + ")");
}