
/**
 * This function will calculate the stacked y-value for grouped x-values , And draws the Stacked area graph
 * @namespace igviz
 * @param chartObj :{config,dataTable,divID:}
 * @return :void
 */
igviz.drawStackedAreaChart = function (chartObj) {

    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;


    //setting data attributes for vega spec
    var areaString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.areaVar]);
    var yStrings = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.yAxis]);

    var xString = "data." + createAttributeNames(dataTable.metadata.names[chartConfig.xAxis]);



    //Scale for grouped X axis
    var cat = {
        "index": chartConfig.xAxis,
        "schema": dataTable.metadata,
        "name": "cat",
        "range": "width",
        "field": xString,
        "padding": 0.2,
        "zero": false,
        "nice": true
    };


    //Scale for stacked y values
    var val = {
        "index": chartConfig.yAxis,
        "schema": dataTable.metadata,
        "name": "val",
        "range": "height",
        "dataFrom": "stats",
        "field": "sum", //aggregation
        "nice": true
    };


    var cScale = setScale(cat);
    var vScale = setScale(val);

    var xAxisConfig = {
        "type": "x",
        "scale": "cat",
        "angle": 0,
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
        "scale": "val",
        "angle": 0,
        "title": dataTable.metadata.names[chartConfig.yAxis],
        "grid": true,
        "dx": 0,
        "dy": 0,
        "align": "right",
        "titleDy": -10,
        "titleDx": 0
    };
    var xAxis = setAxis(xAxisConfig);
    var yAxis = setAxis(yAxisConfig);


    chartObj.spec = {
        "width": chartConfig.width - 160,
        "height": chartConfig.height - 100,
        "padding": {"top": 10, "left": 60, "bottom": 60, "right": 100},
        "data": [
            {
                "name": "table"
            },
            {
                "name": "stats", //apply grouped by and aggregate transformations
                "source": "table",
                "transform": [
                    {"type": "facet", "keys": [xString]},
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
                "title": dataTable.metadata.names[chartConfig.areaVar
                    ],
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
                        {"type": "facet", "keys": [areaString]},
                        {"type": "stack", "point": xString, "height": yStrings}
                    ]
                },
                "marks": [
                    {
                        "type": "area",
                        "properties": {
                            "enter": {
                                "interpolate": {"value": "monotone"},
                                "x": {"scale": "cat", "field": xString},
                                "y": {"scale": "val", "field": "y"},
                                "y2": {"scale": "val", "field": "y2"},
                                "fill": {"scale": "color", "field": areaString},
                                "fillOpacity": {"value": 0.8}

                            },
                            "update": {
                                "fillOpacity": {"value": 0.8}
                            },
                            "hover": {
                                "fillOpacity": {"value": 0.5}
                            }
                        }
                    },
                    {
                        "type": "line",
                        "properties": {
                            "enter": {
                                "x": {"scale": "cat", "field": xString},
                                "interpolate": {"value": "monotone"},
                                "y": {"scale": "val", "field": "y"},
                                "stroke": {"scale": "color", "field": areaString},
                                "strokeWidth": {"value": 3}
                            }
                        }
                    }
                ]
            }
        ]
    };
    chartObj.legend = true;
    chartObj.legendIndex = chartConfig.areaVar;


};
