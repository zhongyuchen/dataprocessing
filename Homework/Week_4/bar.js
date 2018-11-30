window.onload = function() {
    readcsv('data.csv');
};

function readcsv(filename) {
    d3.csv(filename).then(function(csvdata) {
        // read csv file

        // build all the texts on html
        text();

        // x and y array
        var dataset = [];
        var country = [];

        // store x and y
        for (let i = 0; i < csvdata.length; i++) {
            if (csvdata[i]["LOCATION"] !== "OECD" &&
                csvdata[i]["FREQUENCY"] === "A" &&
                csvdata[i]["Flag Codes"] === "" &&
                csvdata[i]["INDICATOR"] === "RENEWABLE" &&
                csvdata[i]["MEASURE"] === "KTOE" &&
                csvdata[i]["SUBJECT"] === "TOT" &&
                csvdata[i]["TIME"] === "2016" &&
                csvdata[i]["Value"] !== "") {
                dataset.push(parseFloat(csvdata[i]["Value"]));
                country.push(csvdata[i]["LOCATION"]);
            }
        }
        // console.log(dataset);
        // console.log(country);

        // draw the bar chart
        barchart(dataset, country);
    });
}

function text() {
    // build all the texts on html

    // title
    d3.select("head").append("title").text("Week_4 Barchart");

    // data sourse
    d3.select("#source").append("a").text("Data Source").attr("href", "https://data.oecd.org/energy/renewable-energy.htm");

    // name and student number
    d3.select("#nameandnumber").append("a").attr("class", "white-text").text("Zhongyu Chen, 12455822");
    // email
    d3.select("#email").append("a").attr("class", "white-text").text("zhongyuchen@yahoo.com");

    // description
    d3.select("#description").append("p")
        .text("Renewable energy measured in KTOE (thousand tonne of oil equivalent) of 35 countries in 2016. " +
            "OECD (in total) has 512203.649 KTOE. " +
            "USA has the highest 152533.691 KTOE. " +
            "LUX has the lowest 206.526 KTOE. " +
            "Hover over any bar for its exact value!");
}

function barchart(dataset, country) {
    // draw bar chart

    // graph specs
    var width = 1000;
    var height = 625;
    var padding = {top: 50, bottom: 50, left: 50, right: 1, between:1};
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
        .attr("transform", "translate(" + (width - padding.right - padding.left - 45) + "," + (height - padding.bottom / 3) + ")");

    // title
    svg.append("text")
        .text("Renewable Energy in KTOE, 2016")
        .style("font-size", "25px")
        .attr("transform", "translate(" + (width / 2 - 200) + "," + padding.top + ")");
}