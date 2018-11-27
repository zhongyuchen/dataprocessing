function text() {
    // build all the texts on html

    // title
    d3.select("head").append("title").text("Renewable Energy in KTOE, 2016");

    // head of html
    d3.select("div").append("h1").text("Week_4: D3 Barchart");
    d3.select("div").append("h2").text("Zhongyu Chen, 12455822");

    // bar chart title
    d3.select("#barchart").append("h2").text("Renewable Energy in KTOE (thousand tonne of oil equivalent), 2016");

    // data sourse
    var p = d3.select("#barchart").append("p").text("Data Source: ");
    p.append("a").text("OECD Renewable energy").attr("href", "https://data.oecd.org/energy/renewable-energy.htm");

    // description
    d3.select("#barchart").append("p")
        .text("Description: " +
            "Renewable energy measured in KTOE (thousand tonne of oil equivalent) of 35 countries in 2016. " +
            "OECD (in total) has 512203.649 KTOE. " +
            "USA has the highest 152533.691 KTOE. " +
            "LUX has the lowest 206.526 KTOE. " +
            "Hover over any bar for its exact value!");
}