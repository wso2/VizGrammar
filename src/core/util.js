

/*************************************************** Util  functions ***************************************************************************************************/


/**
 * Get the average of a numeric array
 * @param data
 * @returns average
 */
function getAvg(data) {

    var sum = 0;

    for (var i = 0; i < data.length; i++) {
        sum = sum + data[i];
    }

    var average = (sum / data.length).toFixed(4);
    return average;
}

/**
 * Function to calculate the standard deviation
 * @param values
 * @returns sigma(standard deviation)
 */
function standardDeviation(values) {
    var avg = getAvg(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = getAvg(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

/**
 * Get the p(x) : Helper function for the standard deviation
 * @param x
 * @param sigma
 * @param u
 * @returns {number|*}
 */
function pX(x, sigma, u) {

    p = (1 / Math.sqrt(2 * Math.PI * sigma * sigma)) * Math.exp((-(x - u) * (x - u)) / (2 * sigma * sigma));

    return p;
}


/**
 * Get the normalized values for a list of elements
 * @param xVals
 * @returns {Array} of normalized values
 *
 */
function NormalizationCoordinates(xVals) {

    var coordinates = [];

    var u = getAvg(xVals);
    var sigma = standardDeviation(xVals);

    for (var i = 0; i < xVals.length; i++) {

        coordinates[i] = {
            x: xVals[i],
            y: pX(xVals[i], sigma, u)
        };
    }

    return coordinates;
}

/**
 * This function will extract a column from a multi dimensional array
 * @param 2D array
 * @param index of column to be extracted
 * @return array of values
 */

function parseColumnFrom2DArray(dataset, index) {

    var array = [];

    //console.log(dataset.length);
    //console.log(dataset[0].data);
    //console.log(dataset[1].data);

    for (var i = 0; i < dataset.length; i++) {
        array.push(dataset[i][index])
    }

    return array;
}





igviz.extend = function (obj) {
    for (var x, name, i = 1, len = arguments.length; i < len; ++i) {
        x = arguments[i];
        for (name in x) {
            obj[name] = x[name];
        }
    }
    return obj;
};



