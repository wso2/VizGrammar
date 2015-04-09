


/*************************************************** Specification Generation method ***************************************************************************************************/


function setScale(scaleConfig) {
    var scale = {"name": scaleConfig.name};
    console.log(scaleConfig.schema, scaleConfig.index);
    var dataFrom = "table";
    scale.range = scaleConfig.range;

    if (scaleConfig.index != undefined) {
        switch (scaleConfig.schema.types[scaleConfig.index]) {
            case 'T':
                scale["type"] = 'time';

                break;
            case 'U':
                scale["type"] = 'utc';
                break;

            case 'C':
                scale["type"] = 'ordinal'
                if (scale.name === "c") {
                    scale.range = "category20";
                }

                break;
            case 'N':
                scale["type"] = 'linear'

                break;
        }
    } else {
        scale["type"] = scaleConfig.type;
    }

    if (scaleConfig.hasOwnProperty("dataFrom")) {
        dataFrom = scaleConfig.dataFrom;
    }

    scale.range = scaleConfig.range;
    scale.domain = {"data": dataFrom, "field": scaleConfig.field}

    //optional attributes
    if (scaleConfig.hasOwnProperty("round")) {
        scale["round"] = scaleConfig.round;
    }

    if (scaleConfig.hasOwnProperty("nice")) {
        scale["nice"] = scaleConfig.nice;
    }

    if (scaleConfig.hasOwnProperty("padding")) {
        scale["padding"] = scaleConfig.padding;
    }

    if (scaleConfig.hasOwnProperty("reverse")) {
        scale["reverse"] = scaleConfig.reverse;
    }

    if (scaleConfig.hasOwnProperty("sort")) {
        scale["sort"] = scaleConfig.sort;
    }

    if (scale.name == 'x' && scale.type == 'linear') {
        scale.sort = true;
    }
    if (scaleConfig.hasOwnProperty("clamp")) {
        scale["clamp"] = scaleConfig.clamp;
    }


    if (scaleConfig.hasOwnProperty("zero")) {
        scale["zero"] = scaleConfig.zero;
    }
    console.log(scale);
    return scale;

}

function setTitle(str, color, fontSize, orient) {
    var title = {
        "type": "x",
        "scale": "x",
        "title": str,
        "orient": orient,
        "values": [],
        "properties": {
            "title": {
                "fill": {
                    "value": color
                },
                "fontSize": {
                    "value": fontSize
                }
            },
            "axis": {
                "strokeOpacity": {
                    "value": 0
                }
            }
        }
    }
    return title;

}


function setAxis(axisConfig) {
    console.log("Axis", axisConfig);
    var axis = {
        "type": axisConfig.type,
        "scale": axisConfig.scale,
        'title': axisConfig.title,
        "grid": axisConfig.grid,

        "properties": {
            "ticks": {
                // "stroke": {"value": "steelblue"}
            },
            "majorTicks": {
                "strokeWidth": {"value": 2}
            },
            "labels": {
                // "fill": {"value": "steelblue"},
                "angle": {"value": axisConfig.angle},
                // "fontSize": {"value": 14},
                "align": {"value": axisConfig.align},
                "baseline": {"value": "middle"},
                "dx": {"value": axisConfig.dx},
                "dy": {"value": axisConfig.dy}
            },
            "title": {
                "fontSize": {"value": 16},

                "dx": {'value': axisConfig.titleDx},
                "dy": {'value': axisConfig.titleDy}
            },
            "axis": {
                "stroke": {"value": "#333"},
                "strokeWidth": {"value": 1.5}
            }

        }

    }

    if (axisConfig.hasOwnProperty("tickSize")) {
        axis["tickSize"] = axisConfig.tickSize;
    }


    if (axisConfig.hasOwnProperty("tickPadding")) {
        axis["tickPadding"] = axisConfig.tickPadding;
    }

    console.log("SpecAxis", axis);
    return axis;
}

function setLegends(chartConfig, schema) {

}

function setData(dataTableObj, chartConfig, schema) {
    var table = [];
    for (i = 0; i < dataTableObj.length; i++) {
        var ptObj = {};
        var namesArray = schema.names;
        for (j = 0; j < namesArray.length; j++) {
            if (schema.types[j] == 'T') {
                ptObj[createAttributeNames(namesArray[j])] = new Date(dataTableObj[i][j]);
            } else if (schema.types[j] == 'U') {
                ptObj[createAttributeNames(namesArray[j])] = (new Date(dataTableObj[i][j])).getTime();
            } else
                ptObj[createAttributeNames(namesArray[j])] = dataTableObj[i][j];
        }


        table[i] = ptObj;
    }
    console.log(table);
    return table;
}

function createAttributeNames(str) {
    return str.replace(' ', '_');
}

function setGenericAxis(axisConfig, spec) {
    var MappingObj = {};
    MappingObj["tickSize"] = "tickSize";
    MappingObj["tickPadding"] = "tickPadding";
    MappingObj["title"] = "title";
    MappingObj["grid"] = "grid";
    MappingObj["offset"] = "offset";
    MappingObj["ticks"] = "ticks";

    MappingObj["labelColor"] = "fill";
    MappingObj["labelAngle"] = "angle";
    MappingObj["labelAlign"] = "align";
    MappingObj["labelFontSize"] = "fontSize";
    MappingObj["labelDx"] = "dx";
    MappingObj["labelDy"] = "dy";
    MappingObj["labelBaseLine"] = "baseline";

    MappingObj["titleDx"] = "dx";
    MappingObj["titleDy"] = "dy";
    MappingObj["titleFontSize"] = "fontSize";

    MappingObj["axisColor"] = "stroke";
    MappingObj["axisWidth"] = "strokeWidth";

    MappingObj["tickColor"] = "stroke";
    MappingObj["tickWidth"] = "strokeWidth";


    console.log("previous Axis", spec)
    for (var propt in axisConfig) {

        if (propt == "tickSize" || propt == "tickPadding")
            continue;

        if (axisConfig.hasOwnProperty(propt)) {

            if (propt.indexOf("label") == 0)
                spec.properties.labels[MappingObj[propt]].value = axisConfig[propt];
            else if (propt.indexOf("ticks") == 0)
                spec.properties.ticks[MappingObj[propt]].value = axisConfig[propt];
            else if (propt.indexOf("title") == 0 && propt != "title")
                spec.properties.title[MappingObj[propt]].value = axisConfig[propt];
            else if (propt == 'title')
                spec.title = axisConfig[propt];
            else if (propt.indexOf("axis") == 0)
                spec.properties.axis[MappingObj[propt]].value = axisConfig[propt];
            else
                spec[MappingObj[propt]] = axisConfig[propt];
        }
    }

    console.log("NEW SPEC", spec);
}

function createScales(dataset, chartConfig, dataTable) {
    //Create scale functions
    var xScale;
    var yScale;
    var colorScale;
    if (dataTable.metadata.types[chartConfig.xAxis] == 'N') {
        xScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function (d) {
                return d.data[d.config.xAxis];
            })])
            .range([chartConfig.padding, chartConfig.width - chartConfig.padding]);
    } else {
        xScale = d3.scale.ordinal()
            .domain(dataset.map(function (d) {
                return d.data[chartConfig.xAxis];
            }))
            .rangeRoundBands([chartConfig.padding, chartConfig.width - chartConfig.padding], .1)
    }

    //TODO hanle case r and color are missing

    if (dataTable.metadata.types[chartConfig.yAxis] == 'N') {
        yScale = d3.scale.linear()
            .domain([0, d3.max(dataset, function (d) {
                return d.data[d.config.yAxis];
            })])
            .range([chartConfig.height - chartConfig.padding, chartConfig.padding]);
        //var yScale = d3.scale.linear()
        //    .range([height, 0])
        //    .domain([0, d3.max(dataset, function(d) { return d.data[d.config.yAxis]; })])
    } else {
        yScale = d3.scale.ordinal()
            .rangeRoundBands([0, chartConfig.width], .1)
            .domain(dataset.map(function (d) {
                return d.data[chartConfig.yAxis];
            }))
    }


    //this is used to scale the size of the point, it will value between 0-20
    var rScale = d3.scale.linear()
        .domain([0, d3.max(dataset, function (d) {
            return d.config.pointSize ? d.data[d.config.pointSize] : 20;
        })])
        .range([0, 20]);

    //TODO have to handle the case color scale is categorical : Done
    //http://synthesis.sbecker.net/articles/2012/07/16/learning-d3-part-6-scales-colors
    // add color to circles see https://www.dashingd3js.com/svg-basic-shapes-and-d3js
    //add legend http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
    if (dataTable.metadata.types[chartConfig.pointColor] == 'N') {
        colorScale = d3.scale.linear()
            .domain([-1, d3.max(dataset, function (d) {
                return d.config.pointColor ? d.data[d.config.pointColor] : 20;
            })])
            .range([chartConfig.minColor, chartConfig.maxColor]);
    } else {
        colorScale = d3.scale.category20c();
    }

    //TODO add legend


    return {
        "xScale": xScale,
        "yScale": yScale,
        "rScale": rScale,
        "colorScale": colorScale
    }
}
