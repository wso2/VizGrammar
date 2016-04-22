
var area = function(dataTable, config) {
    this.metadata = dataTable[0].metadata;
    var marks =[];
    var signals = [];
    this.spec = {};

    config = checkConfig(config, this.metadata);
    this.config = config;
    dataTable[0].name= config.title;

    var scales =  getXYScales(config, this.metadata);

    if (config.color != -1) {

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

        var legendTitle = "Legend";

        if (config.title != "table") {
            legendTitle = config.title;
        }

      if (this.config.legend) {
         this.spec.legends = getLegend(this.config);
      }
    }


    var axes =  getXYAxes(config, "x", "x", "y", "y");

      marks.push(getAreaMark(config, this.metadata));
      config.fillOpacity  = 0;
      config.markSize = 1000;
      marks.push(getSymbolMark(config, this.metadata));

      if (config.range) {
         signals = getRangeSignals(config, signals);
         marks = getRangeMark(config, marks);
      }
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
      this.spec.signals = signals;
};

area.prototype.draw = function(div, callbacks) {

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

     drawChart(div, this, callbacks);

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
                    "type": "area",
                    "properties": {
                        "update": {
                            "x": {"scale": "x", "field": metadata.names[config.x]},
                            "y": {"scale": "y", "field": metadata.names[config.y]},
                            "y2": {"scale": "y", "value": 0},
                            "fill": {"scale": "color", "field": metadata.names[config.color]},
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
    }else{
        mark = {
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
    }


    return mark;
}

