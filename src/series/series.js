

igviz.drawSeries = function (chartObj) {
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;


    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis]);
    var yStrings = [];

    for (var i = 0; i < chartConfig.yAxis.length; i++) {
        yStrings[i] = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis[i]])
    }


    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",
        "clamp": false,
        "field": xString
    };

    var yScaleConfig = {
        "index": chartConfig.yAxis[0],
        "schema": dataTable.metadata,
        "name": "y",
        "range": "height",
        "nice": true,
        "field": yStrings[0]
    };

    var xScale = setScale(xScaleConfig);
    var yScale = setScale(yScaleConfig);

    var xAxisConfig = {
        "type": "x",
        "scale": "x",
        "angle": -35,
        "title": dataTable.metadata.names[chartConfig.xAxis],
        "grid": true,
        "dx": -10,
        "dy": 10,
        "align": "right",
        "titleDy": 10,
        "titleDx": 0
    };
    var yAxisConfig = {
        "type": "y",
        "scale": "y",
        "angle": 0,
        "title": "values",
        "grid": true,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": -10,
        "titleDx": 0
    };
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);

    var tempMargin = 160;
    var spec = {
        "width": chartConfig.width - tempMargin,
        "height": chartConfig.height,
        //  "padding":{"top":40,"bottom":60,'left':90,"right":150},
        "data": [
            {
                "name": "table"

            }
        ],
        "scales": [
            xScale, yScale,
            {
                "name": "color", "type": "ordinal", "range": "category20"
            }
        ],
        "axes": [xAxis, yAxis
        ],
        "legends": [
            {

                "orient": "right",
                "fill": "color",
                "title": "Legend",
                "values": [],
                "properties": {
                    "title": {
                        "fontSize": {"value": 14}
                    },
                    "labels": {
                        "fontSize": {"value": 12}
                    },
                    "symbols": {
                        "stroke": {"value": "transparent"}
                    },
                    "legend": {
                        "stroke": {"value": "steelblue"},
                        "strokeWidth": {"value": 1.5}

                    }
                }
            }
        ],

        "marks": []
    };

    for (i = 0; i < chartConfig.yAxis.length; i++) {
        var markObj = {
            "type": "rect",
            "key": xString,
            "from": {"data": "table"},
            "properties": {
                "enter": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": yStrings[i]},
                    "y2": {"scale": "y", "value": 0},
                    "width": {"value": 2},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    }
                    //"strokeWidth": {"value": 1.5}
                }
            }
        };
        var pointObj = {
            "type": "symbol",

            "key": xString,
            "from": {"data": "table"},
            "properties": {
                "enter": {
                    //"x":{"value":400},
                    " x": {"value": chartConfig.width - tempMargin},
                    "y": {"scale": "y:prev", "field": yStrings[i]},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                        //"fillOpacity": {"value": 0.5}
                    }
                },
                "update": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": yStrings[i]}

                }
                ,
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": yStrings[i]},
                    "fillOpacity": {"value": 0}
                }
            }
        };


        if (chartConfig.lineMark)
            spec.marks.push(markObj);

        if (chartConfig.pointMark)
            spec.marks.push(pointObj);
        spec.legends[0].values.push(dataTable.metadata.names[chartConfig.yAxis[i]])


    }
    chartObj.spec = spec;
};