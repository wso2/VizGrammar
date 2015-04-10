

/*************************************************** Scatter chart ***************************************************************************************************/

igviz.drawScatterPlot = function (chartObj) {
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;

    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis]);
    var yString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);
    var rString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.pointSize]);
    var cString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.pointColor]);


    var xScaleConfig = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "x",
        "range": "width",

        "field": xString

    };

    var rScaleConfig = {
        "index": chartConfig.pointSize,
        "range": [0, 576],
        "schema": dataTable.metadata,
        "name": "r",
        "field": rString
    };
    var cScaleConfig = {
        "index": chartConfig.pointColor,
        "schema": dataTable.metadata,
        "name": "c",
        "range": [chartConfig.minColor, chartConfig.maxColor],
        "field": cString
    };

    var yScaleConfig = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "y",
        "range": "height",
        "nice": true,
        "field": yString
    };

    var xScale = setScale(xScaleConfig);
    var yScale = setScale(yScaleConfig);
    var rScale = setScale(rScaleConfig);
    var cScale = setScale(cScaleConfig);

    var xAxisConfig = {
        "type": "x",
        "scale": "x",
        "angle": -35,
        "title": dataTable.metadata.names[chartConfig.xAxis],
        "grid": true,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": 25,
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
        "titleDy": -30,
        "titleDx": 0
    };
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);

    var spec = {
        "width": chartConfig.width - 130,
        "height": chartConfig.height,
        //"padding":{"top":40,"bottom":60,'left':60,"right":60},
        "data": [
            {
                "name": "table"

            }
        ],
        "scales": [
            xScale, yScale,
            {
                "name": "color", "type": "ordinal", "range": "category20"
            },
            rScale, cScale
        ],
        "axes": [xAxis, yAxis
        ],
        //"legends": [
        //    {
        //
        //        "orient": "right",
        //        "fill": "color",
        //        "title": "Legend",
        //        "values": [],
        //        "properties": {
        //            "title": {
        //                "fontSize": {"value": 14}
        //            },
        //            "labels": {
        //                "fontSize": {"value": 12}
        //            },
        //            "symbols": {
        //                "stroke": {"value": "transparent"}
        //            },
        //            "legend": {
        //                "stroke": {"value": "steelblue"},
        //                "strokeWidth": {"value": 1.5}
        //
        //            }
        //        }
        //    }],


        //    "scales": [
        //    {
        //        "name": "x",
        //        "nice": true,
        //        "range": "width",
        //        "domain": {"data": "iris", "field": "data.sepalWidth"}
        //    },
        //    {
        //        "name": "y",
        //        "nice": true,
        //        "range": "height",
        //        "domain": {"data": "iris", "field": "data.petalLength"}
        //    },
        //    {
        //        "name": "c",
        //        "type": "ordinal",
        //        "domain": {"data": "iris", "field": "data.species"},
        //        "range": ["#800", "#080", "#008"]
        //    }
        //],
        //    "axes": [
        //    {"type": "x", "scale": "x", "offset": 5, "ticks": 5, "title": "Sepal Width"},
        //    {"type": "y", "scale": "y", "offset": 5, "ticks": 5, "title": "Petal Length"}
        //],
        //    "legends": [
        //    {
        //        "fill": "c",
        //        "title": "Species",
        //        "offset": 0,
        //        "properties": {
        //            "symbols": {
        //                "fillOpacity": {"value": 0.5},
        //                "stroke": {"value": "transparent"}
        //            }
        //        }
        //    }
        //],
        "marks": [
            {
                "type": "symbol",
                "from": {"data": "table"},
                "properties": {
                    "enter": {
                        "x": {"scale": "x", "field": xString},
                        "y": {"scale": "y", "field": yString},
                        "fill": {"scale": "c", "field": cString}
                        //"fillOpacity": {"value": 0.5}
                    },
                    "update": {
                        "size": {"scale": "r", "field": rString}
                        // "stroke": {"value": "transparent"}
                    },
                    "hover": {
                        "size": {"value": 300},
                        "stroke": {"value": "white"}
                    }
                }
            }
        ]
    };
    chartObj.toolTipFunction = [];
    chartObj.toolTipFunction[0] = function (event, item) {
        console.log(tool, event, item);
        xVar = dataTable.metadata.names[chartConfig.xAxis];
        yVar = dataTable.metadata.names[chartConfig.yAxis];
        pSize = dataTable.metadata.names[chartConfig.pointSize];
        pColor = dataTable.metadata.names[chartConfig.pointColor];

        contentString = '<table><tr><td> X </td><td> (' + xVar + ') </td><td>' + item.datum.data[xVar] + '</td></tr>' + '<tr><td> Y </td><td> (' + yVar + ') </td><td>' + item.datum.data[yVar] + '</td></tr>' + '<tr><td> Size </td><td> (' + pSize + ') </td><td>' + item.datum.data[pSize] + '</td></tr>' + '<tr><td bgcolor="' + item.fill + '">&nbsp; </td><td> (' + pColor + ') </td><td>' + item.datum.data[pColor] + '</td></tr>' +
        '</table>';


        tool.html(contentString).style({
            'left': event.pageX + 10 + 'px',
            'top': event.pageY + 10 + 'px',
            'opacity': 1
        });
        tool.selectAll('tr td').style('padding', "3px");

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
};
