var view;
var dataName;


function setupLine(dataTable, config) {
		  dataName = dataTable[0].name;
      var marks =[];

      var xScale = {
                        "name": "x",
                        "type": config.xType,
                        "range": "width",
                        "zero": false,
                        "domain": {"data": dataName, "field": config.x}
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
                    "name": "color", "type": "ordinal", "range": "category10", "domain": config.y
                };

                 scales.push(yScale);


               } else {
                yScaleName ="yy";
               }
                    yScale = {
                                "name": yScaleName,
                                "type": config.yType[i],
                                "range": "height",
                                "nice": true,
                                "zero": false,
                                "domain": {"data": dataName, "field": config.y[i]}
                              };
              } else {
                    yScale =  {
                            "name": "color", 
                            "type": "ordinal", 
                            "domain": {"data": dataName, "field": config.y[i]},
                            "range": "category10"
                          };
              }
              scales.push(yScale);
          }

          var axes =  [
                        {"type": "x", "scale": "x"},
                        {"type": "y", "scale": "y"}
                      ];

          if (config.groupIndex != -1) {
                  marks =  [
                                {
                                  "type": "group",
                                  "from": {
                                    "data": dataName,
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
                                    "from": {"data": dataName},
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
                          "title": dataName,
                          "offset": 0,
                          "properties": {
                            "symbols": {
                              "fillOpacity": {"value": 0.5},
                              "stroke": {"value": "transparent"}
                            }
                          }
                        }
                        ];

          var spec = {};
          spec.width = 500;
          spec.height = 200,
          spec.axes = axes;
          spec.data = dataTable;
          spec.scales = scales;
          spec.padding = {"top": 30, "left": 30, "bottom": 30, "right": 100};
          spec.marks = marks;
          spec.legends = legends;

          return spec;      
          };

function drawLine(spec, div) {
 		vg.parse.spec(spec, function(chart) { 
        view = chart({el:div}).update(); 
        });
};

function updateLine(data) {
              view.data(dataName).insert(data);
              view.update();
          }



