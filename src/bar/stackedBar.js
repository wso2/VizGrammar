

igviz.drawStackedBarChart = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;
    //   var table = setData(dataTable,chartConfig);
    var divId = chartObj.canvas;


    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis])
    var yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    var groupedBy = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.groupedBy]);

    // console.log(table,xString,yStrings,groupedBy);
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
        "dataFrom": "stats",
        "field": "sum",
        "nice": true
    }


    var cScale = setScale(cat)
    var vScale = setScale(val);

    var xAxisConfig = {
        "type": "x",
        "scale": "cat",
        "angle": 0,
        "title": dataTable.metadata.names[chartConfig.groupedBy],
        "grid": false,
        "dx": -10,
        "dy": 10,
        "align": "right",
        "titleDy": 10,
        "titleDx": 0
    }
    var yAxisConfig = {
        "type": "y",
        "scale": "val",
        "angle": 0,
        "title": dataTable.metadata.names[chartConfig.yAxis],
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
        "width": chartConfig.width - 160,
        "height": chartConfig.height - 100,
        "padding": {"top": 10, "left": 60, "bottom": 60, "right": 100},
        "data": [
            {
                "name": "table"
            },
            {
                "name": "stats",
                "source": "table",
                "transform": [
                    {"type": "facet", "keys": [groupedBy]},
                    {"type": "stats", "value": yStrings}
                ]
            }
        ],
        "scales": [
            cScale,
            vScale,
            {
                "name": "color",
                "type": "ordinal",
                "range": "category20"
            }
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

        "axes": [
            xAxis, yAxis
        ],

        "marks": [
            {
                "type": "group",
                "from": {
                    "data": "table",
                    "transform": [
                        {"type": "facet", "keys": [xString]},
                        {"type": "stack", "point": groupedBy, "height": yStrings}
                    ]
                },
                "marks": [
                    {
                        "type": "rect",
                        "properties": {
                            "enter": {
                                "x": {"scale": "cat", "field": groupedBy},
                                "width": {"scale": "cat", "band": true, "offset": -1},
                                "y": {"scale": "val", "field": "y"},
                                "y2": {"scale": "val", "field": "y2"},
                                "fill": {"scale": "color", "field": xString}
                            },
                            "update": {
                                "fillOpacity": {"value": 1}
                            },
                            "hover": {
                                "fillOpacity": {"value": 0.5}
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
