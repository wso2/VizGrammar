

igviz.drawAggregatedBar = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;
    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis]);
    var yString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    var operation = "sum";
    if (chartConfig.aggregate != undefined) {
        operation = chartConfig.aggregate;
    }

    var transFormedYString = "data." + operation + "_" + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);


    if (operation == "count") {
        transFormedYString = "data.count";
    }

    console.log(xString, yString, transFormedYString, operation);

    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",
        "round": true,
        "field": xString,
        "dataFrom": "myTable"
    };


    var yScaleConfig = {
        "type": "linear",
        "name": "y",
        "range": "height",
        "nice": true,
        "field": transFormedYString,
        "dataFrom": "myTable"
    };

    var xScale = setScale(xScaleConfig);
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
    };
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
    };
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);
    var title = setTitle(chartConfig.title);

    if (chartConfig.barColor == undefined) {
        chartConfig.barColor = "steelblue";
    }


    chartObj.spec = {
        "width": chartConfig.width - 150,
        //"padding":{'top':30,"left":80,"right":80,'bottom':60},
        "height": chartConfig.height,
        "data": [
            {
                "name": "table"
            },
            {
                "name": "myTable",
                "source": 'table',
                "transform": [
                    {
                        "type": "aggregate",
                        "groupby": [xString],
                        "fields": [
                            {"op": operation, "field": yString}
                        ]
                    }
                ]
            }
        ],
        "scales": [
            xScale, yScale
        ],
        "axes": [
            xAxis, yAxis, title


        ],
        "marks": [
            {
                "key": xString,

                "type": "rect",
                "from": {"data": "myTable"},
                "properties": {
                    "enter": {
                        "x": {"scale": "x", "field": xString},
                        "width": {"scale": "x", "band": true, "offset": -10},
                        "y": {"scale": "y:prev", "field": transFormedYString},
                        "y2": {"scale": "y", "value": 0}


                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": transFormedYString},
                        "y2": {"scale": "y", "value": 0},
                        "fill": {"value": chartConfig.barColor}
                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y:prev", "field": transFormedYString},
                        "y2": {"scale": "y", "value": 0}
                    },

                    "hover": {

                        "fill": {'value': 'orange'}
                    }
                }
            }
        ]
    }


};
