
var line = function(dataTable, config) {
		  this.dataName = dataTable[0].name;
      this.config = config;
      var marks =[];

      var xScale = {
                        "name": "x",
                        "type": config.xType,
                        "range": "width",
                        "zero": false,
                        "domain": {"data":  this.dataName, "field": config.x}
                      };


          var scales =  [xScale];

          for (i = 0; i < config.y.length; i++) {
              
              var yScale;
              if (i != config.groupIndex)  {
               //For non group line charts
               var yScaleName;

               if (i == 0) {
                yScaleName = "y";

                yScale = {
                    "name": "color", "type": "ordinal", "range": config.colorScale, "domain": config.y
                };

                 scales.push(yScale);


               } else {
                yScaleName = "y" + i;
               }
                    yScale = {
                                "name": yScaleName,
                                "type": config.yType[i],
                                "range": "height",
                                "nice": true,
                                "zero": false,
                                "domain": {"data":  this.dataName, "field": config.y}
                              };
              } else {
                    yScale =  {
                            "name": "color", 
                            "type": "ordinal", 
                            "domain": {"data":  this.dataName, "field": config.y[i]},
                            "range": config.colorScale
                          };
              }
              scales.push(yScale);
          }

          var axes =  [
                        {"type": "x", "scale": "x","grid": true,  "title": config.x},
                        {"type": "y", "scale": "y", "grid": true}
                      ];

          if (config.groupIndex != -1) {
                  marks =  [
                                {
                                  "type": "group",
                                  "from": {
                                    "data":  this.dataName,
                                    "transform": [{"type": "facet", "groupby": [config.y[config.groupIndex]]}]
                                  },
                                  "marks": [
                                    {
                                      "type": "line",
                                      "properties": {
                                        "update": {
                                          "x": {"scale": "x", "field": config.x},
                                          "y": {"scale": "y", "field": config.y[0]},
                                          "stroke": {"scale": "color", "field": config.y[config.groupIndex]},
                                          "strokeWidth": {"value": 2}
                                        }
                                      }
                                    }
                                  ]
                                }
                              ];
            } else {

                for (i = 0; i < config.y.length; i++) { 
                    var mark = {
                                    "type": "line",
                                    "from": {"data": this.dataName},
                                    "properties": {
                                      "update": {
                                       // "interpolate": {"value": "monotone"},
                                        "x": {"scale": "x", "field": config.x},
                                        "y": {"scale": "y", "field": config.y[i]},
                                        "stroke": {"scale": "color", "value": config.y[i]},
                                        "strokeWidth": {"value": 2}
                                      },
                                      "hover": {
                                        "fillOpacity": {"value": 0.5}
                                      }
                                    }
                                }

                    marks.push(mark);

                }

            }

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

          this.spec = {};
          this.spec.width = 500;
          this.spec.height = 200,
          this.spec.axes = axes;
          this.spec.data = dataTable;
          this.spec.scales = scales;
          this.spec.padding = {"top": 30, "left": 30, "bottom": 100, "right": 100};
          this.spec.marks = marks;
          this.spec.legends = legends;    
          };

line.prototype.draw = function(div) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

line.prototype.insert = function(data) {

          //Removing events when max value is enabled
          if ((config.maxLength != undefined || config.maxLength != -1) 
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
          }



