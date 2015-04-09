
/*************************************************** Bar chart ***************************************************************************************************/

igviz.drawBarChart = function (mychart, divId, chartConfig, dataTable) {
    //  console.log(this);
    var divId = mychart.canvas;
    var chartConfig = mychart.config;
    var dataTable = mychart.dataTable;
    if (chartConfig.hasOwnProperty('aggregate')) {

        return this.drawAggregatedBar(mychart);
    }
    if (chartConfig.hasOwnProperty("groupedBy")) {
        var format = "grouped";
        if (chartConfig.hasOwnProperty("format")) {
            format = chartConfig.format;

        }
        if (format == "grouped") {
            console.log("groupedDFJSDFKSD:JFKDJF");
            if (chartConfig.orientation == 'H') {
                console.log('horizontal');
                return this.drawGroupedBarChart(mychart);

            }
            return this.drawGroupedBarChartVertical(mychart);
        }
        else {
            return this.drawStackedBarChart(mychart);
        }
    }

    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis]);
    var yString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis])

    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",
        "round": true,
        "field": xString
    }

    var yScaleConfig = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "y",
        "range": "height",
        "nice": true,
        "field": yString
    }

    var xScale = setScale(xScaleConfig)
    var yScale = setScale(yScaleConfig);

    var xAxisConfig = {
        "type": "x",
        "scale": "x",
        "angle": -35,
        "title": dataTable.metadata.names[chartConfig.xAxis],
        "grid": false,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": 30,
        "titleDx": 0
    }
    var yAxisConfig = {
        "type": "y",
        "scale": "y",
        "angle": 0,
        "title": dataTable.metadata.names[chartConfig.yAxis],
        "grid": true,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": -35,
        "titleDx": 0
    }
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);

    if (chartConfig.barColor == undefined) {
        chartConfig.barColor = "steelblue";
    }

//        console.log(table)
    var spec = {

        "width": chartConfig.width - 150,
        //"padding":{'top':30,"left":80,"right":80,'bottom':60},
        "height": chartConfig.height,
        "data": [
            {
                "name": "table"
            }
        ],
        "scales": [
            xScale,
            yScale
        ],
        "axes": [
            xAxis,
            yAxis


        ],
        "marks": [
            {
                "key": xString,
                "type": "rect",
                "from": {"data": "table"},
                "properties": {
                    "enter": {
                        "x": {"scale": "x", "field": xString},
                        "width": {"scale": "x", "band": true, "offset": -10},
                        "y": {"scale": "y:prev", "field": yString},
                        "y2": {"scale": "y", "value": 0}


                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": yString},
                        "y2": {"scale": "y", "value": 0},
                        "fill": {"value": chartConfig.barColor}
                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y:prev", "field": yString},
                        "y2": {"scale": "y", "value": 0}
                    },

                    "hover": {

                        "fill": {'value': 'orange'}
                    }

                }
            }
        ]
    }


//        var data = {table: table}

    mychart.originalWidth = chartConfig.width;
    mychart.originalHeight = chartConfig.height;

    mychart.spec = spec;

};
