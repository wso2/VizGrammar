/**
 * Created by tharindu on 4/9/15.
 */

    //Constructor for Axis object

igviz.Axis = (function () {
    var axis = function (axisConfig) {
        this.axis = {
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
            this.axis["tickSize"] = axisConfig.tickSize;
        }


        if (axisConfig.hasOwnProperty("tickPadding")) {
            this.axis["tickPadding"] = axisConfig.tickPadding;
        }

    }


    return axis;

})()


igviz.axes = function (axisConfig) {
    return new igviz.Axis(axisConfig)
}

