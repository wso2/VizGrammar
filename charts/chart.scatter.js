var scatter = function(dataTable, config) {

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
        "range": config.colorScale,
        "domain": {"data":  config.title, "field": this.metadata.names[config.color]}
    };

    var scales =  [xScale, yScale, rScale, cScale];
    var axes =  getXYAxes(config, "x", "x", "y", "y");

    marks.push(getScatterMark(config, this.metadata));

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
      if(this.config.tooltip.enabled){
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
    var fill;
    var size;

    if (config.color == -1) {
        fill = {"value": config.markColor};
    } else {
        fill = {"scale": "color", "field": metadata.names[config.color]};
    }

    if (config.size == -1) {
        size = {"value": config.markSize * 50};
    } else {
        size = {"scale":"size","field":metadata.names[config.size]};
    }

    var mark = {

            "type": "symbol",
            "from": {"data": config.title},
            "properties": {
                "update": {
                    "x": {"scale": "x", "field": metadata.names[config.x]},
                    "y": {"scale": "y", "field": metadata.names[config.y]},
                    "fill": fill,
                    "size": size,
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
