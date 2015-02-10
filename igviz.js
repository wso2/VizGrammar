(function() {
	
	var igviz = window.igviz || {};

	igviz.version = '1.0.0';
	igviz.dev = true; //set false when in production

	window.igviz = igviz;

	igviz.plot = function(canvas, config, dataTable) {
		if (config.chartType == "bar") {
			this.drawBarChart(canvas, config, dataTable);
		} else if (config.chartType == "scatter") {
			this.drawScatterPlot(canvas, config, dataTable);
		} else if (config.chartType == "singleNumber") {
			this.drawSingleNumberDiagram(canvas, config, dataTable);
		} else if (config.chartType == "map") {
			this.drawMap(canvas, config, dataTable);
		}
	};

	igviz.drawMap = function(divId, chartConfig, dataTable) { //add this
		//Width and height
		divId = divId.substr(1);
		var w = chartConfig.width;
		var h = chartConfig.height;

		var mode = chartConfig.mode;
		var regionO = chartConfig.region;


		//prepare the dataset (all plot methods should use { "data":dataLine, "config":chartConfig } format
		//so you can use util methods
		var dataset = dataTable.data.map(function(d, i) {
			return {
				"data": d,
				"config": chartConfig,
				"name": dataTable.metadata.names[i]
			}
		});

		var tempArray = [];
		var mainArray = [];

		var locIndex = dataset[0].config.mapLocation;
		var pColIndex = dataset[0].config.pointColor;
		var pSizIndex = dataset[0].config.pointSize;
		tempArray.push(dataset[locIndex].name, dataset[pColIndex].name, dataset[pSizIndex].name);
		mainArray.push(tempArray);

		for (var counter = 0; counter < dataset.length; counter++) {
			tempArray = [];
			tempArray.push(dataset[counter].data[locIndex], dataset[counter].data[pColIndex], dataset[counter].data[pSizIndex]);
			mainArray.push(tempArray);
		}

		var mainStrArray = [];

		for (var i = 0; i < mainArray.length; i++) {
			var tempArr = mainArray[i];
			var str = '';
			for (var j = 1; j < tempArr.length; j++) {
				str += mainArray[0][j] + ':' + tempArr[j] + ' , '
			}
			str = str.substring(0, str.length - 3);
			str = mainArray[i][0].toUpperCase() + "\n" + str;
			tempArray = [];
			tempArray.push(mainArray[i][0]);
			tempArray.push(str);
			mainStrArray.push(tempArray);
		};

		//hardcoded
		// alert(divId);
		document.getElementById(divId).setAttribute("style", "width: " + w + "px; height: " + h + "px;");


		update(mainStrArray, mainArray);

		function update(arrayStr, array) {

			//hardcoded options
			//            var dropDown = document.getElementById("mapType");        //select dropdown box Element
			//            var option = dropDown.options[dropDown.selectedIndex].text;     //get Text selected in drop down box to the 'Option' variable
			//
			//            var dropDownReg = document.getElementById("regionType");        //select dropdown box Element
			//            regionO = dropDownReg.options[dropDownReg.selectedIndex].value;     //get Text selected in drop down box to the 'Option' variable


			if (mode == 'satellite' || mode == "terrain" || mode == 'normal') {
				drawMap(arrayStr);
			}
			if (mode == 'regions' || mode == "markers") {

				drawMarkersMap(array);
			}

		}


		function drawMap(array) {
			var data = google.visualization.arrayToDataTable(array
				// ['City', 'Population'],
				// ['Bandarawela', 'Bandarawela:2761477'],
				// ['Jaffna', 'Jaffna:1924110'],
				// ['Kandy', 'Kandy:959574']
			);

			var options = {
				showTip: true,
				useMapTypeControl: true,
				mapType: mode
			};

			//hardcoded
			var map = new google.visualization.Map(document.getElementById(divId));
			map.draw(data, options);
		};

		function drawMarkersMap(array) {
			console.log(google)
			console.log(google.visualization);
			var data = google.visualization.arrayToDataTable(array);

			var options = {
				region: regionO,
				displayMode: mode,
				colorAxis: {
					colors: ['red', 'blue']
				},
				magnifyingGlass: {
					enable: true,
					zoomFactor: 3.0
				},
				enableRegionInteractivity: true
					//legend:{textStyle: {color: 'blue', fontSize: 16}}
			};

			//hardcoded
			var chart = new google.visualization.GeoChart(document.getElementById(divId));
			chart.draw(data, options);
		};


	}


	igviz.drawBarChart = function(divId, chartConfig, dataTable) {
		var width = chartConfig.width;
		var height = chartConfig.height;
		var padding = chartConfig.padding;

		var dataset = dataTable.data.map(function(d) {
			return {
				"data": d,
				"config": chartConfig
			}
		});

		var plotCtx = createScales(dataset, chartConfig, dataTable);
		var xScale = plotCtx.xScale;
		var yScale = plotCtx.yScale;


		var svgID = divId + "_svg";
		//Remove current SVG if it is already there
		d3.select(svgID).remove();


		var svg = d3.select(divId)
			.append("svg")
			.attr("id", svgID.replace("#", ""))
			.attr("width", width)
			.attr("height", height);

		createXYAxises(svg, plotCtx, chartConfig, dataTable);

		//Now we really drwa by creating rectangles. The layout is done such a way that (0,0)
		// starts from bottom left corner as usual.
		//TODO handle multiple column groups using color
		//http://bl.ocks.org/mbostock/3887051
		svg.selectAll(".bar")
			.data(dataset)
			.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function(d) {
				return xScale(d.data[d.config.xAxis]);
			})
			.attr("width", xScale.rangeBand())
			.attr("y", function(d) {
				return yScale(d.data[d.config.yAxis]);
			})
			.attr("height", function(d) {
				return height - yScale(d.data[d.config.yAxis]) - padding;
			});
	};


	igviz.drawScatterPlot = function(divId, chartConfig, dataTable) {
		//Width and height
		var w = chartConfig.width;
		var h = chartConfig.height;
		var padding = chartConfig.padding;

		//prepare the dataset (all plot methods should use { "data":dataLine, "config":chartConfig } format
		//so you can use util methods
		var dataset = dataTable.data.map(function(d) {
			return {
				"data": d,
				"config": chartConfig
			}
		});

		var plotCtx = createScales(dataset, chartConfig, dataTable);
		var xScale = plotCtx.xScale;
		var yScale = plotCtx.yScale;
		var rScale = plotCtx.rScale;
		var colorScale = plotCtx.colorScale;

		var svgID = divId + "_svg";
		//Remove current SVG if it is already there
		d3.select(svgID).remove();

		//Create SVG element
		var svg = d3.select(divId)
			.append("svg")
			.attr("id", svgID.replace("#", ""))
			.attr("width", w)
			.attr("height", h);
		svg.append("rect")
			.attr("x", 0).attr("y", 0)
			.attr("width", w).attr("height", h)
			.attr("fill", "rgba(222,235,247, 0.0)")

		createXYAxises(svg, plotCtx, chartConfig, dataTable);

		//Now we really drwa by creating circles. The layout is done such a way that (0,0)
		// starts from bottom left corner as usual.
		var group1 = svg.append("g")
			.attr("id", "circles")
			.selectAll("g")
			.data(dataset)
			.enter()
			.append("g");
		configurePoints(group1, xScale, yScale, rScale, colorScale);
		configurePointLabels(group1, xScale, yScale);
	};

	/**
	 * By : Fawsan M. <--fawsanm@wso2.com-->
	 * function to draw the Single Number Diagram
	 * @param divId
	 * @param chartConfig
	 * @param dataTable
	 */
	igviz.drawSingleNumberDiagram = function(divId, chartConfig, dataTable) {

		//Width and height
		var w = chartConfig.width;
		var h = chartConfig.height;
		var padding = chartConfig.padding;

		//configure font sizes
		var MAX_FONT_SIZE = 40;
		var AVG_FONT_SIZE = 70;
		var MIN_FONT_SIZE = 40;

		//div elements to append single number diagram components
		var minDiv = "minValue";
		var maxDiv = "maxValue";
		var avgDiv = "avgValue";


		//prepare the dataset (all plot methods should use { "data":dataLine, "config":chartConfig } format
		//so you can use util methods
		var dataset = dataTable.data.map(function(d) {
			return {
				"data": d,
				"config": chartConfig
			}
		});

		var svgID = divId + "_svg";
		//Remove current SVG if it is already there
		d3.select(svgID).remove();

		//Create SVG element
		var svg = d3.select(divId)
			.append("svg")
			.attr("id", svgID.replace("#", ""))
			.attr("width", w)
			.attr("height", h);


		//  getting a reference to the data
		var tableData = dataTable.data;

		//parse a column to calculate the data for the single number diagram
		var selectedColumn = parseColumnFrom2DArray(tableData, dataset[0].config.xAxis);

		//appending a group to the diagram
		var SingleNumberDiagram = svg
			.append("g");


		svg.append("rect")
			.attr("id", "rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", w)
			.attr("height", h)



		//Minimum value goes here
		SingleNumberDiagram.append("text")
			.attr("id", minDiv)
			.text("Max: " + getMax(selectedColumn))
			//.text(50)
			.attr("font-size", MIN_FONT_SIZE)
			.attr("x", 3 * w / 4)
			.attr("y", h / 4)
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("lignment-baseline", "middle");

		//Average value goes here
		SingleNumberDiagram.append("text")
			.attr("id", avgDiv)
			.text(getAvg(selectedColumn))
			.attr("font-size", AVG_FONT_SIZE)
			.attr("x", w / 2)
			.attr("y", h / 2 + d3.select("#" + avgDiv).attr("font-size") / 5)
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("lignment-baseline", "middle");

		//Maximum value goes here
		SingleNumberDiagram.append("text")
			.attr("id", maxDiv)
			.text("Min: " + getMin(selectedColumn))
			.attr("font-size", MAX_FONT_SIZE)
			.attr("x", 3 * w / 4)
			.attr("y", 3 * h / 4)
			.style("fill", "black")
			.style("text-anchor", "middle")
			.style("lignment-baseline", "middle");


	};

	/**
	 * Util Methods
	 */

	/**
	 * Creates correct scales based on x,y axis data columns, this leaving padding space around in SVG.
	 * @param dataset
	 * @param chartConfig
	 * @param dataTable
	 * @returns {{xScale: *, yScale: *, rScale: *, colorScale: *}}
	 */
	function createScales(dataset, chartConfig, dataTable) {
		//Create scale functions

		var xScale;
		var yScale;
		var colorScale;
		if (dataTable.metadata.types[chartConfig.xAxis] == 'N') {
			xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
					return d.data[d.config.xAxis];
				})])
				.range([chartConfig.padding, chartConfig.width - chartConfig.padding]);
		} else {
			xScale = d3.scale.ordinal()
				.domain(dataset.map(function(d) {
					return d.data[chartConfig.xAxis];
				}))
				.rangeRoundBands([chartConfig.padding, chartConfig.width - chartConfig.padding], .1)
		}

		//TODO hanle case r and color are missing

		if (dataTable.metadata.types[chartConfig.yAxis] == 'N') {
			yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
					return d.data[d.config.yAxis];
				})])
				.range([chartConfig.height - chartConfig.padding, chartConfig.padding]);
			//var yScale = d3.scale.linear()
			//    .range([height, 0])
			//    .domain([0, d3.max(dataset, function(d) { return d.data[d.config.yAxis]; })])
		} else {
			yScale = d3.scale.ordinal()
				.rangeRoundBands([0, chartConfig.width], .1)
				.domain(dataset.map(function(d) {
					return d.data[chartConfig.yAxis];
				}))
		}


		//this is used to scale the size of the point, it will value between 0-20
		var rScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) {
				return d.config.pointSize ? d.data[d.config.pointSize] : 20;
			})])
			.range([0, 20]);

		//TODO have to handle the case color scale is categorical : Done
		//http://synthesis.sbecker.net/articles/2012/07/16/learning-d3-part-6-scales-colors
		// add color to circles see https://www.dashingd3js.com/svg-basic-shapes-and-d3js
		//add legend http://zeroviscosity.com/d3-js-step-by-step/step-3-adding-a-legend
		if (dataTable.metadata.types[chartConfig.pointColor] == 'N') {
			colorScale = d3.scale.linear()
				.domain([-1, d3.max(dataset, function(d) {
					return d.config.pointColor ? d.data[d.config.pointColor] : 20;
				})])
				.range(["blue", "green"]);
		} else {
			colorScale = d3.scale.category20c();
		}

		//TODO add legend


		return {
			"xScale": xScale,
			"yScale": yScale,
			"rScale": rScale,
			"colorScale": colorScale
		}
	}


	/**
	 * Create XY axis and axis labels
	 * @param svg
	 * @param plotCtx
	 * @param chartConfig
	 * @param dataTable
	 */

	function createXYAxises(svg, plotCtx, chartConfig, dataTable) {
		var w = chartConfig.width;
		var h = chartConfig.height;
		var padding = chartConfig.padding;

		//Define X axis
		var xAxis = d3.svg.axis()
			.scale(plotCtx.xScale)
			.orient("bottom")
			.ticks(5);

		//Define Y axis
		var yAxis = d3.svg.axis()
			.scale(plotCtx.yScale)
			.orient("left")
			.ticks(5);

		//Create X axis
		var axis = svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + (h - padding) + ")")
			.call(xAxis);

		//if categroical, we slant the text
		if (dataTable.metadata.types[chartConfig.xAxis] == 'C') {
			axis.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", function(d) {
					return "rotate(-65)"
				});
		}

		axis.append("text")
			.style("font-size", "20px")
			.attr("y", 20)
			.attr("x", w - padding / 5)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(dataTable.metadata.names[chartConfig.xAxis]);


		//Create Y axis
		svg.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + (padding) + ",0)")
			.call(yAxis)
			.append("text")
			.style("font-size", "20px")
			.attr("y", 6)
			.attr("x", -10)
			.attr("transform", "rotate(-90)")
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text(dataTable.metadata.names[chartConfig.yAxis]);
	}


	/**
	 * Configure a point and set size and color
	 * @param group1
	 * @param xScale
	 * @param yScale
	 * @param rScale
	 * @param colorScale
	 */
	function configurePoints(group1, xScale, yScale, rScale, colorScale) {
		//TODO have to handle the case color scale is categorical
		group1.append("circle")
			.attr("cx", function(d) {
				return xScale(d.data[d.config.xAxis]);
			})
			.attr("cy", function(d) {
				return yScale(d.data[d.config.yAxis]);
			})
			.attr("r", function(d) {
				if (d.config.pointSize != -1) {
					return rScale(d.data[d.config.pointSize]);
				} else {
					return 5;
				}
			})
			.style("fill", function(d) {
				if (d.config.pointColor != -1) {
					return colorScale(d.data[d.config.pointColor]);
				} else {
					return 2;
				}
			});
	}


	/**
	 * Methods for the base.html
	 */
	/**
	 * Add text to each point
	 * @param group1
	 * @param xScale
	 * @param yScale
	 */

	function configurePointLabels(group1, xScale, yScale) {
		//TODO make this nicer
		group1.append("text")
			.attr("x", function(d) {
				return xScale(d.data[d.config.xAxis]);
			})
			.attr("y", function(d) {
				return yScale(d.data[d.config.yAxis]) - 10;
			})
			.style("font-family", "sans-serif")
			.style("font-size", "10px")
			.style("text-anchor", "middle")
			.text(function(d) {
				if (d.config.pointLabel != -1) {
					return d.data[d.config.pointLabel];
				} else {
					return "3";
				}
			});
	}



})();