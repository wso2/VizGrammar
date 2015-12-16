/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License./
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var area = function(dataTable, config) {
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
                "zero": "false",
                "domain": {"data":  config.title, "field": this.metadata.names[config.y]}
                };
      
      var scales =  [xScale, yScale]; 

      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      marks.push(getAreaMark(config, this.metadata));
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
};

area.prototype.draw = function(div) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

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
                            "fill": { "value": "steelblue"},
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

;
var bar = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      var xScale = {
                    "name": "x",
                    "type": "ordinal",
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
      var axes =  [
                    {"type": "x", "scale": "x","grid": config.grid,  "title": config.xTitle},
                    {"type": "y", "scale": "y", "grid": config.grid,  "title": config.yTitle}
                  ];

      marks.push(getBarMark(config, this.metadata));
      
      this.spec.width = config.width;
      this.spec.height = config.height;
      this.spec.axes = axes;
      this.spec.data = dataTable;
      this.spec.scales = scales;
      this.spec.padding = config.padding;
      this.spec.marks = marks;
};

bar.prototype.draw = function(div) {
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
      if (this.config.maxLength != -1 && this.config.maxLength <  (this.view.data(this.config.title).values().length + data.length)) {
        var oldData;
        var removeFunction = function(d) { 
              return d[xAxis] == oldData; 
            };

        for (i = 0; i < data.length; i++) {
          oldData = this.view.data(this.config.title).values()[i][xAxis];
          this.view.data(this.config.title).remove(removeFunction);  
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

;var vizg = function(dataTable, config) {

	dataTable = buildTable(dataTable); 

	if (config.charts.length == 1) {
		config.type = config.charts[0].type;
		config.y = config.charts[0].y;
		config.color = config.charts[0].color;

		this.chart =  new window[config.type]([dataTable], config);
	} else {
		
	}	
};

vizg.prototype.draw = function(div) {
	this.chart.draw(div);
};

vizg.prototype.insert = function(data) {
	this.chart.insert(buildData(data, this.chart.metadata));
};


vizg.prototype.getSpec = function() {
	return this.chart.getSpec();
};;
var line = function(dataTable, config) {
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

line.prototype.draw = function(div) {

    var viewUpdateFunction = (function(chart) {
       this.view = chart({el:div}).update();
    }).bind(this);

 		vg.parse.spec(this.spec, viewUpdateFunction);
};

line.prototype.insert = function(data) {
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

line.prototype.getSpec = function() {
  return this.spec;
};


function getLineMark(config, metadata){
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
                mark = {
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

;
var number = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

number.prototype.draw = function(div) {
  div = div.replace("#","");
  var contentId = div+"Content";
  var textContent = "";

  if (this.data != null && this.data.length != 0) {
      textContent = this.data[this.data.length-1][this.metadata.names[this.config.x]];    
  }

  var divContent = "<p style='padding: 0px 0px 0px 20px;'>"+this.config.title+"</p><br/>"
                  +"<p style='font-size:60;padding: 0px 0px 0px 20px;' id='"+contentId+"'>"
                  +textContent+"</p>";

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    document.getElementById(this.view).innerHTML = data[data.length-1][this.metadata.names[this.config.x]];
};



;
var table = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};
      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

table.prototype.draw = function(div) {
  var table = d3.select(div).append("table").attr( "border", "2px");

      // set up the table header
      table.append('thead').attr("align", "center")
          .append('tr')
          .selectAll('th')
              .data(this.metadata.names)
          .enter()
              .append('th')
              .text(function (d) { return d })

      table.append('tbody');
      setupData(this.data, this.metadata.names[this.config["x"]]);

      table.selectAll("thead th")
      .text(function(column) {
          return column.charAt(0).toUpperCase() + column.substr(1);
      });
  
      
      };

table.prototype.insert = function(data) {
    setupData(data, this.metadata.names[this.config["x"]]);
};


function setupData(data, xAxis) {
   //Select Rows by x Axis
    var rows = d3.select('tbody')
        .selectAll('tr')
        .data(data, function(d) { return d[xAxis]})

    var entertd = rows.enter()
        .append('tr')
            .selectAll('td')
                .data(function(d) { return d3.map(d).values() })
            .enter()
                .append('td')
                .attr("width", "100px")
    
    entertd.append('div')
    entertd.append('span')
    var td = rows.selectAll('td')
    .style({"padding": "0px 0px 0px 10px"})
        .data(function(d) { return d3.map(d).entries() })
        .attr('class', function (d) { return d.key })
    

    td.select('span')
        .text(function(d) {
            return d.value
        })
};function checkConfig(config, metadata){

	if (config.title == null) {
		config.title = "table";
	}

	if (config.xTitle == null) {
		config.xTitle = config.x;
	}

	if (config.yTitle == null) {
		config.yTitle = config.y;
	}

	if (config.colorScale == null) {
		config.colorScale = "category10";
	}

	if (config.grid == null) {
		config.grid  = true; 
	}

	if (config.zero == null) {
		config.zero = false;
	}

	if (config.color == null) {
		config.color = -1;
	} else {
		config.color = metadata.names.indexOf(config.color);
	}

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	if (config.padding == null) {
		config.padding = {"top": 30, "left": 50, "bottom": 100, "right": 100};
	}

	config.x = metadata.names.indexOf(config.x);
    config.y = metadata.names.indexOf(config.y);

    return config;
}

function buildTable(datatable) {
	var chartDatatable = {};
	chartDatatable.metadata = datatable[0].metadata;
	chartDatatable.values = buildData(datatable[0].data, datatable[0].metadata);
	return chartDatatable;
}


function buildData(data, metadata) {
	chartData = [];
	for (i = 0; i < data.length; i++) {
		var row = {};
		for (x = 0; x < metadata.names.length; x++) {
			row[metadata.names[x]] = data[i][x];
		}
		chartData.push(row);
	}
	return chartData;
}



