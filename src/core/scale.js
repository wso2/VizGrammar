
//Constructor for Scale object

igviz.Scale = (function () {
    var scale = function (scaleConfig) {

        this.scale = {"name": scaleConfig.name};

        var scale = this.scale;

        var dataFrom = "table";
        this.scale.range = scaleConfig.range;
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
    };
    return scale;
})();


igviz.scale = function (scaleConfig) {
    return new igviz.Scale(scaleConfig);
};
