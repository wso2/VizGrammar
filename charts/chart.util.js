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
        config.padding = {"top": 10, "left": 50, "bottom": 40, "right": 100};
	}

	if (config.hoverType == null) {
		config.hoverType = "symbol";
	}

    if (config.tooltip == null) {
        config.tooltip = true;
    }

    config.height = config.height  - (config.padding.top + config.padding.bottom);
    config.width = config.width  - (config.padding.left + config.padding.right);

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

function createTooltip(div) {
   document.getElementById(div.replace("#", "")).innerHTML = document.getElementById(div.replace("#", "")).innerHTML 
        + "<div id= "+div.replace("#", "")+"-tooltip></div>";
}

function bindTooltip(div, view, config, metadata){

    view.on("mouseover", function(event, item) {
      if (item != null) { 
        var tooltipSpan = document.getElementById(div.replace("#", "")+"-tooltip");
        var tooltipContent = "";
        

        if (metadata.names[config.x] != null) {
          tooltipContent += "<b>X</b> ("+ metadata.names[config.x] +") : "+item.datum[metadata.names[config.x]]+"<br/>" ;
        }

        if (metadata.names[config.y] != null) {
          tooltipContent += "<b>Y</b> ("+ metadata.names[config.y] + ") : "+item.datum[metadata.names[config.y]]+"<br/>" ;
        }

        tooltipSpan.innerHTML = tooltipContent;
        tooltipSpan.style.padding = "5px 5px 5px 5px";

        window.onmousemove = function (e) {
          tooltipSpan.style.top = (e.clientY + 15) + 'px';
          tooltipSpan.style.left = (e.clientX + 10) + 'px';
          tooltipSpan.style.zIndex  = 1000;
          tooltipSpan.style.backgroundColor = config.toolTip.color;
          tooltipSpan.style.position = "fixed";

          if (tooltipSpan.offsetWidth +  e.clientX - (cumulativeOffset(document.getElementById(div.replace("#", ""))).left + config.padding.left)  >  document.getElementById(div.replace("#", "")).offsetWidth) {
            tooltipSpan.style.left = (e.clientX - tooltipSpan.offsetWidth) + 'px';
          }

          if (e.clientY - (cumulativeOffset(document.getElementById(div.replace("#", ""))).top + 500) >  document.getElementById(div.replace("#", "")).offsetHeight) {
            tooltipSpan.style.top = (e.clientY - 400) + 'px';
          }
        
        }; 
      }
    })
    .on("mouseout", function(event, item) {
      var tooltipSpan = document.getElementById(div.replace("#", "")+"-tooltip");
      tooltipSpan.style.padding = "0px 0px 0px 0px";
      tooltipSpan.innerHTML = "";
    }).update();
}


function cumulativeOffset(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        top: top,
        left: left
    };
};



