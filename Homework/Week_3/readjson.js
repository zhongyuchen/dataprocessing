function readjson(filename) {
    // read json file

    let txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function() {
        if (txtFile.readyState === 4 && txtFile.status == 200) {
            // parse data
            data = JSON.parse(txtFile.responseText);

            // preprocess data and save needed data
            // x and y
            var time = [];
            var tg = [];
            // start date and end date
            var start_date = new Date("2017/01/01");
            var end_date = new Date("2017/12/31");

            data.forEach(function(element) {
                // console.log(element);
                element["YYYYMMDD"] = new Date(element["YYYYMMDD"].substring(0, 4) + "/" + element["YYYYMMDD"].substring(4, 6) + "/" + element["YYYYMMDD"].substring(6, 8));
                element["TIME"] = element["YYYYMMDD"].getTime();
                element["TG"] = parseFloat(element["TG"]) / 10;
                element["TN"] = parseFloat(element["TN"]) / 10;
                element["TX"] = parseFloat(element["TX"]) / 10;
                 if (element["YYYYMMDD"] > start_date && element["YYYYMMDD"] < end_date) {
                    time.push(element["TIME"]);
                    tg.push(element["TG"])
                }
            });
            // console.log(time);
            // console.log(tg);

            linegraph(time, tg, start_date, end_date);
        }
    };
    txtFile.open("GET", filename);
    txtFile.send();
}