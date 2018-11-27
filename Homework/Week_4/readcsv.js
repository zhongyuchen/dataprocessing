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