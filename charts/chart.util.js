function checkConfig(config, metadata){

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
	} else if (config.color != "*"){
		config.color = metadata.names.indexOf(config.color);
	}

    if (config.mapType == null) {
        config.mapType = -1;
    }

    if (config.minColor == null) {
        config.minColor = -1;
    }

    if (config.maxColor == null) {
        config.maxColor = -1;
    }

    if (config.mode == null) {
        config.mode = "stack";
    }

    if (config.size == null) {
        config.size = -1;
    } else {
        config.size = metadata.names.indexOf(config.size);
    }

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	if (config.markColor == null) {
		config.markColor = "steelblue";
	}

	if (config.markSize == null) {
		config.markSize = 2;
	}

	if (config.fillOpacity == null) {
		config.fillOpacity = 1;
	}

    if (config.renderer == null) {
        config.renderer = "canvas";
    }

	if (config.toolTip == null) {
		config.toolTip = {"height" : 35, "width" : 120, "color":"#e5f2ff", "x": 0, "y":-30};
	}

	if (config.padding == null) {
        config.padding = {"top": 50, "left": 60, "bottom": 40, "right": 150};
	}

	if (config.hoverType == null) {
		config.hoverType = "symbol";
	}

    if (config.tooltip == null) {
        config.tooltip = true;
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

/*
	General function used to draw circle symbols graphs
*/
function getSymbolMark(config, metadata) {

  var fill;
  if (config.color != -1) { 
      fill =  {"scale": "color", "field": metadata.names[config.color]};
  } else {
      fill = {"value":config.markColor};
  }

var  mark = {
      "type": "symbol",
      "from": {"data": config.title},
      "properties": {
        "update": {
          "x": {"scale": "x", "field": metadata.names[config.x]},
          "y": {"scale": "y", "field": metadata.names[config.y]},
          "fill": fill,
          "size": {"value": config.markSize},
          "fillOpacity": {"value": config.fillOpacity}
        }
      }
    }

    return mark;
}


function getToolTipMark(config , metadata) {
	    var mark =    {
            "type": "group",
            "from": {"data": "table",
                "transform": [
                    {
                        "type": "filter",
                        "test": "datum." + metadata.names[config.x] + " == hover." + metadata.names[config.x] + ""
                    }
                ]},
                    "properties": {
                        "update": {
                            "x": {"scale": "x", "signal": "hover." + metadata.names[config.x], "offset": config.toolTip.x},
                            "y": {"scale": "y", "signal": "hover." + metadata.names[config.y], "offset": config.toolTip.y},
                            "width": {"value": config.toolTip.width},
                            "height": {"value": config.toolTip.height},
                            "fill": {"value": config.toolTip.color}
                }
            },

            "marks": [
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 14},
                            "text": {"template": "X \n (" + metadata.names[config.x] + ") \t {{hover." + metadata.names[config.x] + "}}"},
                            "fill": {"value": "black"}
                        }
                    }
                },
                {
                    "type": "text",
                    "properties": {
                        "update": {
                            "x": {"value": 6},
                            "y": {"value": 29},
                            "text": {"template": "Y \t (" + metadata.names[config.y] + ") \t {{hover." + metadata.names[config.y] + "}}"},
                            "fill": {"value": "black"}
                        }
                    }
                }
            ]
        }

    return mark;
}

function getSignals(config, metadata){

    var signals = [{

            "name": "hover",
            "init": {},
            "streams": [
                {"type": config.hoverType+":mouseover", "expr": "datum"},
                {"type": config.hoverType+":mouseout", "expr": "{}"}
            ]
    }];

    return signals;

}



