var map = function(dataTable, config) {

    this.metadata = dataTable[0].metadata;
    var marks ;
    var signals ;
    var predicates = [];
    var legends = [];
    this.spec = {};
    var geoInfoJson ;

    geoInfoJson = loadGeoMapCodes(config.helperUrl);
    config = checkConfig(config, this.metadata);
    this.config = config;
    this.config.geoInfoJson = geoInfoJson;

    $.each(dataTable[0].values, function( i, val ) {

        for (var key in dataTable[0].values[i]) {
            if(key == dataTable[0].metadata.names[config.x]){
                if (dataTable[0].values[i].hasOwnProperty(key)) {
                    dataTable[0].values[i][key] = getMapCode(dataTable[0].values[i][key], config.mapType,geoInfoJson);
                    break;
                }
            }
        }
    });

    dataTable[0].name = config.title;
    dataTable[0].transform = [
        {
            "type": "formula",
            "field": "v",
            "expr": "datum."+this.metadata.names[config.y]
        }
    ];

    marks = getMapMark(config, this.metadata);
    signals = getMapSignals();
    dataTable.push(getTopoJson(config,this.metadata));
    predicates.push(getMapPredicates());
    legends.push(getMapLegends(config,this.metadata));

    var cScale = {
        "name": "color",
        "type": "linear",
        "domain": {"data": "geoData","field": "zipped.v"},
        "domainMin": 0.0,
        "zero": false,
        "range":  ["#FFEDBC", "#f83600"]
    };

    var scales =  [cScale];

    this.spec.width = config.width;
    this.spec.height = config.height;
    this.spec.data = dataTable;
    this.spec.scales = scales;
    this.spec.padding = config.padding;
    this.spec.marks = marks;
    this.spec.signals = signals;
    this.spec.predicates = predicates;
    this.spec.legends = legends;

};

map.prototype.draw = function(div) {
    var viewUpdateFunction = (function(chart) {
        this.view = chart({el:div}).update();
    }).bind(this);

    vg.parse.spec(this.spec, viewUpdateFunction);
};

map.prototype.insert = function(data) {

    var xAxis = this.metadata.names[this.config.x];
    var yAxis = this.metadata.names[this.config.y];
    var color = this.metadata.names[this.config.color];
    var mapType = this.config.mapType;
    var geoInfoJson = this.config.geoInfoJson;

    $.each(data, function( i, val ) {

        for (var key in data[i]) {
            if(key == xAxis){
                if (data[i].hasOwnProperty(key)) {
                    data[i][key] = getMapCode(data[i][key], mapType,geoInfoJson);
                    break;
                }
            }
        }
    });

    for (i = 0; i < data.length; i++) {
        var isValueMatched = false;
        this.view.data(this.config.title).update(function(d) {
                return d[xAxis] == data[i][xAxis]; },
            yAxis,
            function(d) {
                isValueMatched = true;
                return data[i][yAxis];
            });

        this.view.data(this.config.title).update(function(d) {
                return d[xAxis] == data[i][xAxis]; },
            color,
            function(d) {
                isValueMatched = true;
                return data[i][color];
            });


        if(!isValueMatched){
            this.view.data(this.config.title).insert([data[i]]);
        }
    }
    this.view.update();

};

function getTopoJson(config, metadata){

    var mapUrl = config.geoCodesUrl;

    var json = {

        "name": "geoData",
        "url": mapUrl,
        "format": {"type": "topojson","feature": "units"},
        "transform": [
            {
                "type": "geopath",
                "value": "data",
                "scale": (config.width/640)*100,
                "translate": [config.width/2,config.height/2],
                "projection": "equirectangular"
            },
            {
                "type": "lookup",
                "keys": ["id"],
                "on": config.title,
                "onKey": metadata.names[config.x],
                "as": ["zipped"],
                "default": {"v": null, "country":"No data"}
            }
        ]
    }

    return json;

}

function getMapMark(config, metadata){

    var mark = [

        {
            "name": "map",
            "type": "path",
            "from": {"data": "geoData"},
            "properties": {
                "enter": {"path": {"field": "layout_path"}},
                "update": {
                    "fill":{
                        "rule": [
                            {
                                "predicate": {
                                    "name": "isNotNull",
                                    "id": {"field": "zipped.v"}
                                },
                                "scale": "color",
                                "field": "zipped.v"
                            },
                            {"value": "grey"}
                        ]
                    }
                },
                "hover": {"fill": {"value": "#989898"}}
            }
        },
        {
            "name": "debugIsDragging",
            "type": "text",
            "properties": {
                "enter": {
                    "x": {"value": 250},
                    "y": {"value": 0},
                    "fill": {"value": "black"}
                },
                "update": {"text": {"signal": "isClicked.boolVal"}}
            }
        },
        {
            "name": "zoomIn",
            "type": "path",
            "transform": [
                {
                    "type": "geopath",
                    "value": "zipped.v",
                    "scale": 100,
                    "translate": [200,100],
                    "projection": "equirectangular"
                }
            ]
        },
        {
            "type": "group",
            "from": {"data": config.title,
                "transform": [
                    {
                        "type": "filter",
                        "test": "datum."+metadata.names[config.x]+" == tooltipSignal.datum."+metadata.names[config.x]+""
                    }
                ]},
            "properties": {
                "update": {
                    "x": {"signal": "tooltipSignal.x", "offset": -5},
                    "y": {"signal": "tooltipSignal.y", "offset": 20},
                    "width": {"value": 100},
                    "height": {"value": 30},
                    "fill": {"value": "#ffa"},
                    "background-color": {"value": 0.85},
                    "stroke": {"value": "#aaa"}
                }
            },
            "marks": [
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 14},
                            "text": {"template": "\u007b{tooltipSignal.datum."+metadata.names[config.x]+"}} \u007b{tooltipSignal.datum.v}}"},
                            "fill": {"value": "black"},
                            "fontWeight": {"value": "bold"}
                        }
                    }
                }
            ]
        }

    ]


    return mark;
}

function getMapSignals(){

    var signals = [
        {
            "name": "tooltipSignal",
            "init": {"expr": "{x: 0, y: 0, datum: {} }"},
            "streams": [
                {
                    "type": "@map:mouseover",
                    "expr": "{x: eventX(), y: eventY(), datum: eventItem().datum.zipped}"
                },
                {
                    "type": "@map:mouseout",
                    "expr": "{x: 0, y: 0, datum: {} }"
                }
            ]
        },
        {
            "name": "isClicked",
            "init": false,
            "streams": [
                {
                    "type": "@map:mousedown",
                    "expr": "{x: eventX(), y: eventY(), datum: eventItem().datum.zipped, boolVal:true}"

                },
                {
                    "type": "@map:mouseup",
                    "expr": "{x: 0, y: 0, datum: {}, boolVal:false}"

                }
            ]
        }
    ]

    return signals;
}

function getMapPredicates(){

    var predicates = {

        "name": "isNotNull",
        "type": "!=",
        "operands": [{"value": null}, {"arg": "id"}]
    }

    return predicates;
}

function getMapLegends(config, metadata){

    var legends = {

        "fill": "color",
        "title": metadata.names[config.y],
        "properties": {
            "gradient": {
                "stroke": {"value": "transparent"}
            },
            "title": {
                "fontSize": {"value": 14}
            },
            "legend": {
                "x": {"value": 0},
                "y": {"value": config.height - 40}
            }
        }
    }

    return legends;
}

function loadGeoMapCodes(url){

    var geoMapCodes;
    var fileName = url;
    $.ajaxSetup({async: false});
    $.getJSON(fileName, function(json) {
        geoMapCodes = json;
    });
    $.ajaxSetup({async: true});

    return geoMapCodes;
}

function getMapCode(name, region, worldMapCodes) {
    if (region == "usa") {
        $.each(usaMapCodes, function (i, location) {
            if (usaMapCodes[name] != null && usaMapCodes[name] != "") {
                name = "US"+usaMapCodes[name];
            }
        });

    } else {
        $.each(worldMapCodes, function (i, location) {
            if (name.toUpperCase() == location["name"].toUpperCase()) {
                name = location["alpha-3"];
            }
        });
    }
    return name;
};