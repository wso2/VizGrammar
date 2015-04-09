

igviz.drawAggregatedArea = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;

    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings;
    var operation = "sum";

    if (chartConfig.aggregate != undefined) {
        operation = chartConfig.aggregate;
    }

    var transFormedYStrings;
    var newFields = [];
    yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis])
    transFormedYStrings = "data." + operation + "_" + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    console.log("values", newFields, transFormedYStrings, yStrings);
    if (operation == "count") {
        transFormedYStrings = "data.count";
    }

    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",
        "round": true,
        "field": xString,
        "clamp": false,
        "dataFrom": "myTable"
    }

    var yScaleConfig = {
        "type": "linear",
        "name": "y",
        "range": "height",
        "nice": true,
        "field": transFormedYStrings,
        "dataFrom": "myTable"
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
    var title = setTitle(chartConfig.title, "black", 12, "top");


    if (chartConfig.interpolationMode == undefined) {
        chartConfig.interpolationMode = "monotone";
    }


    var spec = {
        "width": chartConfig.width - 170,
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
                        "fields": [{"op": operation, "field": yStrings}]
                    }
                ]
            }
        ],
        "scales": [
            xScale, yScale, {
                "name": "color", "type": "ordinal", "range": "category20"
            }
        ],
        "axes": [
            xAxis, yAxis, title

        ],
        "marks": [
            {
                "type": "area",
                "key": xString,
                "from": {"data": "myTable"},
                "properties": {
                    "enter": {
                        "x": {"scale": "x", "field": xString},
                        "interpolate": {"value": chartConfig.interpolationMode},
                        "y": {"scale": "y:prev", "field": transFormedYStrings},
                        "y2": {"scale": "y:prev", "value": 0},
                        "fill": {
                            "scale": "color",
                            "value": dataTable.metadata.names[chartConfig.yAxis]
                        },
                        "fillOpacity": {"value": 0.5}
                    },
                    "update": {

                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": transFormedYStrings},
                        "y2": {"scale": "y", "value": 0}

                    },
                    "hover": {
                        "fillOpacity": {"value": 0.2}

                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": transFormedYStrings},
                        "y2": {"scale": "y", "value": 0}
                    }

                }
            },
            {
                "type": "line",
                "key": xString,
                "from": {"data": "myTable"},
                "properties": {
                    "enter": {
                        "x": {"value": chartConfig.width - 100},
                        "interpolate": {"value": chartConfig.interpolationMode},
                        "y": {"scale": "y:prev", "field": transFormedYStrings},
                        "stroke": {
                            "scale": "color",
                            "value": dataTable.metadata.names[chartConfig.yAxis]
                        },
                        "strokeWidth": {"value": 1.5}
                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": transFormedYStrings}
                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": transFormedYStrings}
                    }
                }
            },
            {
                "type": "symbol",

                "key": xString,
                "from": {"data": "myTable"},
                "properties": {
                    "enter": {
                        //"x":{"value":400},
                        "x": {"value": chartConfig.width - 100},
                        "y": {"scale": "y:prev", "field": transFormedYStrings},
                        "fill": {
                            "scale": "color",
                            "value": dataTable.metadata.names[chartConfig.yAxis]
                            //"fillOpacity": {"value": 0.5}
                        }
                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": transFormedYStrings}

                    }
                    ,
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": transFormedYStrings},
                        "fillOpacity": {"value": 0}
                    }
                }
            }


        ]
    }


    chartObj.toolTipFunction = [];
    chartObj.toolTipFunction[0] = function (event, item) {

        console.log(tool, event, item);
        if (item.mark.marktype == 'symbol') {
            xVar = dataTable.metadata.names[chartConfig.xAxis]
            yVar = dataTable.metadata.names[chartConfig.yAxis]

            contentString = '<table><tr><td> X </td><td> (' + xVar + ') </td><td>' + item.datum.data[xVar] + '</td></tr>' + '<tr><td> Y </td><td> (' + yVar + ') </td><td>' + item.datum.data[yVar] + '</td></tr></table>';


            tool.html(contentString).style({
                'left': event.pageX + 10 + 'px',
                'top': event.pageY + 10 + 'px',
                'opacity': 1
            })
            tool.selectAll('tr td').style('padding', "3px");

        }

        chartObj.toolTipFunction[1] = function (event, item) {

            tool.html("").style({
                'left': event.pageX + 10 + 'px',
                'top': event.pageY + 10 + 'px',
                'opacity': 0
            })

        }

        //   chartObj.spec=spec;
        chartObj.toolTip = true;
        chartObj.spec = spec;


    }
}
