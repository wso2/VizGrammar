
var area = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};
      var scales = [];

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;


      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;
      
      if (config.color != -1) {
        var legendTitle = "Legend";
      if (config.title != "table") {
          legendTitle = config.title;
      }
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
                      "offset": 10,
                      "properties": {
                        "symbols": {
                          "fillOpacity": {"value": 0.5},
                          "stroke": {"value": "transparent"}
                        }
                      }
                    }
                    ];


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

        }
      } else {
          yColumn = this.metadata.names[config.y];
          yDomain = config.title;
      }

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
                "domain": {"data":  yDomain, "field": yColumn}
                };
      
      scales.push(xScale);
      scales.push(yScale);


      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      if (config.color != -1 && config.mode == "stack") {
        marks.push(getStackAreaMark(config, this.metadata));
      } else {
        marks.push(getAreaMark(config, this.metadata));
      }

      marks.push(getAreaMark(config, this.metadata));
      config.fillOpacity  = 0;
      config.markSize = 1000;
      marks.push(getSymbolMark(config, this.metadata));
      
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

        if(this.config.tooltip != false){
            bindTooltip(div,"symbol",this.view,this.config,this.metadata);
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


function getStackAreaMark(config, metadata){
        var mark = {
                      "type": "area",
                      "properties": {
                        "update": {
                          "x": {"scale": "x", "field": metadata.names[config.x]},
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

