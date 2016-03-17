
var arc = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      dataTable[0].transform = [{
                                  "type": "pie",
                                   "field": this.metadata.names[config.x]
                                },
                                {
                                  "type": "formula",
                                  "field": "percentage",
                                  "expr": "datum."+this.metadata.names[config.x]+" / 360 * 100"
                                }];
      
      var scales =  []; 

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
      marks.push(getPieMark(config, this.metadata));

      if (config.percentage) {
        marks.push(getPieText(config, this.metadata));
      }

      
      var legendTitle = "Legend";

      if (config.title != "table") {
          legendTitle = config.title;
      }

      if (this.config.legend) {
         this.spec.legends = getLegend(this.config);
      }
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
};

arc.prototype.draw = function(div, callbacks) {

    var viewUpdateFunction = (function(chart) {
      if(this.config.tooltip.enabled){
        this.config.tooltip.type = "arc";
        createTooltip(div);
        this.view = chart({el:div}).renderer(this.config.renderer).update();
        bindTooltip(div,this.view,this.config,this.metadata);
      } else {
         this.view = chart({el:div}).renderer(this.config.renderer).update();
      }

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

arc.prototype.insert = function(data) {

    var color = this.metadata.names[this.config.color];
    var x = this.metadata.names[this.config.x];
    var view =this.view;



    var updated = false;

    for (i = 0; i < data.length; i++) {
          this.view.data(this.config.title)
           .update(
            function(d) { 
              return d[color] == data[i][color]; 
            }, 
            x, 
            function(d) { 
              updated = true;
              return data[i][x]; 
            });  
        }

        if (updated == false) {
          view.data(this.config.title).insert(data);
        }

     this.view.update({duration: 500});
};

arc.prototype.getSpec = function() {
  return this.spec;
};


function getPieMark(config, metadata){
        var innerRadius;
        if (config.mode == "donut") { 
          var innerRadius = config.width / 5 * ( 1 + config.innerRadius);
        } else {
          var innerRadius = 0;
        }

        var mark =  {
                      "type": "arc",
                      "from":  {"data": config.title},
                      "properties": {
                        "update": {
                          "x": {"field": {"group": "width"}, "mult": 0.5},
                          "y": {"field": {"group": "height"}, "mult": 0.5},
                          "startAngle": {"field": "layout_start"},
                          "endAngle": {"field": "layout_end"},
                          "innerRadius": {"value": innerRadius},
                          "outerRadius":  {"value": config.width * 0.4},
                          "fill": {"scale": "color", "field": metadata.names[config.color]},
                          "fillOpacity": {"value": 1}
                        },

                        "hover": {
                          "fillOpacity": {"value": 0.8}
                        }
                      }
                    };

        return mark;
};

function getPieText(config, metadata){
        var mark =      {
                          "type": "text",
                          "from": {"data": config.title},
                          "properties": {
                            "update": {
                              "x": {"field": {"group": "width"}, "mult": 0.5},
                              "y": {"field": {"group": "height"}, "mult": 0.5},
                              "radius": { "value": config.width * 0.5},
                              "theta": {"field": "layout_mid"},
                              "fill": {"value": "#000"},
                              "align": {"value": "center"},
                              "baseline": {"value": "middle"},
                              "text": {"template": "{{datum.percentage | number:'.1f'}}%"}

                            }
                          }
                        };

        return mark;
};

