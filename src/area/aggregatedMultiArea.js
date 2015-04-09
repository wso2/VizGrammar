

igviz.drawAggregatedMultiArea = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;

    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings = [];
    var operation = "sum";

    if (chartConfig.aggregate != undefined) {
        operation = chartConfig.aggregate;
    }

    var transFormedYStrings = [];
    var newFields = [];
    for (i = 0; i < chartConfig.yAxis.length; i++) {
        yStrings[i] = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis[i]])
        transFormedYStrings[i] = "data." + operation + "_" + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis[i]]);
        newFields.push({"op": operation, "field": yStrings[i]})
    }
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
        "field": transFormedYStrings[0],
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
        "title": "values",
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
                        "fields": newFields
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
    }

    if (chartConfig.markerSize == undefined) {
        chartConfig.markerSize = 30;
    }


    for (i = 0; i < chartConfig.yAxis.length; i++) {
        var areaObj = {
            "type": "area",
            "key": xString,
            "from": {"data": "myTable"},
            "properties": {
                "enter": {
                    "x": {"scale": "x", "field": xString},
                    "interpolate": {"value": chartConfig.interpolationMode},
                    "y": {"scale": "y:prev", "field": transFormedYStrings[i]},
                    "y2": {"scale": "y:prev", "value": 0},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    },
                    "fillOpacity": {"value": 0.5}
                },
                "update": {

                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": transFormedYStrings[i]},
                    "y2": {"scale": "y", "value": 0}

                },
                "hover": {
                    "fillOpacity": {"value": 0.2}

                },
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": transFormedYStrings[i]},
                    "y2": {"scale": "y", "value": 0}
                }

            }
        }


        var markObj = {
            "type": "line",
            "key": xString,
            "from": {"data": "myTable"},
            "properties": {
                "enter": {
                    "x": {"value": chartConfig.width - 100},
                    "interpolate": {"value": chartConfig.interpolationMode},
                    "y": {"scale": "y:prev", "field": transFormedYStrings[i]},
                    "stroke": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    },
                    "strokeWidth": {"value": 1.5}
                },
                "update": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": transFormedYStrings[i]}
                },
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": transFormedYStrings[i]}
                }
            }
        };


        var pointObj = {
            "type": "symbol",

            "key": xString,
            "from": {"data": "myTable"},
            "properties": {
                "enter": {
                    //"x":{"value":400},
                    "x": {"value": chartConfig.width - 100},
                    "y": {"scale": "y:prev", "field": transFormedYStrings[i]},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                        //"fillOpacity": {"value": 0.5}

                    },
                    "size": {"value": chartConfig.markerSize}


                },
                "update": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": transFormedYStrings[i]}

                }
                ,
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": transFormedYStrings[i]},
                    "fillOpacity": {"value": 0}
                }
            }
        }


        spec.marks.push(areaObj);
        spec.marks.push(markObj);

        if (chartConfig.pointVisible)
            spec.marks.push(pointObj);
        spec.legends[0].values.push(dataTable.metadata.names[chartConfig.yAxis[i]])

    }

    chartObj.toolTipFunction = [];
    chartObj.toolTipFunction[0] = function (event, item) {

        console.log(tool, event, item);
        if (item.mark.marktype == 'symbol') {
            var xVar = dataTable.metadata.names[chartConfig.xAxis]


            var colorScale = d3.scale.category20()

            var foundIndex = -1;
            for (index = 0; index < yStrings.length; index++)
                if (item.fill === colorScale(yStrings[index])) {
                    foundIndex = index;
                    break;
                }

            var yVar = dataTable.metadata.names[chartConfig.yAxis[foundIndex]]

            contentString = '<table><tr><td> X </td><td> (' + xVar + ') </td><td>' + item.datum.data[createAttributeNames(xVar)] + '</td></tr>' + '<tr><td> Y </td><td> (' + yVar + ') </td><td>' + item.datum.data[chartConfig.aggregate + "_" + createAttributeNames(yVar)] + '</td></tr></table>';


            tool.html(contentString).style({
                'left': event.pageX + 10 + 'px',
                'top': event.pageY + 10 + 'px',
                'opacity': 1
            })
            tool.selectAll('tr td').style('padding', "3px");
        }
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
