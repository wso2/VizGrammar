/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License./
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var area = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      var xScale = {
                    "name": "x",
                    "type": this.metadata.types[config.x],
                    "range": "width",
                    "zero": config.zero,
                    "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
                    };

      var yScale = {
                "name": "y",
                "type": this.metadata.types[config.y],
                "range": "height",
                "zero": "false",
                "domain": {"data":  config.title, "field": this.metadata.names[config.y]}
                };
      
      var scales =  [xScale, yScale]; 

      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      marks.push(getAreaMark(config, this.metadata));
      config.fillOpacity  = 0;
      config.markSize = 1000;
      marks.push(getSymbolMark(config, this.metadata));
      
      if (config.tooltip) {
          marks.push(getToolTipMark(config, this.metadata));
          signals = getSignals(config,this.metadata);
          this.spec.signals = signals;
      }
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
};

area.prototype.draw = function(div, callbacks) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

       if (callbacks != null) {
          for (var i = 0; i<callbacks.length; i++) {
            this.view.on(callbacks[i].type, callbacks[i].callback);
          }
       }

    }).bind(this);

    if(this.config.maxLength != -1){
        var dataset = this.spec.data[0].values;
        var maxValue = this.config.maxLength;
        if(dataset.length >= this.config.maxLength){
            var allowedDataSet = [];
            var startingPoint = dataset.length - maxValue;
            for(var i = startingPoint; i < dataset.length;i++){
                allowedDataSet.push(dataset[i]);
            }
            this.spec.data[0].values = allowedDataSet;
        }
    }

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

area.prototype.insert = function(data) {
    //Removing events when max value is enabled
    if (this.config.maxLength != -1 && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {
        var removeFunction = (function(d) { 
          return d[this.metadata.names[this.config.x]] == oldData; 
        }).bind(this);

        for (i = 0; i < data.length; i++) {
          var oldData = this.view.data(this.config.title).values()[i][this.metadata.names[this.config.x]];
          this.view.data(this.config.title).remove(removeFunction);  
        }
    } 

     this.view.data(this.config.title).insert(data);
     this.view.update();
};

area.prototype.getSpec = function() {
  return this.spec;
};


function getAreaMark(config, metadata){
        var mark = {
                        "type": "area",
                        "from": {"data": config.title},
                        "properties": {
                          "update": {

                            "x": {"scale": "x", "field": metadata.names[config.x]},
                            "y": {"scale": "y", "field": metadata.names[config.y]},
                            "y2": {"scale": "y", "value": 0},
                            "fill": { "value": config.markColor},
                            "strokeWidth": {"value": 2},
                            "fillOpacity": {"value": 1}
                          },
                          "hover": {
                            "fillOpacity": {"value": 0.5}
                          }
                        }
                    };

        return mark;
}

;
var bar = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      var scales =[];
      this.spec = {};
      var yColumn;
      var yDomain;

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;
      
      if (config.color != -1) {
        var aggregateData = {
            "name": "stack",
            "source": config.title,
            "transform": [
              {
                "type": "aggregate",
                "groupby": [this.metadata.names[config.x]],
                "summarize": [{"field": this.metadata.names[config.y], "ops": ["sum"]}]
              }
            ]
          };

          var legendTitle = "Legend";

      if (config.title != "table") {
          legendTitle = config.title;
      }



        dataTable.push(aggregateData);

        if (config.colorDomain == null) {
              config.colorDomain = {"data":  config.title, "field": this.metadata.names[config.color]};
          }

          var colorScale = {
            "name": "color", 
            "type": "ordinal", 
            "domain": config.colorDomain,
            "range": config.colorScale
          };

          scales.push(colorScale);

              var legends = [
                      {
                      "fill": "color",
                      "title": "Legend",
                      "offset": 0,
                      "properties": {
                        "symbols": {
                          "fillOpacity": {"value": 0.5},
                          "stroke": {"value": "transparent"}
                        }
                      }
                    }
                    ];

          this.spec.legends = legends;
          yColumn = "sum_"+ this.metadata.names[config.y];
          yDomain = "stack";

      } else {
        yColumn = this.metadata.names[config.y];
        yDomain = config.title;
      }

      var xScale = {
              "name": "x",
              "type": "ordinal",
              "range": "width",
              "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
              };

      var yScale = {
          "name": "y",
          "type": this.metadata.types[config.y],
          "range": "height",
          "domain": {"data": yDomain, "field": yColumn}
          };
      
      scales.push(xScale);
      scales.push(yScale);



      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      if (config.color != -1 && config.mode == "stack") {
        marks.push(getStackBarMark(config, this.metadata));
      } else {
        marks.push(getBarMark(config, this.metadata));
      }
      
      if (config.tooltip) {
        marks.push(getToolTipMark(config, this.metadata));
        config.hoverType = "rect";
        signals = getSignals(config,this.metadata);
        this.spec.signals = signals;
      }

      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;

      var specc = JSON.stringify(this.spec);
};

bar.prototype.draw = function(div, callbacks) {
    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

       if (callbacks != null) {
          for (var i = 0; i<callbacks.length; i++) {
            this.view.on(callbacks[i].type, callbacks[i].callback);
          }
       }

    }).bind(this);

    if(this.config.maxLength != -1){
        var dataset = this.spec.data[0].values;
        var maxValue = this.config.maxLength;
        if(dataset.length >= this.config.maxLength){
            var allowedDataSet = [];
            var startingPoint = dataset.length - maxValue;
            for(var i = startingPoint; i < dataset.length;i++){
                allowedDataSet.push(dataset[i]);
            }
            this.spec.data[0].values = allowedDataSet;
        }
    }

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

bar.prototype.insert = function(data) {

    var xAxis = this.metadata.names[this.config.x];
    var yAxis = this.metadata.names[this.config.y];
    var size = this.metadata.names[this.config.size];
    var color = this.metadata.names[this.config.color];

    if (this.config.maxLength != -1 && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {

        var allDataSet = this.view.data(this.config.title).values().concat(data);
        var allowedRemovableDataSet = [];
        for (i = 0; i < allDataSet.length - this.config.maxLength; i++) {
            allowedRemovableDataSet.push(this.view.data(this.config.title).values()[i][xAxis]);
        }

        for (i = 0; i < data.length; i++) {
            var isValueMatched = false;
            this.view.data(this.config.title).update(function(d) {
                    var match;
                    if (color == -1) {
                      match =  d[xAxis] == data[i][xAxis]; 
                    } else {
                      match =  d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
                    }
                  },
                yAxis,
                function(d) {
                    isValueMatched = true;
                    return data[i][yAxis];
                });

            if(isValueMatched){
                var isIndexRemoved = false;

                var index = allowedRemovableDataSet.indexOf(data[i][xAxis]);
                if (index > -1) {
                    // updated value matched in allowed removable values
                    isIndexRemoved = true;
                    allowedRemovableDataSet.splice(index, 1);
                }

                if(!isIndexRemoved){
                    // updated value NOT matched in allowed removable values
                    allowedRemovableDataSet.splice((allowedRemovableDataSet.length - 1), 1);
                }

            } else {
                //insert the new data
                this.view.data(this.config.title).insert([data[i]]);
                this.view.update();
            }
        }

        var oldData;
        var removeFunction = function(d) {
            return d[xAxis] == oldData;
        };

        for (i = 0; i < allowedRemovableDataSet.length; i++) {
            oldData = allowedRemovableDataSet[i];
            this.view.data(this.config.title).remove(removeFunction);
        }
    } else{
        for (i = 0; i < data.length; i++) {
            var isValueMatched = false;
            this.view.data(this.config.title).update(function(d) {
                  var match;
                  if (color == -1) {
                    match =  d[xAxis] == data[i][xAxis]; 
                  } else {
                    match =  d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
                  }
                },
                yAxis,
                function(d) {
                    isValueMatched = true;
                    return data[i][yAxis];
                });

            if(!isValueMatched){
                this.view.data(this.config.title).insert([data[i]]);
            }
        }
    }
    this.view.update({duration: 200});

};

bar.prototype.getSpec = function() {
  return this.spec;
};


function getBarMark(config, metadata){

  var mark = {
                  "type": "rect",
                  "from": {"data": config.title},
                  "properties": {
                    "update": {

                      "x": {"scale": "x", "field": metadata.names[config.x]},
                      "width": {"scale": "x", "band": true, "offset": -1},
                      "y": {"scale": "y", "field": metadata.names[config.y]},
                      "y2": {"scale": "y", "value": 0},
                      "fill": {"value": "steelblue"},
                       "fillOpacity": {"value": 1}
                    },
                    "hover": {
                      "fillOpacity": {"value": 0.5}
                    }
                  }
              };
      

  return mark;
}

function getStackBarMark(config, metadata){

  var mark =      {
      "type": "rect",
      "from": {
        "data": "table",
        "transform": [
          { "type": "stack", 
            "groupby": [metadata.names[config.x]], 
            "sortby": [metadata.names[config.color]], 
            "field":metadata.names[config.y]}
        ]
      },
      "properties": {
        "update": {
          "x": {"scale": "x", "field": metadata.names[config.x]},
          "width": {"scale": "x", "band": true, "offset": -1},
          "y": {"scale": "y", "field": "layout_start"},
          "y2": {"scale": "y", "field": "layout_end"},
          "fill": {"scale": "color", "field": metadata.names[config.color]},
           "fillOpacity": {"value": 1}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      }
    };
      

  return mark;
}

;var vizg = function(dataTable, config) {
	dataTable = buildTable(dataTable); 
	if (typeof config.charts !== "undefined" && config.charts.length == 1) {
		//Set chart config properties for main
		for (var property in config.charts[0]) {
		    if (config.charts[0].hasOwnProperty(property)) {
		        config[property] = config.charts[0][property];
		    }
		}

		this.chart =  new window[config.type]([dataTable], config);
	}
};

vizg.prototype.draw = function(div, callback) {
	this.chart.draw(div, callback);
};

vizg.prototype.insert = function(data) {
	this.chart.insert(buildData(data, this.chart.metadata));
};

vizg.prototype.getSpec = function() {
	return this.chart.getSpec();
};;
var line = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      var xScale = {
                    "name": "x",
                    "type": this.metadata.types[config.x],
                    "range": "width",
                    "zero": config.zero,
                    "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
                    };

      var yScale = {
                "name": "y",
                "type": this.metadata.types[config.y],
                "range": "height",
                "zero": config.zero,
                "domain": {"data":  config.title, "field": this.metadata.names[config.y]}
                };
      
      var scales =  [xScale, yScale];

      if (config.color != -1) {

          if (config.colorDomain == null) {
              config.colorDomain = {"data":  config.title, "field": this.metadata.names[config.color]};
          }

          var colorScale = {
                    "name": "color", 
                    "type": "ordinal", 
                    "domain": config.colorDomain,
                    "range": config.colorScale
                      };
          scales.push(colorScale);
      } 

      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      marks.push(getLineMark(config, this.metadata));
      config.markSize = 20;
      marks.push(getSymbolMark(config, this.metadata));

      if (config.tooltip) {
          marks.push(getToolTipMark(config, this.metadata));
          signals = getSignals(config,this.metadata);
          this.spec.signals = signals;
      }

      if (config.color != -1) {

      var legendTitle = "Legend";

      if (config.title != "table") {
          legendTitle = config.title;
      }

      var legends = [
                      {
                      "fill": "color",
                      "title": "Legend",
                      "offset": 0,
                      "properties": {
                        "symbols": {
                          "fillOpacity": {"value": 0.5},
                          "stroke": {"value": "transparent"}
                        }
                      }
                    }
                    ];

                    this.spec.legends = legends;
          }
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
      
};

line.prototype.draw = function(div, callbacks) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

       if (callbacks != null) {
          for (var i = 0; i<callbacks.length; i++) {
            this.view.on(callbacks[i].type, callbacks[i].callback);
          }
       }

    }).bind(this);

    if(this.config.maxLength != -1){
        var dataset = this.spec.data[0].values;
        var maxValue = this.config.maxLength;
        if(dataset.length >= this.config.maxLength){
            var allowedDataSet = [];
            var startingPoint = dataset.length - maxValue;
            for(var i = startingPoint; i < dataset.length;i++){
                allowedDataSet.push(dataset[i]);
            }
            this.spec.data[0].values = allowedDataSet;
        }
    }

 		vg.parse.spec(this.spec, viewUpdateFunction);


};

line.prototype.insert = function(data) {
    //Removing events when max value is enabled
    if (this.config.maxLength != -1 && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {
        var removeFunction = (function(d) { 
          return d[this.metadata.names[this.config.x]] == oldData; 
        }).bind(this);

        for (i = 0; i < data.length; i++) {
          var oldData = this.view.data(this.config.title).values()[i][this.metadata.names[this.config.x]];
          this.view.data(this.config.title).remove(removeFunction);  
        }
    } 

     this.view.data(this.config.title).insert(data);
     this.view.update();
};

line.prototype.getSpec = function() {
  return this.spec;
};

function getLineMark(config, metadata){
        var mark;
        if (config.color != -1) {
              mark =  {
                              "type": "group",
                              "from": {
                                "data":  config.title,
                                "transform": [{"type": "facet", "groupby": [metadata.names[config.color]]}]
                              },
                              "marks": [
                                {
                                  "type": "line",
                                  "properties": {
                                    "update": {
                                      "x": {"scale": "x", "field": metadata.names[config.x]},
                                      "y": {"scale": "y", "field": metadata.names[config.y]},
                                      "stroke": {"scale": "color", "field": metadata.names[config.color]},
                                      "strokeWidth": {"value": 2},
                                      "strokeOpacity": {"value": 1}
                                    },
                                    "hover": {
                                      "strokeOpacity": {"value": 0.5}
                                    }
                                  }
                                }
                              ]
                            };
        } else {
                mark = {
                                "type": "line",
                                "from": {"data": config.title},
                                "properties": {
                                  "update": {

                                    "x": {"scale": "x", "field": metadata.names[config.x]},
                                    "y": {"scale": "y", "field": metadata.names[config.y]},
                                    "stroke": { "value": config.markColor},
                                    "strokeWidth": {"value": 2},
                                    "strokeOpacity": {"value": 1}
                                  },
                                  "hover": {
                                    "strokeOpacity": {"value": 0.5}
                                  }
                                }
                            };
        }

        return mark;
}

;var map = function(dataTable, config) {

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
    config.toolTip.height = 20;
    config.toolTip.width = 100;

    for (i = 0; i < dataTable[0].values.length; i++) {
        for (var key in dataTable[0].values[i]) {
            if(key == dataTable[0].metadata.names[config.x]){
                if (dataTable[0].values[i].hasOwnProperty(key)) {
                    dataTable[0].values[i].unitName = dataTable[0].values[i][key];
                    dataTable[0].values[i][key] = getMapCode(dataTable[0].values[i][key], config.mapType,geoInfoJson);
                    break;
                }
            }
        }
    };

    dataTable[0].name = config.title;
    dataTable[0].transform = [
        {
            "type": "formula",
            "field": "v",
            "expr": "datum."+this.metadata.names[config.y]
        }
    ];

    if (config.tooltip) {
        marks = getMapMark(config, this.metadata);
        signals = getMapSignals();
        this.spec.signals = signals;
    }

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
    this.spec.predicates = predicates;
    this.spec.legends = legends;

};

map.prototype.draw = function(div, callbacks) {
    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

       if (callbacks != null) {
          for (var i = 0; i<callbacks.length; i++) {
            this.view.on(callbacks[i].type, callbacks[i].callback);
          }
       }

    }).bind(this);

    vg.parse.spec(this.spec, viewUpdateFunction);
};

map.prototype.insert = function(data) {

    var xAxis = this.metadata.names[this.config.x];
    var yAxis = this.metadata.names[this.config.y];
    var color = this.metadata.names[this.config.color];
    var mapType = this.config.mapType;
    var geoInfoJson = this.config.geoInfoJson;

   for (i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            if(key == xAxis){
                if (data[i].hasOwnProperty(key)) {
                    data[i].unitName = data[i][key];
                    data[i][key] = getMapCode(data[i][key], mapType,geoInfoJson);
                    break;
                }
            }
        }
    };

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

    var width = config.width;
    var height = config.height;
    var scale;
    var mapType = config.charts[0].mapType;
    var projection = "mercator";

    if(mapType == "usa"){
        width = config.width - 160;
        height = config.height - 130;
        scale = config.height + 270;
        projection = "albersUsa";
    }else if(mapType == "europe"){
        width = ((config.width/2)+ 100)/2;
        height = config.height + 150;
        scale = config.height + 50;
    }else{
        scale = (config.width/640)*120;
        width = config.width/2 + 10;
        height = config.height/2+40;
    }
    var mapUrl = config.geoCodesUrl;

    var json = {

        "name": "geoData",
        "url": mapUrl,
        "format": {"type": "topojson","feature": "units"},
        "transform": [
            {
                "type": "geopath",
                "value": "data",
                "scale": scale,
                "translate": [width,height],
                "projection": projection
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
                    "width": {"value": config.toolTip.width},
                    "height": {"value": config.toolTip.height},
                    "fill": {"value": config.toolTip.color}
                }
            },
            "marks": [
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 14},
                            "text": {"template": "\u007b{tooltipSignal.datum.unitName}} \u007b{tooltipSignal.datum.v}}"},
                            "fill": {"value": "black"}
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
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            geoMapCodes = JSON.parse(xobj.responseText);
          }
    };
    xobj.send(null); 

    return geoMapCodes;
}

function getMapCode(name, region, geoInfo) {
    if (region == "world" || region == "europe") {
        for (i = 0; i < geoInfo.length; i++) {
            if (name.toUpperCase() == geoInfo[i]["name"].toUpperCase()) {
                name = geoInfo[i]["alpha-3"];
            }
        };
    } else {
        var i = 0;
        for (var property in geoInfo) {
            if (geoInfo.hasOwnProperty(property)) {
                if(name.toUpperCase() == property.toUpperCase()){
                    name = "US"+geoInfo[property];
                }
        }
        i++;
        };
    }
    return name;
};;
var number = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

number.prototype.draw = function(div) {
  div = div.replace("#","");
  var contentId = div+"Content";
  var textContent = "";

  if (this.data != null && this.data.length != 0) {
      textContent = this.data[this.data.length-1][this.metadata.names[this.config.x]];    
  }

  var divContent = "<p style='padding: 0px 0px 0px 20px;'>"+this.config.title+"</p><br/>"
                  +"<p align='center' style='font-size:60px;padding: 0px 0px 0px 20px;' id='"+contentId+"'>"
                  +textContent+"</p>";

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    document.getElementById(this.view).innerHTML = data[data.length-1][this.metadata.names[this.config.x]];
};



;var scatter = function(dataTable, config) {

    this.metadata = dataTable[0].metadata;
    var marks = [];
    var signals ;
    this.spec = {};

    config = checkConfig(config, this.metadata);
    this.config = config;
    dataTable[0].name = config.title;

    var xScale = {
        "name": "x",
        "type": this.metadata.types[config.x],
        "range": "width",
        "zero": config.zero,
        "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
    };

    var yScale = {
        "name": "y",
        "type": this.metadata.types[config.y],
        "range": "height",
        "zero": config.zero,
        "domain": {"data":  config.title, "field": this.metadata.names[config.y]}
    };

    var rScale = {
        "name": "size",
        "type": "linear",
        "range": [0,576],
        "domain": {"data":  config.title, "field": this.metadata.names[config.size]}
    };

    var cScale = {
        "name": "color",
        "type": "linear",
        "range": [config.minColor,config.maxColor],
        "domain": {"data":  config.title, "field": this.metadata.names[config.color]}
    };

    var scales =  [xScale, yScale, rScale, cScale];

    var axes =  [
        {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
        {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
    ];

    marks.push(getScatterMark(config, this.metadata));
    
    if (config.tooltip) {
        marks.push(getToolTipMark(config, this.metadata));
        signals = getSignals(config,this.metadata);
        this.spec.signals = signals;
    }


    this.spec.width = config.width;
    this.spec.height = config.height;
    this.spec.axes = axes;
    this.spec.data = dataTable;
    this.spec.scales = scales;
    this.spec.padding = config.padding;
    this.spec.marks = marks;

};

scatter.prototype.draw = function(div, callbacks) {
    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

       if (callbacks != null) {
          for (var i = 0; i<callbacks.length; i++) {
            this.view.on(callbacks[i].type, callbacks[i].callback);
          }
       }

    }).bind(this);
    
    if(this.config.maxLength != -1){
        var dataset = this.spec.data[0].values;
        var maxValue = this.config.maxLength;
        if(dataset.length >= this.config.maxLength){
            var allowedDataSet = [];
            var startingPoint = dataset.length - maxValue;
            for(var i = startingPoint; i < dataset.length;i++){
                allowedDataSet.push(dataset[i]);
            }
            this.spec.data[0].values = allowedDataSet;
        }
    }

    vg.parse.spec(this.spec, viewUpdateFunction);
};

scatter.prototype.insert = function(data) {

    var xAxis = this.metadata.names[this.config.x];
    var yAxis = this.metadata.names[this.config.y];
    var size = this.metadata.names[this.config.size];
    var color = this.metadata.names[this.config.color];

    if (this.config.maxLength != -1 && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {

        var allDataSet = this.view.data(this.config.title).values().concat(data);
        var allowedRemovableDataSet = [];
        for (i = 0; i < allDataSet.length - this.config.maxLength; i++) {
            allowedRemovableDataSet.push(this.view.data(this.config.title).values()[i][xAxis]);
        }

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

            this.view.data(this.config.title).update(function(d) {
                    return d[xAxis] == data[i][xAxis]; },
                size,
                function(d) {
                    isValueMatched = true;
                    return data[i][size];
                });

            if(isValueMatched){
                var isIndexRemoved = false;

                var index = allowedRemovableDataSet.indexOf(data[i][xAxis]);
                if (index > -1) {
                    // updated value matched in allowed removable values
                    isIndexRemoved = true;
                    allowedRemovableDataSet.splice(index, 1);
                }

                if(!isIndexRemoved){
                    // updated value NOT matched in allowed removable values
                    allowedRemovableDataSet.splice((allowedRemovableDataSet.length - 1), 1);
                }

            } else {
                //insert the new data
                this.view.data(this.config.title).insert([data[i]]);
                this.view.update();
            }
        }

        var oldData;
        var removeFunction = function(d) {
            return d[xAxis] == oldData;
        };

        for (i = 0; i < allowedRemovableDataSet.length; i++) {
            oldData = allowedRemovableDataSet[i];
            this.view.data(this.config.title).remove(removeFunction);
        }
    } else{
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

            this.view.data(this.config.title).update(function(d) {
                    return d[xAxis] == data[i][xAxis]; },
                size,
                function(d) {
                    isValueMatched = true;
                    return data[i][size];
                });

            if(!isValueMatched){
                this.view.data(this.config.title).insert([data[i]]);
            }
        }
    }
    this.view.update({duration: 200});
};

scatter.prototype.getSpec = function() {
    return this.spec;
};


function getScatterMark(config, metadata){

    var mark = {

            "type": "symbol",
            "from": {"data": config.title},
            "properties": {
                "update": {
                    "x": {"scale": "x", "field": metadata.names[config.x]},
                    "y": {"scale": "y", "field": metadata.names[config.y]},
                    "fill": {"scale": "color", "field": metadata.names[config.color]},
                    "size": {"scale":"size","field":metadata.names[config.size]},
                    "fillOpacity": {"value": 1}
                },
                "hover": {
                    "fillOpacity": {"value": 0.5}
                }
            }

        }
    ;


    return mark;
}

function getScatterToolTipMark(config, metadata) {
    config.toolTip.height = 50;
    config.toolTip.y = -50;

    var mark = getToolTipMark(config, metadata);
    var sizeText = {
        "type": "text",
        "properties": {
            "update": {
                "x": {"value": 6},
                "y": {"value": 44},
                "text": {"template": "Size \t (" + metadata.names[config.size] + ") \t {{hover." + metadata.names[config.size] + "}}"},
                "fill": {"value": "black"}
            }
        }
    };
    mark.marks.push(sizeText);
    return mark;
}
;
var table = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};
      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

table.prototype.draw = function(div) {
  var table = d3.select(div).append("table")
                .attr( "cellpadding", "8px")
                .attr( "border", "2px")
                .attr( "width", "100%")
                .attr("id", this.config.title);

      // set up the table header
      table.append('thead').attr("align", "center")
          .append('tr') 
          .selectAll('th')
              .data(this.config.columnTitles)
          .enter()
              .append('th')
              .text(function (d) { return d });

      table.append('tbody').attr("id", "tableChart-"+this.config.title);
      this.setupData(this.data, this.config);

      table.selectAll("thead th")
      .text(function(column) {
          return column.charAt(0).toUpperCase() + column.substr(1);
      });
  
      
      };

table.prototype.insert = function(data) {
    this.setupData(data, this.config);
};


table.prototype.setupData = function (dataset, config) {
    var data = [];
    var allColumns = this.metadata.names;
    
    //Select specified columns from dataset
    for (var i = 0; i < dataset.length; i++) {
        var row = {};

        for (var x = 0; x < config.columns.length; x++) {
            row[config.columns[x]] = dataset[i][config.columns[x]];
        }
        data.push(row);
    }

   //Select Rows by x Axis
    var rows = d3.select('#tableChart-'+config.title)
        .selectAll('tr')
        .data(data, function(d) { return d[config.key]})

    var entertd = rows.enter()
        .append('tr')
            .selectAll('td')
               .data(function(row) {
                return config.columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append('td')

    //Color cell background
    if (config.color != -1) {
            d3.select('#tableChart-'+config.title)
                  .selectAll('td')
                      .attr('bgcolor',
                        function(d) { 
                            var column = d.key  || d.column;
                            if (typeof d.value == "string") {

                            } else if (config.color == "*" || column == allColumns[config.color]){
                                var color;
                                if (typeof config.colorScale == "string") {
                                  color = window["d3"]["scale"][config.colorScale]().range();
                                } else {
                                  color = config.colorScale;
                                }

                                var colorIndex;
                                for(var i = 0; i < allColumns.length; i += 1) {
                                if(allColumns[i] === column) {
                                    colorIndex = i;
                                }
                            }
                                var colorScale = d3.scale.linear()
                                                .range(['#f2f2f2', color[colorIndex]])
                                                .domain([d3.min(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; }), 
                                                         d3.max(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; })]
                                                        );
                                
                                return colorScale(d.value); 
                            }

            });
    }

                
              
    entertd.append('span')
    var td = rows.selectAll('td')
    .style({"padding": "0px 10px 0px 10px"})

        .data(function(d) { return d3.map(d).entries() })
        .attr('class', function (d) { return d.key })


    

    td.select('span')
        .text(function(d) {
            return d.value
        })
    //Remove data items when it hits maxLength 
    if (config.maxLength != -1 && d3.select('tbody').selectAll('tr').data().length > config.maxLength) {
          var allowedDataset = d3.select('tbody').selectAll('tr').data().slice(d3.select('tbody').selectAll('tr').data().length- config.maxLength, config.maxLength);
          d3.select('tbody').selectAll('tr').data(allowedDataset, 
            function(d) { 
              return(d); 
            })  
          .remove();
    }
};function checkConfig(config, metadata){

	if (config.title == null) {
		config.title = "table";
	}

	if (config.xTitle == null) {
		config.xTitle = config.x;
	}

	if (config.yTitle == null) {
		config.yTitle = config.y;
	}

	if (config.colorScale == null) {
		config.colorScale = "category10";
	}

	if (config.grid == null) {
		config.grid  = true; 
	}

	if (config.zero == null) {
		config.zero = false;
	}

	if (config.color == null) {
		config.color = -1;
	} else if (config.color != "*"){
		config.color = metadata.names.indexOf(config.color);
	}

    if (config.mapType == null) {
        config.mapType = -1;
    }

    if (config.minColor == null) {
        config.minColor = -1;
    }

    if (config.maxColor == null) {
        config.maxColor = -1;
    }

    if (config.mode == null) {
        config.mode = "stack";
    }

    if (config.size == null) {
        config.size = -1;
    } else {
        config.size = metadata.names.indexOf(config.size);
    }

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	if (config.markColor == null) {
		config.markColor = "steelblue";
	}

	if (config.markSize == null) {
		config.markSize = 2;
	}

	if (config.fillOpacity == null) {
		config.fillOpacity = 1;
	}

    if (config.renderer == null) {
        config.renderer = "canvas";
    }

	if (config.toolTip == null) {
		config.toolTip = {"height" : 35, "width" : 120, "color":"#e5f2ff", "x": 0, "y":-30};
	}

	if (config.padding == null) {
        config.padding = {"top": 50, "left": 60, "bottom": 40, "right": 150};
	}

	if (config.hoverType == null) {
		config.hoverType = "symbol";
	}

    if (config.tooltip == null) {
        config.tooltip = true;
    }

	config.x = metadata.names.indexOf(config.x);
    config.y = metadata.names.indexOf(config.y);

    return config;
}

function buildTable(datatable) {
	var chartDatatable = {};
	chartDatatable.metadata = datatable[0].metadata;
	chartDatatable.values = buildData(datatable[0].data, datatable[0].metadata);
	return chartDatatable;
}


function buildData(data, metadata) {
	chartData = [];
	for (i = 0; i < data.length; i++) {
		var row = {};
		for (x = 0; x < metadata.names.length; x++) {
			row[metadata.names[x]] = data[i][x];
		}
		chartData.push(row);
	}
	return chartData;
}

/*
	General function used to draw circle symbols graphs
*/
function getSymbolMark(config, metadata) {

  var fill;
  if (config.color != -1) { 
      fill =  {"scale": "color", "field": metadata.names[config.color]};
  } else {
      fill = {"value":config.markColor};
  }

var  mark = {
      "type": "symbol",
      "from": {"data": config.title},
      "properties": {
        "update": {
          "x": {"scale": "x", "field": metadata.names[config.x]},
          "y": {"scale": "y", "field": metadata.names[config.y]},
          "fill": fill,
          "size": {"value": config.markSize},
          "fillOpacity": {"value": config.fillOpacity}
        }
      }
    }

    return mark;
}


function getToolTipMark(config , metadata) {
	    var mark =    {
            "type": "group",
            "from": {"data": "table",
                "transform": [
                    {
                        "type": "filter",
                        "test": "datum." + metadata.names[config.x] + " == hover." + metadata.names[config.x] + ""
                    }
                ]},
                    "properties": {
                        "update": {
                            "x": {"scale": "x", "signal": "hover." + metadata.names[config.x], "offset": config.toolTip.x},
                            "y": {"scale": "y", "signal": "hover." + metadata.names[config.y], "offset": config.toolTip.y},
                            "width": {"value": config.toolTip.width},
                            "height": {"value": config.toolTip.height},
                            "fill": {"value": config.toolTip.color}
                }
            },

            "marks": [
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 14},
                            "text": {"template": "X \n (" + metadata.names[config.x] + ") \t {{hover." + metadata.names[config.x] + "}}"},
                            "fill": {"value": "black"}
                        }
                    }
                },
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 29},
                            "text": {"template": "Y \t (" + metadata.names[config.y] + ") \t {{hover." + metadata.names[config.y] + "}}"},
                            "fill": {"value": "black"}
                        }
                    }
                }
            ]
        }

    return mark;
}

function getSignals(config, metadata){

    var signals = [{

            "name": "hover",
            "init": {},
            "streams": [
                {"type": config.hoverType+":mouseover", "expr": "datum"},
                {"type": config.hoverType+":mouseout", "expr": "{}"}
            ]
    }];

    return signals;

}



