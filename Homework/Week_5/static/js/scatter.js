// Zhongyu Chen, 12455822, zhongyuchen@yahoo.com
// scatter.js for drawing the scatter plot

// global variable
var full_countrycolor = {"France": '#8c510a', "Germany": '#d8b365',
            "Korea": '#f6e8c3', "Netherlands": '#c7eae5',
            "Portugal": '#5ab4ac', "United Kingdom": '#01665e'};
var countrycolor = {};
var range = {"low": 2007, "high": 2015};

window.onload = function() {
    requestdata();
};

function requestdata() {
    let womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
    let consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";

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
    let newwis = womeninscience;
    let newcc = consconf;

    // original plot
    scatterplot(womeninscience, "Headcount of Women Researchers in 6 Countries", "Headcount of Women Researchers");

    // checkboxes
    for (let key in full_countrycolor) {
        countrycolor[key] = full_countrycolor[key];
    }
    var updatecheckbox = function (country) {
            // remove former plot
            d3.selectAll('svg').remove();

            // update checkbox value
            if (countrycolor.hasOwnProperty(country)) {
                delete countrycolor[country];
            }
            else {
                countrycolor[country] = full_countrycolor[country];
            }

            // update plot
            if (countrycolor.hasOwnProperty(country)) {
                for (let i = 0, length = consconf.length; i < length; i++) {
                    if (consconf[i].time >= range.low && consconf[i].time <= range.high &&
                        consconf[i].Country === country) {
                        newcc.push(consconf[i]);
                    }
                }
                for (let i = 0, length = womeninscience.length; i < length; i++) {
                    if (womeninscience[i].time >= range.low && womeninscience[i].time <= range.high &&
                        womeninscience[i].Country === country) {
                        newwis.push(womeninscience[i]);
                    }
                }
            }
            else {
                let tempcc = [];
                let tempwis = [];
                for (let i = 0, length = newcc.length; i < length; i++) {
                    if (newcc[i].time >= range.low && newcc[i].time <= range.high &&
                        newcc[i].Country !== country) {
                        tempcc.push(newcc[i]);
                    }
                }
                for (let i = 0, length = newwis.length; i < length; i++) {
                    if (newwis[i].time >= range.low && newwis[i].time <= range.high &&
                        newwis[i].Country !== country) {
                        tempwis.push(newwis[i]);
                    }
                }
                newcc = tempcc;
                newwis = tempwis;
            }

            // draw plot
            if (count) {
                scatterplot(newcc, "Consumer confidence in 6 Countries", "Consumer confidence");
            }
            else {
                scatterplot(newwis, "Headcount of Women Researchers in 6 Countries", "Headcount of Women Researchers");
            }
        };
    for (let key in full_countrycolor) {
        document.getElementById(key).onclick = function clickcheckbox() {
            updatecheckbox(key);
        };
    }


    // switch dataset
    var count = 0;
    document.getElementById('switchdataset').onclick = function switchdataset() {
        d3.selectAll('svg').remove();
        count = (count + 1) % 2;
        if (count) {
            scatterplot(newcc, "Consumer confidence in 6 Countries", "Consumer confidence");
        }
        else {
            scatterplot(newwis, "Headcount of Women Researchers in 6 Countries", "Headcount of Women Researchers");
        }
    };

    // update range
    var slider = create_slider('year-slider');
    slider.noUiSlider.on('update', function (values, handle) {
        // update new time range
        range = {"low": parseInt(values[0]), "high": parseInt(values[1])};

        // update dateset
        newwis = [];
        newcc = [];
        for (let key in womeninscience) {
            if (womeninscience[key].time >= range.low && womeninscience[key].time <= range.high &&
                countrycolor.hasOwnProperty(womeninscience[key].Country)) {
                newwis.push(womeninscience[key]);
            }
        }
        for (let key in consconf) {
            if (consconf[key].time >= range.low && consconf[key].time <= range.high &&
                countrycolor.hasOwnProperty(consconf[key].Country)) {
                newcc.push(consconf[key]);
            }
        }

        // update plot
        d3.selectAll('svg').remove();
        if (count) {
            scatterplot(newcc, "Consumer confidence in 6 Countries", "Consumer confidence");
        }
        else {
            scatterplot(newwis, "Headcount of Women Researchers in 6 Countries", "Headcount of Women Researchers");
        }
    });
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

function create_slider(id) {
    var slider = document.getElementById(id);

    noUiSlider.create(slider, {
        start: [2007, 2015],
        connect: true,
        step: 1,
        tooltips: [wNumb({decimals: 0}),wNumb({decimals: 0})],
        range: {
            'min': 2007,
            'max': 2015
        }
    });
    return slider;
}

function scatterplot(dataset0, title, yAxistext) {
    // draw scatter plot

    // graph specs
    var full_width = 1000;
    var full_height = 625;

    var margin = {top: 50, right: 150, bottom: 55, left: 70};
    var width = full_width - margin.left - margin.right;
    var height = full_height - margin.top - margin.bottom;

    // setup x
    var xValue = function(d) { return d.time;},
        xScale = d3.scaleLinear()
            .domain([d3.min(dataset0, xValue),
                d3.max(dataset0, xValue)])
            .range([0, width]),
        xMap = function(d) { return xScale(xValue(d));},
        xAxis = d3.axisBottom(xScale);
    var tickcnt = (d3.max(dataset0, xValue) === d3.min(dataset0, xValue))? 1: (d3.max(dataset0, xValue) - d3.min(dataset0, xValue));
    xAxis.ticks(tickcnt);

    // setup y
    var yValue = function(d) { return d.datapoint;},
        yScale = d3.scaleLinear()
            .domain([d3.min(dataset0, yValue),
                d3.max(dataset0, yValue)])
            .range([height, 0]),
        yMap = function(d) { return yScale(yValue(d));},
        yAxis = d3.axisLeft(yScale);

    // setup fill color
    var cValue = function(d) { return d.Country;},
        color = function(d) { return full_countrycolor[cValue(d)]; };

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
            return "<span style='color:red'>" + d.Country + "</span><br>"+
                "<strong>(" + d.time+", "+d.datapoint+")"+"</strong>";
        });

    // invoke the tip in the context of the visualization
    svg.call(tip);

    // x-axis
    xAxis.tickFormat(function(d) { return d.toString()});
  svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + (height + margin.bottom / 3) + ")")
      .call(xAxis);
  svg.append("text")
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + margin.bottom / 12) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(" +  (- margin.left / 5) + ",0)")
      .call(yAxis);
      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
          .style("font-size", "20px")
      .text(yAxistext);

      // title
      svg.append("text")
        .attr("x", width / 2)
        .attr("y",  -margin.top/2)
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text(title);

    // draw dots
  svg.selectAll(".dot")
      .data(dataset0)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 7)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(d);})
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // draw legend colored circles
    var cx = full_width - 190;
    var cy = margin.top;
    var r = 7;
    var gap = {"vertical": 20, "horizontal": 15};
    var countries = Object.keys(countrycolor).sort();
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