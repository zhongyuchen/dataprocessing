// Zhongyu Chen, 12455822, zhongyuchen@yahoo.com
// linkedviews.js for drawing the linked views

window.onload = function() {
    readcsv('data/asylum_seekers.csv');
};

function readcsv(filename) {
    d3.csv(filename).then(function(csvdata) {
        // read csv file

        console.log(csvdata);

    });
}