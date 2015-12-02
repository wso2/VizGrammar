
var line = function(dataTable, config) {
		  this.dataName = dataTable[0].name;
      this.config = config;
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};

      var config = checkConfig(config, this.metadata);

      var xScale = {
                    "name": "x",
                    "type": this.metadata.types[config.x],
                    "range": "width",
                    "zero": config.zero,
                    "domain": {"data":  this.dataName, "field": this.metadata.names[config.x]}
                    };

      var yScale = {
                "name": "y",
                "type": this.metadata.types[config.y],
                "range": "height",
                "zero": false,
                "domain": {"data":  this.dataName, "field": this.metadata.names[config.y]}
                };
      
      var scales =  [xScale, yScale];

      if (config.color != -1) {
          var colorScale = {
                    "name": "color", 
                    "type": "ordinal", 
                    "domain": {"data":  this.dataName, "field": this.metadata.names[config.color]},
                    "range": config.colorScale
                      };
          scales.push(colorScale);
      } 

      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": this.metadata.names[config.x]},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": this.metadata.names[config.y]}
                  ];

      if (config.color != -1) {
              marks =  [
                            {
                              "type": "group",
                              "from": {
                                "data":  this.dataName,
                                "transform": [{"type": "facet", "groupby": [this.metadata.names[config.color]]}]
                              },
                              "marks": [
                                {
                                  "type": "line",
                                  "properties": {
                                    "update": {
                                      "x": {"scale": "x", "field": this.metadata.names[config.x]},
                                      "y": {"scale": "y", "field": this.metadata.names[config.y]},
                                      "stroke": {"scale": "color", "field": this.metadata.names[config.color]},
                                      "strokeWidth": {"value": 2}
                                    }
                                  }
                                }
                              ]
                            }
                          ];
        } else {
                var mark = {
                                "type": "line",
                                "from": {"data": this.dataName},
                                "properties": {
                                  "update": {
                                   // "interpolate": {"value": "monotone"},
                                    "x": {"scale": "x", "field": this.metadata.names[config.x]},
                                    "y": {"scale": "y", "field": this.metadata.names[config.y]},
                                    "stroke": { "value": "steelblue"},
                                    "strokeWidth": {"value": 2}
                                  },
                                  "hover": {
                                    "fillOpacity": {"value": 0.5}
                                  }
                                }
                            }

                 marks.push(mark);
        }

        if (config.color != -1) {

      var legends = [
                      {
                      "fill": "color",
                      "title": this.dataName,
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
      this.spec.padding = {"top": 30, "left": 50, "bottom": 100, "right": 100};
      this.spec.marks = marks;
          
};

line.prototype.draw = function(div) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

line.prototype.insert = function(data) {

      //Removing events when max value is enabled
      if (config.maxLength != -1 
          && config.maxLength <  (this.view.data(this.dataName).values().length + data.length)) {

            for (i = 0; i < data.length; i++) {
              var oldData = this.view.data(this.dataName).values()[i][this.config.x];
                 this.view.data(this.dataName).remove(function(d) { 
                  return d[this.config.x] == oldData; 
                });  
            }
        } 

     this.view.data(this.dataName).insert(data);
     this.view.update();
};



