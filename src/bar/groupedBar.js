

igviz.drawGroupedBarChart = function (chartObj) {
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;
    //  var table = setData(dataTable,chartConfig);
    var divId = chartObj.canvas;


    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    var groupedBy = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.groupedBy]);

    //  console.log(table,xString,yStrings,groupedBy);
    // sortDataSet(table);

    var cat = {
        "index": chartConfig.groupedBy,
        "schema": dataTable.metadata,
        "name": "cat",
        "range": "height",
        "field": groupedBy,
        "padding": 0.2
    }


    var val = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "val",
        "range": "width",
        "round": 'true',
        "field": yStrings,
        "nice": true
    }


    var cScale = setScale(cat)
    var vScale = setScale(val);

    var xAxisConfig = {
        "type": "x",
        "scale": "val",
        "angle": -35,
        "title": dataTable.metadata.names[chartConfig.yAxis],
        "grid": true,
        "dx": -10,
        "dy": 10,
        "align": "right",
        "titleDy": 10,
        "titleDx": 0
    }
    var yAxisConfig = {
        "type": "y",
        "scale": "cat",
        "angle": 0,
        "tickSize": 0,
        "tickPadding": 8,
        "title": dataTable.metadata.names[chartConfig.groupedBy],
        "grid": false,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": -10,
        "titleDx": 0
    }
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);


    var spec = {
        "width": chartConfig.width,
        "height": chartConfig.height,

        "data": [
            {
                "name": "table"
            }
        ],
        "scales": [
            cScale, vScale,
            {
                "name": "color",
                "type": "ordinal",
                "range": "category20"
            }
        ],
        "axes": [
            xAxis, yAxis
        ],
        "legends": [
            {
                "orient": {"value": "right"},
                "fill": "color",
                "title": dataTable.metadata.names[chartConfig.xAxis],
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
                        "strokeWidth": {"value": 0.5}


                    }
                }
            }
        ],


        "marks": [
            {
                "type": "group",
                "from": {
                    "data": "table",
                    "transform": [{"type": "facet", "keys": [groupedBy]}]
                },
                "properties": {
                    "enter": {
                        "y": {"scale": "cat", "field": "key"},
                        "height": {"scale": "cat", "band": true}
                    }
                },
                "scales": [
                    {
                        "name": "pos",
                        "type": "ordinal",
                        "range": "height",
                        "domain": {"field": xString}
                    }
                ],
                "marks": [
                    {
                        "type": "rect",
                        "properties": {
                            "enter": {
                                "y": {"scale": "pos", "field": xString},
                                "height": {"scale": "pos", "band": true},
                                "x": {"scale": "val", "field": yStrings},
                                "x2": {"scale": "val", "value": 0},
                                "fill": {"scale": "color", "field": xString}
                            },
                            "hover": {
                                "fillOpacity": {"value": 0.5}
                            }
                            ,

                            "update": {
                                "fillOpacity": {"value": 1}
                            }
                        }
                    },
                    //{
                    //    "type": "text",
                    //    "properties": {
                    //        "enter": {
                    //            "y": {"scale": "pos", "field": xString},
                    //            "dy": {"scale": "pos", "band": true, "mult": 0.5},
                    //            "x": {"scale": "val", "field": yStrings, "offset": -4},
                    //            "fill": {"value": "white"},
                    //            "align": {"value": "right"},
                    //            "baseline": {"value": "middle"},
                    //            "text": {"field": xString}
                    //        }
                    //    }
                    //}
                ]
            }
        ]
    }

    chartObj.legend = true;
    chartObj.legendIndex = chartConfig.xAxis;
    chartObj.spec = spec;

}


igviz.drawGroupedBarChartVertical = function (chartObj) {
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;
    //  var table = setData(dataTable,chartConfig);
    var divId = chartObj.canvas;


    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    var groupedBy = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.groupedBy]);

    //  console.log(table,xString,yStrings,groupedBy);
    // sortDataSet(table);

    var cat = {
        "index": chartConfig.groupedBy,
        "schema": dataTable.metadata,
        "name": "cat",
        "range": "width",
        "field": groupedBy,
        "padding": 0.2
    }


    var val = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "val",
        "range": "height",
        "round": 'true',
        "field": yStrings,
        "nice": true
    }


    var cScale = setScale(cat)
    var vScale = setScale(val);

    var yAxisConfig = {
        "type": "y",
        "scale": "val",
        "angle": -35,
        "title": dataTable.metadata.names[chartConfig.yAxis],
        "grid": true,
        "dx": -10,
        "dy": 10,
        "align": "right",
        "titleDy": 10,
        "titleDx": 0
    }
    var xAxisConfig = {
        "type": "x",
        "scale": "cat",
        "angle": 0,
        "tickSize": 0,
        "tickPadding": 8,
        "title": dataTable.metadata.names[chartConfig.groupedBy],
        "grid": false,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": -10,
        "titleDx": 0
    }
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);


    var spec = {
        "width": chartConfig.width - 150,
        "height": chartConfig.height,
        "data": [
            {
                "name": "table"
            }
        ],
        "scales": [
            cScale, vScale,
            {
                "name": "color",
                "type": "ordinal",
                "range": "category20"
            }
        ],
        "axes": [
            xAxis, yAxis
        ],
        "legends": [
            {
                "orient": {"value": "right"},
                "fill": "color",
                "title": dataTable.metadata.names[chartConfig.xAxis],
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
                        "strokeWidth": {"value": 0.5}


                    }
                }
            }
        ],


        "marks": [
            {
                "type": "group",
                "from": {
                    "data": "table",
                    "transform": [{"type": "facet", "keys": [groupedBy]}]
                },
                "properties": {
                    "enter": {
                        "x": {"scale": "cat", "field": "key"},
                        "width": {"scale": "cat", "band": true}
                    }
                },
                "scales": [
                    {
                        "name": "pos",
                        "type": "ordinal",
                        "range": "width",
                        "domain": {"field": xString}
                    }
                ],
                "marks": [
                    {
                        "type": "rect",
                        "properties": {
                            "enter": {
                                "x": {"scale": "pos", "field": xString},
                                "width": {"scale": "pos", "band": true},
                                "y": {"scale": "val", "field": yStrings},
                                "y2": {"scale": "val", "value": 0},
                                "fill": {"scale": "color", "field": xString}
                            },
                            "hover": {
                                "fillOpacity": {"value": 0.5}
                            }
                            ,

                            "update": {
                                "fillOpacity": {"value": 1}
                            }
                        }
                    }
                ]
            }
        ]
    }

    chartObj.legend = true;
    chartObj.legendIndex = chartConfig.xAxis;
    chartObj.spec = spec;

}
