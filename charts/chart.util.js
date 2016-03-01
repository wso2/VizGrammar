var extend = function (defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};

function checkConfig(config, metadata){
    
    if (config.color == null) {
		config.color = -1;
	} else if (config.color != "*"){
		config.color = metadata.names.indexOf(config.color);
	}

    if (config.size == null) {
        config.size = -1;
    } else {
        config.size = metadata.names.indexOf(config.size);
    }

    var defaults = {
        title: "table",
        xTitle: config.x,
        yTitle: config.y,
        grid: true,
        zero: false,
        mapType: -1,
        mode: "stack",
        colorScale: "category10", //color hex array or string: category10, 10c, category20, category20b, category20c
        maxLength: -1,
        markSize: 2,
        fillOpacity: 1,
        renderer: "svg", //string: canvas or svg
        legendTitleColor: "#222",
        legendTitleFontSize: 13,
        legendTextColor: "#888",
        ledgendTextFontSize: 12,
        padding: {"top": 10, "left": 50, "bottom": 40, "right": 100},
        hoverType: "symbol",
        tooltip: true,
        toolTip: {"height" : 35, "width" : 120, "color":"#e5f2ff", "x": 0, "y":-30},
        dateFormat: "%x %X",
        xTicks: 0,
        yTicks: 0,
        xFormat: "",
        yFormat: ""
    };
    
    if (typeof vizgSettings != 'undefined'){
        defaults = extend(defaults, vizgSettings);
    }

    config = extend(defaults, config);
    config.height = config.height  - (config.padding.top + config.padding.bottom);
    config.width = config.width  - (config.padding.left + config.padding.right);

    if (typeof config.colorScale == "string") {
      config.markColor = window["d3"]["scale"][config.colorScale]().range()[0];
    } else {
      config.markColor = config.colorScale[0];
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

function bindTooltip(div,markType,eventObj, config, metaData, keyList){

    eventObj.on("mouseover", function(event, item) {

        if (item != null && item.status != "exit" && item.mark.marktype == markType) {
            var canvas = $(".marks")[0];
            if($("#wrapper #tip").length) {
                $tip.remove();
            }

            $(div).wrap( "<div id='wrapper' style='position: relative'></div>" );

            $("#wrapper").append("<div id='tip' class='tooltipClass' style='top:0; left: 0; position: absolute'></div>");
            $tip=$('#tip');
            $tip.empty();

            var dataObj = item.datum;
            var dynamicContent = "";
            for (var key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    if(keyList != undefined){
                        for(var z=0;z<keyList.length;z++){
                            for (var keyVal in config) {
                                if(keyVal == keyList[z] && metaData.names[config[keyVal]] == key){
                                    dynamicContent += "<p>"+keyList[z]+" ("+key+"):"+dataObj[key]+"</p>";
                                    break;
                                }
                            }
                        }
                    }else{
                        if(metaData.names[config.x] == key){
                            dynamicContent += "<p>X ("+key+"):"+dataObj[key]+"</p>";
                        }
                        if(metaData.names[config.y] == key){
                            dynamicContent += "<p>Y ("+key+"):"+dataObj[key]+"</p>";
                        }
                    }
                }
            }

            $tip.append(dynamicContent);

            var canvasWidth = canvas.width;
            var canvasHeight = canvas.height;

            var el = $('.marks[style*="width"]');

            if(el.length > 0){
                canvasWidth = parseFloat($(".marks")[0].style.width);
                canvasHeight = parseFloat($(".marks")[0].style.height);
            }
            var dynamicWidth = $tip.width();
            var dynamicHeight = $tip.height();

            var toolTipWidth = item.bounds.x2 + config.padding.left + dynamicWidth;
            var toolTipHeight = (canvasHeight - item.bounds.y2) - config.padding.top + dynamicHeight;
            var toolTipCalculatedXPosition;
            var toolTipCalculatedYPosition = ((item.bounds.y2 + config.padding.top) - dynamicHeight);

            if(toolTipWidth > canvasWidth){
                toolTipCalculatedXPosition = ((item.bounds.x2 + config.padding.left) - dynamicWidth);
            }else{
                toolTipCalculatedXPosition = (item.bounds.x2 + config.padding.left);
            }

            if(toolTipHeight > canvasHeight){
                toolTipCalculatedYPosition = item.bounds.y2 + config.padding.top;
            }

            $tip.css({left:toolTipCalculatedXPosition,top:toolTipCalculatedYPosition}).show();
        }else{

            if($("#wrapper #tip").length) {
                $tip.remove();
            }
            if($(div).closest("#wrapper").length) {
                $(div).unwrap();
            }
        }
    })
};



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
          var content;

          if (metadata.types[config.x]== "time") {
            var dFormat =  d3.time.format(config.dateFormat);
            content =  dFormat(new Date(parseInt(item.datum[metadata.names[config.x]])));
          } else {
            content = item.datum[metadata.names[config.x]];
          }

          tooltipContent += "<b>"+ metadata.names[config.x] +"</b> : "+content+"<br/>" ;
        }

        if (metadata.names[config.y] != null) {
          tooltipContent += "<b>"+ metadata.names[config.y] + "</b> : "+item.datum[metadata.names[config.y]]+"<br/>" ;
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