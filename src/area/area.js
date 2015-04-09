
igviz.drawAreaChart = function (chartObj) {
    // var padding = chartConfig.padding;
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;


    if (chartConfig.yAxis.constructor === Array) {
        return this.drawMultiAreaChart(chartObj)
    } else if (chartConfig.aggregate != undefined) {

        return this.drawAggregatedArea(chartObj);

    }


    if (chartConfig.hasOwnProperty("areaVar")) {
        return this.drawStackedAreaChart(chartObj);
    }


    var divId = chartObj.canvas;


    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    //   console.log(table,xString,yStrings);
    // sortDataSet(table);

    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",
        "field": xString
    }


    var yScaleConfig = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "y",
        "range": "height",
        "field": yStrings
    }


    var xScale = setScale(xScaleConfig)
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
        "titleDy": -10,
        "titleDx": 0
    }
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);

    if (chartConfig.interpolationMode == undefined) {
        chartConfig.interpolationMode = "monotone"
    }


    var tempMargin = 100;
    var spec = {
        "width": chartConfig.width - 100,
        "height": chartConfig.height,
        //  "padding":{"top":40,"bottom":60,'left':60,"right":40},
        "data": [
            {
                "name": "table"

            }
        ],
        "scales": [
            xScale, yScale,
            {
                "name": "color", "type": "ordinal", "range": "category10"
            }
        ],

        "axes": [xAxis, yAxis]
        ,

        "marks": [
            {
                "type": "area",
                "key": xString,
                "from": {"data": "table"},
                "properties": {
                    "enter": {
                        "x": {"value": chartConfig.width - tempMargin},
                        "interpolate": {"value": chartConfig.interpolationMode},

                        "y": {"scale": "y:prev", "field": yStrings},
                        "y2": {"scale": "y:prev", "value": 0},
                        "fill": {"scale": "color", "value": 2},
                        "fillOpacity": {"value": 0.5}
                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": yStrings},
                        "y2": {"scale": "y", "value": 0}

                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": yStrings},
                        "y2": {"scale": "y", "value": 0}
                    },
                    "hover": {
                        "fillOpacity": {"value": 0.2}

                    }

                }
            },
            {
                "type": "line",
                "key": xString,

                "from": {"data": "table"},
                "properties": {
                    "enter": {
                        "x": {"value": chartConfig.width - tempMargin},
                        "interpolate": {"value": chartConfig.interpolationMode},
                        "y": {"scale": "y:prev", "field": yStrings},
                        "stroke": {"scale": "color", "value": 2},
                        "strokeWidth": {"value": 1.5}
                    },
                    "update": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": yStrings}
                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": yStrings}
                    }
                }
            },

        ]
    }


    if (chartConfig.pointVisible) {
        if (chartConfig.markerSize == undefined) {
            chartConfig.markerSize = 30;
        }

        spec.marks.push(
            {
                "type": "symbol",
                "from": {"data": "table"},
                "properties": {
                    "enter": {
                        "x": {"value": chartConfig.width - tempMargin},
                        "y": {"scale": "y:prev", "field": yStrings},
                        "fill": {"scale": "color", "value": 2},
                        "size": {"value": chartConfig.markerSize}
                        //"fillOpacity": {"value": 0.5}
                    },
                    "update": {
                        "size": {"value": 50},

                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": yStrings}
                        //"size": {"scale":"r","field":rString},
                        // "stroke": {"value": "transparent"}
                    },
                    "exit": {
                        "x": {"value": 0},
                        "y": {"scale": "y", "field": yStrings}
                    },
                    "hover": {
                        "size": {"value": chartConfig.markerSize},
                        "stroke": {"value": "white"}
                    }
                }
            })
    }

    chartObj.toolTipFunction = [];
    chartObj.toolTipFunction[0] = function (event, item) {


        console.log(tool, event, item);
        if (item.mark.marktype == 'symbol') {

            xVar = dataTable.metadata.names[chartConfig.xAxis]
            yVar = dataTable.metadata.names[chartConfig.yAxis]

            contentString = '<table><tr><td> X </td><td> (' + xVar + ') </td><td>' + item.datum.data[createAttributeNames(xVar)] + '</td></tr>' + '<tr><td> Y </td><td> (' + yVar + ') </td><td>' + item.datum.data[createAttributeNames(yVar)] + '</td></tr></table>';


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

    chartObj.spec = spec;
    chartObj.toolTip = true;
    chartObj.spec = spec;


};
