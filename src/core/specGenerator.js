


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
                scale["type"] = 'ordinal';
                if (scale.name === "c") {
                    scale.range = "category20";
                }

                break;
            case 'N':
                scale["type"] = 'linear';

                break;
        }
    } else {
        scale["type"] = scaleConfig.type;
    }

    if (scaleConfig.hasOwnProperty("dataFrom")) {
        dataFrom = scaleConfig.dataFrom;
    }

    scale.range = scaleConfig.range;
    scale.domain = {"data": dataFrom, "field": scaleConfig.field};

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
    return {
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
    };

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

    };

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

function setData(dataTableObj, schema) {
    var table = [];
    for (var i = 0; i < dataTableObj.length; i++) {
        var ptObj = {};
        var namesArray = schema.names;
        for (var j = 0; j < namesArray.length; j++) {
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
    str=str.replace('.','_')
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


    console.log("previous Axis", spec);
    for (var prop in axisConfig) {

        if (prop == "tickSize" || prop == "tickPadding")
            continue;

        if (axisConfig.hasOwnProperty(prop)) {

            if (prop.indexOf("label") == 0)
                spec.properties.labels[MappingObj[prop]].value = axisConfig[prop];
            else if (prop.indexOf("ticks") == 0)
                spec.properties.ticks[MappingObj[prop]].value = axisConfig[prop];
            else if (prop.indexOf("title") == 0 && prop != "title")
                spec.properties.title[MappingObj[prop]].value = axisConfig[prop];
            else if (prop == 'title')
                spec.title = axisConfig[prop];
            else if (prop.indexOf("axis") == 0)
                spec.properties.axis[MappingObj[prop]].value = axisConfig[prop];
            else
                spec[MappingObj[prop]] = axisConfig[prop];
        }
    }

    console.log("NEW SPEC", spec);
}
