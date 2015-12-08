
var bar = function(dataTable, config) {
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
                    "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
                    };

      var yScale = {
                "name": "y",
                "type": this.metadata.types[config.y],
                "range": "height",
                "domain": {"data":  config.title, "field": this.metadata.names[config.y]}
                };
      
      var scales =  [xScale, yScale];

      if (config.color != -1) {
          var colorScale = {
                    "name": "color", 
                    "type": "ordinal", 
                    "domain": {"data":  config.title, "field": this.metadata.names[config.color]},
                    "range": config.colorScale
                      };
          scales.push(colorScale);
      } 

      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      marks.push(getBarMark(config, this.metadata));

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

bar.prototype.draw = function(div) {

    var my = JSON.stringify(this.spec);
    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

bar.prototype.insert = function(data) {

  var shouldInsert = true;
  var xAxis = this.metadata.names[this.config.x];
  var yAxis = this.metadata.names[this.config.y];

  //Check for updates
  for (i = 0; i < data.length; i++) { 

      this.view.data(this.config.title).update(function(d) { return d[xAxis] == data[i][xAxis]; }, 
      yAxis,
      function(d) { 
        shouldInsert = false;
        return data[i][yAxis];
      });
  }

  if (shouldInsert) {
      //Removing events when max value is enabled
      if (this.config.maxLength != -1 
            && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {
          for (i = 0; i < data.length; i++) {
            var oldData = this.view.data(this.config.title).values()[i][xAxis];
            this.view.data(this.config.title).remove(function(d) { 
                return d[xAxis] == oldData; 
              });  
          }
      } 
       this.view.data(this.config.title).insert(data);     
    }

    this.view.update({duration: 200});
};

bar.prototype.getSpec = function() {
  return this.spec;
};


function getBarMark(config, metadata){
        if (config.color != -1) {
              var mark =  {
                              "type": "group",
                              "from": {
                                "data":  config.title,
                                "transform": [{"type": "facet", "groupby": [metadata.names[config.color]]}]
                              },
                              "marks": [
                                {
                                  "type": "rect",
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
        }

        return mark;
}

