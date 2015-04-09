

/*************************************************** Table chart ***************************************************************************************************/

function unique(array) {


    var uni = array.filter(function (itm, i, array) {
        return i == array.indexOf(itm);
    });

    return uni;
}


function aggregate(value1, value2, op) {
    var result = 0;
    switch ('op') {
        case 'sum':
            result = value1 + value2;
            break;
        case 'avg':
            result = value1 + value2;
            break;
        case 'min':
            result = value1 + value2;
            break;
        case 'max':
            result = value1 + value2;
            break;
        case 'count':
            result = value1 + value2;
            break;
    }
}

function tableTransformation(dataTable, rowIndex, columnIndex, aggregate, cellIndex) {
    var resultant = [];
    var AllRows = [];
    var AllCols = [];
    var a = 0;
    var b = 0;
    for (i = 0; i < dataTable.data.length; i++) {
        AllRows[i] = dataTable.data[i][rowIndex];

        AllCols[i] = dataTable.data[i][columnIndex];
    }
    var meta = unique(AllCols);
    var rows = unique(AllRows);


    var counter = [];
    for (i = 0; i < rows.length; i++) {
        resultant[i] = [];
        counter[i] = [];
        resultant[i][0] = rows[i];
        for (j = 0; j < meta.length; j++) {
            switch (aggregate) {
                case "max":
                    resultant[i][j + 1] = Number.MIN_VALUE;
                    break;
                case "min":
                    resultant[i][j + 1] = Number.MAX_VALUE;
                    break;
                default :
                    resultant[i][j + 1] = 0;
            }

            counter[i][j + 1] = 0;
        }
    }

//        console.log(rows,meta,resultant);


    for (i = 0; i < dataTable.data.length; i++) {
        var row = dataTable.data[i][rowIndex];
        var col = dataTable.data[i][columnIndex];
        var value = dataTable.data[i][cellIndex];

        // console.log(row,col,value,rows.indexOf(row),meta.indexOf(col))
        // resultant[rows.indexOf(row)][1+meta.indexOf(col)]+=value;

        counter[rows.indexOf(row)][1 + meta.indexOf(col)]++;
        existing = resultant[rows.indexOf(row)][1 + meta.indexOf(col)];
        existingCounter = counter[rows.indexOf(row)][1 + meta.indexOf(col)];
        //existingCounter++;
        var resultValue = 0
        switch (aggregate) {
            case "sum":
                resultValue = existing + value;
                break;
            case "min":
                resultValue = (existing > value) ? value : existing;
                break;
            case "max":
                resultValue = (existing < value) ? value : existing;
                break;
            case "avg":
                resultValue = (existing * (existingCounter - 1) + value) / existingCounter;
                break;
            case "count":
                resultValue = existingCounter;
                break;
        }

        //console.log(resultValue);
        resultant[rows.indexOf(row)][1 + meta.indexOf(col)] = resultValue;

    }

    var newDataTable = {};
    newDataTable.metadata = {};
    newDataTable.metadata.names = [];
    newDataTable.metadata.types = [];
    newDataTable.data = resultant;

    newDataTable.metadata.names[0] = dataTable.metadata.names[rowIndex] + " \\ " + dataTable.metadata.names[columnIndex];
    newDataTable.metadata.types[0] = 'C';

    for (i = 0; i < meta.length; i++) {
        newDataTable.metadata.names[i + 1] = meta[i];

        newDataTable.metadata.types[i + 1] = 'N';
    }

    console.log(newDataTable);
    return newDataTable;

}

function aggregatedTable(dataTable, groupedBy, aggregate) {
    var newDataTable = [];
    var counter = [];

    var AllRows = []
    for (i = 0; i < dataTable.data.length; i++) {
        AllRows[i] = dataTable.data[i][groupedBy];
    }

    var rows = unique(AllRows);

    for (i = 0; i < rows.length; i++) {
        newDataTable[i] = [];
        counter[i] = 0;
        for (j = 0; j < dataTable.metadata.names.length; j++) {
            if (groupedBy != j) {
                switch (aggregate) {
                    case "max":
                        newDataTable[i][j] = Number.MIN_VALUE;
                        break;
                    case "min":
                        newDataTable[i][j] = Number.MAX_VALUE;
                        break;
                    default :
                        newDataTable[i][j] = 0;
                }

            } else {
                newDataTable[i][j] = rows[i];
            }
        }


    }


    for (i = 0; i < dataTable.data.length; i++) {
        var gvalue = dataTable.data[i][groupedBy];
        counter[rows.indexOf(gvalue)]++;
        var existingRow = newDataTable[rows.indexOf(gvalue)];
        var existingCounter = counter[rows.indexOf(gvalue)];

        for (j = 0; j < existingRow.length; j++) {
            if (j != groupedBy) {
                var existing = existingRow[j];
                var value = dataTable.data[i][j];

                var resultValue = 0
                switch (aggregate) {
                    case "sum":
                        resultValue = existing + value;
                        break;
                    case "min":
                        resultValue = (existing > value) ? value : existing;
                        break;
                    case "max":
                        resultValue = (existing < value) ? value : existing;
                        break;
                    case "avg":
                        resultValue = (existing * (existingCounter - 1) + value) / existingCounter;
                        break;
                    case "count":
                        resultValue = existingCounter;
                        break;
                }

                //console.log(resultValue);
                newDataTable[rows.indexOf(gvalue)][j] = resultValue;
            }
        }


    }


    console.log(newDataTable);
    return newDataTable;

}

igviz.drawTable = function (divId, chartConfig, dataTable) {
    var w = chartConfig.width;
    var h = chartConfig.height;
    var padding = chartConfig.padding;
    var dataSeries = chartConfig.dataSeries;
    var highlightMode = chartConfig.highlightMode;


    if (chartConfig.rowIndex != undefined && chartConfig.columnIndex != undefined) {

        dataTable = tableTransformation(dataTable, chartConfig.rowIndex, chartConfig.columnIndex, chartConfig.aggregate, chartConfig.cellIndex);
        //chartConfig.colorBasedStyle=true;

    } else if (chartConfig.aggregate != undefined) {
        dataTable = aggregatedTable(dataTable, chartConfig.groupedBy, chartConfig.aggregate);

    }


    var dataset = dataTable.data.map(function (d) {
        return {
            "data": d,
            "config": chartConfig
        }
    });
    //remove the current table if it is already exist
    d3.select(divId).select("table").remove();

    var rowLabel = dataTable.metadata.names;
    var tableData = dataTable.data;

    //Using RGB color code to represent colors
    //Because the alpha() function use these property change the contrast of the color
    var colors = [{
        r: 255,
        g: 0,
        b: 0
    }, {
        r: 0,
        g: 255,
        b: 0
    }, {
        r: 200,
        g: 100,
        b: 100
    }, {
        r: 200,
        g: 255,
        b: 250
    }, {
        r: 255,
        g: 140,
        b: 100
    }, {
        r: 230,
        g: 100,
        b: 250
    }, {
        r: 0,
        g: 138,
        b: 230
    }, {
        r: 165,
        g: 42,
        b: 42
    }, {
        r: 127,
        g: 0,
        b: 255
    }, {
        r: 0,
        g: 255,
        b: 255
    }];

    //function to change the color depth
    //default domain is set to [0, 100], but it can be changed according to the dataset
    var alpha = d3.scale.linear().domain([0, 100]).range([0, 1]);

    //append the Table to the div
    var table = d3.select(divId).append("table").attr('class', 'table table-bordered');

    var colorRows = d3.scale.linear()
        .domain([2.5, 4])
        .range(['#F5BFE8', '#E305AF']);

    var fontSize = d3.scale.linear()
        .domain([0, 100])
        .range([15, 20]);

    //create the table head
    thead = table.append("thead");
    tbody = table.append("tbody")

    //Append the header to the table
    thead.append("tr")
        .selectAll("th")
        .data(rowLabel)
        .enter()
        .append("th")
        .text(function (d) {
            return d;
        });

    var isColorBasedSet = chartConfig.colorBasedStyle;
    var isFontBasedSet = chartConfig.fontBasedStyle;

    var rows = tbody.selectAll("tr")
        .data(tableData)
        .enter()
        .append("tr")

    var cells;

    if (!chartConfig.heatMap) {
        if (isColorBasedSet == true && isFontBasedSet == true) {

            //adding the  data to the table rows
            cells = rows.selectAll("td")

                //Lets do a callback when we get each array from the data set
                .data(function (d, i) {
                    return d;
                })
                //select the table rows (<tr>) and append table data (<td>)
                .enter()
                .append("td")
                .text(function (d, i) {
                    return d;
                })
                .style("font-size", function (d, i) {


                    fontSize.domain([
                        d3.min(parseColumnFrom2DArray(tableData, i)),
                        d3.max(parseColumnFrom2DArray(tableData, i))
                    ]);
                    return fontSize(d) + "px";
                })
                .style('background-color', function (d, i) {

                    //This is where the color is decided for the cell
                    //The domain set according to the data set we have now
                    //Minimum & maximum values for the particular data column is used as the domain
                    alpha.domain([d3.min(parseColumnFrom2DArray(tableData, i)), d3.max(parseColumnFrom2DArray(tableData, i))]);

                    //return the color for the cell
                    return 'rgba(' + colors[i].r + ',' + colors[i].g + ',' + colors[i].b + ',' + alpha(d) + ')';

                });

        } else if (isColorBasedSet && !isFontBasedSet) {
            //adding the  data to the table rows
            cells = rows.selectAll("td")

                //Lets do a callback when we get each array from the data set
                .data(function (d, i) {
                    return d;
                })
                //select the table rows (<tr>) and append table data (<td>)
                .enter()
                .append("td")
                .text(function (d, i) {
                    return d;
                })
                .style('background-color', function (d, i) {

                    //This is where the color is decided for the cell
                    //The domain set according to the data set we have now
                    //Minimum & maximum values for the particular data column is used as the domain
                    alpha.domain([
                        d3.min(parseColumnFrom2DArray(tableData, i)),
                        d3.max(parseColumnFrom2DArray(tableData, i))
                    ]);

                    //return the color for the cell
                    return 'rgba(' + colors[i].r + ',' + colors[i].g + ',' + colors[i].b + ',' + alpha(d) + ')';

                });

        } else if (!isColorBasedSet && isFontBasedSet) {

            //adding the  data to the table rows
            cells = rows.selectAll("td")

                //Lets do a callback when we get each array from the data set
                .data(function (d, i) {
                    return d;
                })
                //select the table rows (<tr>) and append table data (<td>)
                .enter()
                .append("td")
                .text(function (d, i) {
                    return d;
                })
                .style("font-size", function (d, i) {

                    fontSize.domain([
                        d3.min(parseColumnFrom2DArray(tableData, i)),
                        d3.max(parseColumnFrom2DArray(tableData, i))
                    ]);
                    return fontSize(d) + "px";
                });

        } else {
            console.log("We are here baby!");
            //appending the rows inside the table body
            rows.style('background-color', function (d, i) {

                colorRows.domain([
                    d3.min(parseColumnFrom2DArray(tableData, chartConfig.xAxis)),
                    d3.max(parseColumnFrom2DArray(tableData, chartConfig.xAxis))
                ]);
                return colorRows(d[chartConfig.xAxis]);
            })
                .style("font-size", function (d, i) {

                    fontSize.domain([
                        d3.min(parseColumnFrom2DArray(tableData, i)),
                        d3.max(parseColumnFrom2DArray(tableData, i))
                    ]);
                    return fontSize(d) + "px";
                });

            //adding the  data to the table rows
            cells = rows.selectAll("td")
                //Lets do a callback when we get each array from the data set
                .data(function (d, i) {
                    return d;
                })
                //select the table rows (<tr>) and append table data (<td>)
                .enter()
                .append("td")
                .text(function (d, i) {
                    return d;
                })
        }
    }
    else {
        //console.log("done");

        var minimum = dataTable.data[0][1];
        var maximum = dataTable.data[0][1];
        for (j = 0; j < dataTable.data.length; j++) {
            for (a = 0; a < dataTable.metadata.names.length; a++) {
                if (dataTable.metadata.types[a] == 'N') {

                    if (dataTable.data[j][a] > maximum) {
                        maximum = dataTable.data[j][a];
                    }

                    if (dataTable.data[j][a] < minimum) {
                        minimum = dataTable.data[j][a];
                    }

                }

            }
        }


        alpha.domain([minimum, maximum]);
        cells = rows.selectAll("td")

            //Lets do a callback when we get each array from the data set
            .data(function (d, i) {
                console.log(d, i);
                return d;
            })
            //select the table rows (<tr>) and append table data (<td>)
            .enter()
            .append("td")
            .text(function (d, i) {
                return d;
            })

            .style('background-color', function (d, i) {




                //      console.log(d,i,'rgba(' + colors[0].r + ',' + colors[0].g + ',' + colors[0].b + ',' + alpha(d) + ')')
                ;
                return 'rgba(' + colors[0].r + ',' + colors[0].g + ',' + colors[0].b + ',' + alpha(d) + ')';

            });

    }
    return table;
};

