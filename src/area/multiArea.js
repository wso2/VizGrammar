/**
 *
 * @param chartObj
 * @returns {*}
 */
igviz.drawMultiAreaChart = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;

    if (chartConfig.aggregate != undefined) {
        return igviz.drawAggregatedMultiArea(chartObj);
    }

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
        "align": "left",
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


    if (chartConfig.interpolationMode == undefined) {
        chartConfig.interpolationMode = "monotone";
    }


    var tempMargin = 160;
    var spec = {
        "width": chartConfig.width - tempMargin,
        "height": chartConfig.height,
        //    "padding":{"top":40,"bottom":60,'left':60,"right":145},
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
        "legends": [
            {

                "orient": "right",
                "fill": "color",
                "title": "Area",
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
        "axes": [xAxis, yAxis]
        ,

        "marks": []
    };

    if (chartConfig.markerSize == undefined) {
        chartConfig.markerSize = 30;
    }
    for (i = 0; i < chartConfig.yAxis.length; i++) {
        var areaObj = {
            "type": "area",
            "key": xString,
            "from": {"data": "table"},
            "properties": {
                "enter": {
                    "x": {"scale": "x", "field": xString},
                    "interpolate": {"value": chartConfig.interpolationMode},
                    "y": {"scale": "y:prev", "field": yStrings[i]},
                    "y2": {"scale": "y:prev", "value": 0},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    },
                    "fillOpacity": {"value": 0.5}
                },
                "update": {

                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": yStrings[i]},
                    "y2": {"scale": "y", "value": 0}

                },
                "hover": {
                    "fillOpacity": {"value": 0.2}

                },
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": yStrings[i]},
                    "y2": {"scale": "y", "value": 0}
                }

            }
        };

        var lineObj = {
            "type": "line",
            "key": xString,
            "from": {"data": "table"},
            "properties": {
                "enter": {
                    "x": {"scale": "x", "field": xString},
                    "interpolate": {"value": chartConfig.interpolationMode},
                    "y": {"scale": "y:prev", "field": yStrings[i]},
                    "stroke": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    },
                    "strokeWidth": {"value": 1.5}
                },
                "update": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": yStrings[i]}
                },
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": yStrings[i]}
                }
            }
        };


        var pointObj = {
            "type": "symbol",
            "from": {"data": "table"},
            "properties": {
                "enter": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y:prev", "field": yStrings[i]},
                    "fill": {
                        "scale": "color",
                        "value": dataTable.metadata.names[chartConfig.yAxis[i]]
                    },
                    "size": {"value": chartConfig.markerSize}
                    //"fillOpacity": {"value": 0.5}
                },
                "update": {
                    "x": {"scale": "x", "field": xString},
                    "y": {"scale": "y", "field": yStrings[i]}
                },
                "exit": {
                    "x": {"value": 0},
                    "y": {"scale": "y", "field": yStrings[i]}
                },
                "hover": {
                    "size": {"value": chartConfig.markerSize * 1.5},
                    "stroke": {"value": "white"}
                }
            }
        };


        spec.marks.push(areaObj);


        if (chartConfig.pointVisible)
            spec.marks.push(pointObj);
        spec.marks.push(lineObj);
        spec.legends[0].values.push(dataTable.metadata.names[chartConfig.yAxis[i]])

    }


    chartObj.toolTipFunction = [];
    chartObj.toolTipFunction[0] = function (event, item) {

        a = 4

        console.log(tool, event, item);
        if (item.mark.marktype == 'symbol') {
            // window.alert(a);

            var xVar = dataTable.metadata.names[chartConfig.xAxis];


            var colorScale = d3.scale.category20();

            var foundIndex = -1;
            for (var index = 0; index < yStrings.length; index++)
                if (item.fill === colorScale(yStrings[index])) {
                    foundIndex = index;
                    break;
                }

            var yVar = dataTable.metadata.names[chartConfig.yAxis[foundIndex]];

            contentString = '<table><tr><td> X </td><td> (' + xVar + ') </td><td>' + item.datum.data[createAttributeNames(xVar)] + '</td></tr>' + '<tr><td> Y </td><td> (' + yVar + ') </td><td>' + item.datum.data[createAttributeNames(yVar)] + '</td></tr></table>';


            tool.html(contentString).style({
                'left': event.pageX + 10 + 'px',
                'top': event.pageY + 10 + 'px',
                'opacity': 1
            });
            tool.selectAll('tr td').style('padding', "3px");
        }
    };

    chartObj.toolTipFunction[1] = function (event) {

        tool.html("").style({
            'left': event.pageX + 10 + 'px',
            'top': event.pageY + 10 + 'px',
            'opacity': 0
        })

    };

    chartObj.spec = spec;
    chartObj.toolTip = true;
    chartObj.spec = spec;

    chartObj.spec = spec;


};
