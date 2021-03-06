window.onload = function() {
    readjson("temperature.json");
};

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

function linegraph(time, tg, start_date, end_date) {
    // draw line graph

    // canvas and context
    var canvas = document.getElementById('temperature_canvas');
    var context = canvas.getContext('2d');

    // min and max of time (x) and tg (y)
    var tg_max = 25;// actual max: 22.4
    var tg_min = -5;// actual min: -3
    var tg_step = 5;
    var time_min = start_date.getTime();
    var time_max = end_date.getTime();

    // domain and range of x and y
    var domain_x = [time_min, time_max];
    var domain_y = [tg_min, tg_max];
    var gap = 40;
    var range_x = [gap, canvas.width - gap];
    var range_y = [gap, canvas.height - gap];

    // draw a frame
    context.lineWidth = 5;
    context.strokeStyle = "#707070";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // draw title
    context.font = '25px arial';
    context.fillStyle = "black";
    context.fillText("Berkhout Average Temperature 2017", canvas.width / 2 - 200, range_y[0] - 10);

    // draw horizontal lines
    for (let i = tg_min; i <= tg_max; i += tg_step) {
        let y = canvas.height - createTransform(domain_y, range_y)(i);
        context.beginPath();
        context.moveTo(range_x[0], y);
        context.lineTo(range_x[1], y);
        context.lineWidth = 1;
        context.strokeStyle = "#a0a0a0";
        context.stroke();
        context.font = '15px arial';
        context.fillStyle = "black";
        context.fillText(i.toString(), range_x[0] / 2, y);
    }

    // draw y unit
    context.font = '20px arial';
    context.fillStyle = "blue";
    context.fillText("Temp (degrees Celsius)", range_x[0] / 2, range_y[0] / 2);

    // draw x axis
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
        let month = new Date(2017, i, 1);
        let x = createTransform(domain_x, range_x)(month.getTime());
        context.font = '15px arial';
        context.fillStyle = "black";
        context.fillText(month.getDate() + " " + months[month.getMonth()], x, range_y[1] + range_y[0] / 2);
    }

    // draw x unit
    context.font = '20px arial';
    context.fillStyle = "blue";
    context.fillText("Month", range_x[1] - 20, range_y[1] + range_y[0] / 2);

    // data coordinates
    var points = [];
    for (let i = 0; i < tg.length; i++) {
        let x = createTransform(domain_x, range_x)(time[i]);
        let y = canvas.height - createTransform(domain_y, range_y)(tg[i]);
        // let x = width * (i + 1);
        // let y = canvas.height - canvas.height * (tg[i] / tg_max);
        points.push({"x": x, "y": y});
    }

    // draw lines
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.stroke();

    // get max and min tg
    let max = [time[0], tg[0]];
    let min = [time[0], tg[0]];
    for (let i = 0; i < tg.length; i++) {
        if (tg[i] > max[1]) {
            max = [time[i], tg[i]];
        }
        if (tg[i] < min[1]) {
            min = [time[i], tg[i]];
        }
    }

    // max tg dot
    let x, y, date;
    context.beginPath();
    x = createTransform(domain_x, range_x)(max[0]);
    y = canvas.height - createTransform(domain_y, range_y)(max[1]);
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = "#ee0000";
    context.fill();
    context.font = '20px arial';
    date = new Date(max[0]);
    context.fillText("(" + date.getDate() + " " + months[date.getMonth()] + ", " + max[1] + ")", x + 10, y);

    // min tg dot
    context.beginPath();
    x = createTransform(domain_x, range_x)(min[0]);
    y = canvas.height - createTransform(domain_y, range_y)(min[1]);
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = "#ee0000";
    context.fill();
    context.font = '20px arial';
    date = new Date(min[0]);
    context.fillText("(" + date.getDate() + " " + months[date.getMonth()] + ", " + min[1] + ")", x + 10, y);
}

function createTransform(domain, range) {
    // transform data values into coordinates on canvas

    // domain is a two-element array of the data bounds [domain_min, domain_max]
    // range is a two-element array of the screen bounds [range_min, range_max]

    var domain_min = domain[0];
    var domain_max = domain[1];
    var range_min = range[0];
    var range_max = range[1];

    // formulas to calculate the alpha and the beta
    var alpha = (range_max - range_min) / (domain_max - domain_min);
    var beta = range_max - alpha * domain_max;

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
        return alpha * x + beta;
    }
}