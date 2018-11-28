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