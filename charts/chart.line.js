
var line = function(dataTable, config) {
      config.title = "table";
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

      marks.push(getLineMark(config, this.metadata));

      if (config.color != -1) {

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

line.prototype.draw = function(div) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

line.prototype.insert = function(data) {

      //Removing events when max value is enabled
      if (config.maxLength != -1 
          && config.maxLength <  (this.view.data(config.title).values().length + data.length)) {

            for (i = 0; i < data.length; i++) {
              var oldData = this.view.data(config.title).values()[i][this.metadata.names[config.x]];

              var removeFunction = (function(d) { 
                  return d[this.metadata.names[config.x]] == oldData; 
                }).bind(this);

              
                 this.view.data(config.title).remove(removeFunction);  
            }
        } 

     this.view.data(config.title).insert(data);
     this.view.update();
};

line.prototype.getSpec = function() {
  return this.spec;
};


function getLineMark(config, metadata){
        if (config.color != -1) {
              var mark =  {
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
                var mark = {
                                "type": "line",
                                "from": {"data": config.title},
                                "properties": {
                                  "update": {

                                    "x": {"scale": "x", "field": metadata.names[config.x]},
                                    "y": {"scale": "y", "field": metadata.names[config.y]},
                                    "stroke": { "value": "steelblue"},
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

