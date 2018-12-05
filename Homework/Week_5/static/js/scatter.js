window.onload = function() {
    requestdata();
};

function requestdata() {
    let womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
    let consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";

    let requests = [d3.json(womenInScience), d3.json(consConf)];

    Promise.all(requests).then(function(response) {
        usedata(response);
    }).catch(function(e) {
        throw(e);
    });
}

function usedata(response) {
    // transform data into json format
    let womeninscience = transformResponse(response[0]);
    let consconf = transformResponse(response[1]);
    console.log(womeninscience);
    console.log(consconf);

    scatterplot(womeninscience, womeninscience["MSTI Variables"],
                consconf, consconf["Indicator"]);
}

function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);
    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};
                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}

function scatterplot(dataset0, title0, dataset1, title1) {
    // draw scatter plot
    // var slider = document.getElementById('slider');
    //
    // noUiSlider.create(slider, {
    //     start: [2007, 2015],
    //     connect: true,
    //     range: {
    //         'min': 2007,
    //         'max': 2015
    //     }
    // });

    // graph specs
    var full_width = document.getElementById('scatterplot').clientWidth;
    var full_height = full_width / 1.6;

    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = full_width - margin.left - margin.right;
    var height = full_height - margin.top - margin.bottom;

    // setup x
    var xValue = function(d) { return d.time;},
        xScale = d3.scaleLinear()
            .domain([d3.min(dataset0, xValue),
                d3.max(dataset0, function(d) { return d.time; })])
            .range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function(d) { return d.datapoint;},
        yScale = d3.scaleLinear()
            .domain([d3.min(dataset0, function(d) { return d.datapoint; }),
                d3.max(dataset0, function(d) { return d.datapoint; })])
            .range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.axisLeft(yScale);

    // setup fill color
    var cValue = function(d) { return d.Country;},
        countrycolor = {"France": '#8c510a', "Germany": '#d8b365',
            "Korea": '#f6e8c3', "Netherlands": '#c7eae5',
            "Portugal": '#5ab4ac', "United Kingdom": '#01665e'},
        color = function(d) { return countrycolor[cValue(d)]; };

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#scatterplot").append("svg")
        .attr("width", full_width)
        .attr("height", full_height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<span style='color:red'>" + d.time + "</span> <strong>d.datapoint</strong> <strong>d.Country</strong>";
        });

    // invoke the tip in the context of the visualization
    svg.call(tip);

    // x-axis
    xAxis.tickFormat(function(d) { return d.toString()});
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Women researchers as a percentage of total researchers (headcount)");


    // draw dots
  svg.selectAll(".dot")
      .data(dataset0)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // draw legend colored circles
    var cx = width - 50;
    var cy = margin.top;
    var r = 7;
    var gap = {"vertical": 20, "horizontal": 15};
    var countries = Object.keys(countrycolor);
    for (let i = 0; i < countries.length; i++) {
        // key
        let key = countries[i];
        // legend
          svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy + i * gap.vertical)
      .attr("r", r)
      .style("fill", countrycolor[key]);
          // legend text
  svg.append("text")
      .attr("x", cx + gap.horizontal)
      .attr("y", cy + r / 2 + i * gap.vertical)
      .text(key);
    }
}