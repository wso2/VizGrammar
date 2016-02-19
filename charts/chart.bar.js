
var bar = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      var scales =[];
      this.spec = {};
      var yColumn;
      var yDomain;

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

        } else {
            yColumn = this.metadata.names[config.y];
            yDomain = config.title;
        }
        
        this.spec.legends = legends;
      } else {
        yColumn = this.metadata.names[config.y];
        yDomain = config.title;
      }

      var xScale = {
              "name": "x",
              "type": "ordinal",
              "range": "width",
              "domain": {"data":  config.title, "field": this.metadata.names[config.x]}
              };

    if (config.mode == "group") {
        xScale.padding = 0.2;
      }

      var yScale = {
          "name": "y",
          "type": this.metadata.types[config.y],
          "range": "height",
          "domain": {"data": yDomain, "field": yColumn}
          };
      
      scales.push(xScale);
      scales.push(yScale);



      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      if (config.color != -1 && config.mode == "stack") {
        marks.push(getStackBarMark(config, this.metadata));
      } else if (config.color != -1 && config.mode == "group") {
        marks.push(getGroupBarMark(config, this.metadata));
      } else {
        marks.push(getBarMark(config, this.metadata));
      }

      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;

      var specc = JSON.stringify(this.spec);
};

bar.prototype.draw = function(div, callbacks) {
    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).renderer(this.config.renderer).update();

        if(this.config.tooltip != false){
            bindTooltip(div,"rect",this.view,this.config,this.metadata);
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
                    var match;
                    if (color == -1) {
                      match =  d[xAxis] == data[i][xAxis]; 
                    } else {
                      match =  d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
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
                  var match;
                  if (color == -1) {
                    match =  d[xAxis] == data[i][xAxis]; 
                  } else {
                    match =  d[xAxis] == data[i][xAxis] &&  d[color] == data[i][color];
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


function getBarMark(config, metadata){

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
      

  return mark;
}

function getStackBarMark(config, metadata){

  var mark =      {
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
          "width": {"scale": "x", "band": true, "offset": -1},
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

function getGroupBarMark(config, metadata){

  var mark =  {
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
          "name": "bars",
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
              "fillOpacity": {"value": 0.5}
            }
          }
        }
      ]
    };
      

  return mark;
}

