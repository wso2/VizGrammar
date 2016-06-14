
var bar = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      var scales =[];
      this.spec = {};
      var yColumn;
      var yDomain;

      var xRange;
      var yRange;
      var xAxesType;
      var yAxesType;
      var signals = [];

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      if (config.orientation == "left") {
        xRange = "height";
        yRange = "width";
        xAxesType = "y";
        yAxesType = "x";
      } else {
        xRange = "width";
        yRange = "height";
        xAxesType = "x";
        yAxesType = "y";
      }
      
      if (config.color != -1) {
        var legendTitle = "Legend";
      if (config.title != "table") {
          legendTitle = config.title;
      }
        if (config.colorDomain == -1) {
              config.colorDomain = {"data":  config.title, "field": this.metadata.names[config.color]};
          }

          var colorScale = {
            "name": "color", 
            "type": "ordinal", 
            "domain": config.colorDomain,
            "range": config.colorScale
          };

          scales.push(colorScale);



          if (config.mode == "stack") {
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

            dataTable.push(aggregateData);
            yColumn = "sum_"+ this.metadata.names[config.y];
            yDomain = "stack";

        } else {
            yColumn = this.metadata.names[config.y];
            yDomain = config.title;
        }
        
        if (this.config.legend) {
          this.spec.legends = getLegend(this.config);
        }
      } else {
        yColumn = this.metadata.names[config.y];
        yDomain = config.title;
      }

      var xScale = {
              "name": "x",
              "type": "ordinal",
              "range": xRange,
              "domain": config.xScaleDomain
              };

    if (config.mode == "group") {
        xScale.padding = 0.2;
      }

      if (config.yScaleDomain.constructor !== Array) {
          config.yScaleDomain = {"data": yDomain, "field": yColumn};
      }

      var yScale = {
          "name": "y",
          "type": this.metadata.types[config.y],
          "range": yRange,
          "domain": config.yScaleDomain
          };


      
      scales.push(xScale);
      scales.push(yScale);

      var axes =  getXYAxes(config, xAxesType, "x", yAxesType, "y");

      if (config.color != -1 && config.mode == "stack") {
        marks.push(getStackBarMark(config, this.metadata));
      } else if (config.color != -1 && config.mode == "group") {
        marks.push(getGroupBarMark(config, this.metadata));
      } else {
        marks.push(getBarMark(config, this.metadata));
      }

      if (config.range) {
         signals = getRangeSignals(config, signals);
         marks = getRangeMark(config, marks);
      }

      if (config.orientation == "left" && config.text != null) {

        var xVal = {"value": 5};

        if (config.textAlign == "right") {
          var xVal = {"scale": "y","field": this.metadata.names[config.y], "offset": 2};
        }

        marks.push({
                "type": "text",
                "from": {"data": "table"},
                "properties": {
                  "update": {
                      "x": xVal,
                    "dy": {
                      "scale": "x",
                      "band": true,
                      "mult": 0.5
                    },
                    "y": {"scale": "x","field": this.metadata.names[config.x]},
                    "align":{"value": "left"},
                    "text": {"field": this.metadata.names[config.text]},
                    "fill": {"value": config.textColor}
                  }
                }
              });
      }

      if (config.highlight == "single" || config.highlight == "multi") {

        var multiTest;

        if (config.highlight == "multi") {
          multiTest = "!multi";
        } else {
          multiTest = "multi";
        }


        dataTable.push(   
          {
            "name": "selectedPoints",
            "modify": [
              {"type": "clear", "test": multiTest},
              {"type": "toggle", "signal": "clickedPoint", "field": "id"}
            ]
          });

          signals.push(    {
              "name": "clickedPoint",
              "init": 0,
              "verbose": true,
              "streams": [{"type": "click", "expr": "datum._id"}]
            },
            {
              "name": "multi",
              "init": false,
              "verbose": true,
              "streams": [{"type": "click", "expr": "datum._id"}]
            });

          marks[0].properties.update.fill = [
            {
              "test": "indata('selectedPoints', datum._id, 'id')",
              "value": config.selectionColor
            },marks[0].properties.update.fill
          ];
      }

      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
      this.spec.signals = signals;

      var specc = JSON.stringify(this.spec);
};

bar.prototype.draw = function(div, callbacks) {
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
    this.config.tooltip.type = "rect";
    drawChart(div, this, callbacks);
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
                    if (color == null) {
                      return d[xAxis] == data[i][xAxis]; 
                    } else {
                      return d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
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
                  if (color == null) {
                    return  d[xAxis] == data[i][xAxis]; 
                  } else {
                    return  d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
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

    //Group does not support duration update animation
    if (this.config.mode == "group") {
      this.view.update();
    } else {
      this.view.update({duration: 200});
    }
};

bar.prototype.getSpec = function() {
  return this.spec;
};

bar.prototype.setSpec = function(spec) {
  this.spec = spec;
}


function getBarMark(config, metadata){
  var markContent;
  if (config.orientation == "left") {
    markContent = {
                    "y": {"scale": "x", "field": metadata.names[config.x]},
                    "height": {"scale": "x", "band": true, "offset": calculateBarGap(config)},
                    "x": {"scale": "y", "field": metadata.names[config.y]},
                    "x2": {"scale": "y", "value": 0},
                    "fill": {"value": config.markColor},
                    "fillOpacity": {"value": 1}
                  };
  } else {
    markContent = {
                    "x": {"scale": "x", "field": metadata.names[config.x]},
                    "width": {"scale": "x", "band": true, "offset": calculateBarGap(config)},
                    "y": {"scale": "y", "field": metadata.names[config.y]},
                    "y2": {"scale": "y", "value": 0},
                    "fill": {"value": config.markColor},
                    "fillOpacity": {"value": 1}
                  };
  }

  var mark = {
                  "name": "bars",
                  "type": "rect",
                  "from": {"data": config.title},
                  "properties": {
                    "update": markContent,
                    "hover": {
                      "fillOpacity": {"value": 0.5},
                      "cursor": {"value": config.hoverCursor}
                    }
                  }
              };
      

  return mark;
}

function getStackBarMark(config, metadata){
  var markContent;
  if (config.orientation == "left") {
    mark = {
        "name": "bars",
        "type": "rect",
        "from": {
          "data": config.title,
          "transform": [
            { "type": "stack", 
              "groupby": [metadata.names[config.x]], 
              "sortby": [metadata.names[config.color]], 
              "field":metadata.names[config.y]}
          ]
        },
        "properties": {
          "update": {
            "y": {"scale": "x", "field": metadata.names[config.x]},
            "height": {"scale": "x", "band": true, "offset": calculateBarGap(config)},
            "x": {"scale": "y", "field": "layout_start"},
            "x2": {"scale": "y", "field": "layout_end"},
            "fill": {"scale": "color", "field": metadata.names[config.color]},
            "fillOpacity": {"value": 1}
          },
          "hover": {
            "fillOpacity": {"value": 0.5},
            "cursor": {"value": config.hoverCursor}
          }
        }
      };
  } else {

    mark = {
        "name": "bars",
        "type": "rect",
        "from": {
          "data": config.title,
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
            "width": {"scale": "x", "band": true, "offset": calculateBarGap(config)},
            "y": {"scale": "y", "field": "layout_start"},
            "y2": {"scale": "y", "field": "layout_end"},
            "fill": {"scale": "color", "field": metadata.names[config.color]},
            "fillOpacity": {"value": 1}
          },
          "hover": {
            "fillOpacity": {"value": 0.5},
            "cursor": {"value": config.hoverCursor}
          }
        }
      };
  }


      

  return mark;
}

function getGroupBarMark(config, metadata){
  var mark;
  if (config.orientation == "left") {
      mark =  {
          "name": "bars",
          "type": "group",
          "from": {
            "data": config.title,
            "transform": [{"type":"facet", "groupby": [metadata.names[config.x]]}]
          },
          "properties": {
            "update": {
              "y": {"scale": "x", "field": "key"},
              "height": {"scale": "x", "band": true}
            }
          },
          "scales": [
            {
              "name": "pos",
              "type": "ordinal",
              "range": "height",
              "domain": {"field": metadata.names[config.color]}
            }
          ],
          "marks": [
          {
              "name": "bar",
              "type": "rect",
              "properties": {
                "update": {
                  "y": {"scale": "pos", "field": metadata.names[config.color]},
                  "height": {"scale": "pos", "band": true},
                  "x": {"scale": "y", "field": metadata.names[config.y]},
                  "x2": {"scale": "y", "value": 0},
                  "fill": {"scale": "color", "field": metadata.names[config.color]},
                  "fillOpacity": {"value": 1}
                },
                "hover": {
                  "fillOpacity": {"value": 0.5},
                  "cursor": {"value": config.hoverCursor}
                }
              }
            }
          ]
        };
  } else {
      mark =  {
          "name": "bars",
          "type": "group",
          "from": {
            "data": config.title,
            "transform": [{"type":"facet", "groupby": [metadata.names[config.x]]}]
          },
          "properties": {
            "update": {
              "x": {"scale": "x", "field": "key"},
              "width": {"scale": "x", "band": true}
            }
          },
          "scales": [
            {
              "name": "pos",
              "type": "ordinal",
              "range": "width",
              "domain": {"field": metadata.names[config.color]}
            }
          ],
          "marks": [
          {
              "name": "bar",
              "type": "rect",
              "properties": {
                "update": {
                  "x": {"scale": "pos", "field": metadata.names[config.color]},
                  "width": {"scale": "pos", "band": true},
                  "y": {"scale": "y", "field": metadata.names[config.y]},
                  "y2": {"scale": "y", "value": 0},
                  "fill": {"scale": "color", "field": metadata.names[config.color]},
                  "fillOpacity": {"value": 1}
                },
                "hover": {
                  "fillOpacity": {"value": 0.5},
                  "cursor": {"value": config.hoverCursor}
                }
              }
            }
          ]
        };
  }
  return mark;
}

function calculateBarGap(config){

  var xWidth;

  if (config.orientation == "left") {
    xWidth = config.height;
  } else {
    xWidth = config.width
  }

  return  -config.barGap * (xWidth/30);

}