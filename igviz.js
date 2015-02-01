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
		}
	};

	igviz.drawBarChart = function(divId, chartConfig, dataTable) {
		var width = chartConfig.chartWidth;
		var height = chartConfig.chartHight;
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
				//console.log(d.data[d.config.xAxisData]);
				return xScale(d.data[d.config.xAxisData]);
			})
			.attr("width", xScale.rangeBand())
			.attr("y", function(d) {
				return yScale(d.data[d.config.yAxisData]);
			})
			.attr("height", function(d) {
				return height - yScale(d.data[d.config.yAxisData]) - padding;
			});
	};


	igviz.drawScatterPlot = function(divId, chartConfig, dataTable) {
		//Width and height
		var w = chartConfig.chartWidth;
		var h = chartConfig.chartHight;
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
		var w = chartConfig.chartWidth;
		var h = chartConfig.chartHight;
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
		var selectedColumn = parseColumnFrom2DArray(tableData, dataset[0].config.xAxisData);

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
		if (dataTable.metadata.types[chartConfig.xAxisData] == 'N') {
			xScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
					return d.data[d.config.xAxisData];
				})])
				.range([chartConfig.padding, chartConfig.chartWidth - chartConfig.padding]);
		} else {
			xScale = d3.scale.ordinal()
				.domain(dataset.map(function(d) {
					return d.data[chartConfig.xAxisData];
				}))
				.rangeRoundBands([chartConfig.padding, chartConfig.chartWidth - chartConfig.padding], .1)
		}

		//TODO hanle case r and color are missing

		if (dataTable.metadata.types[chartConfig.yAxisData] == 'N') {
			yScale = d3.scale.linear()
				.domain([0, d3.max(dataset, function(d) {
					return d.data[d.config.yAxisData];
				})])
				.range([chartConfig.chartHight - chartConfig.padding, chartConfig.padding]);
			//var yScale = d3.scale.linear()
			//    .range([height, 0])
			//    .domain([0, d3.max(dataset, function(d) { return d.data[d.config.yAxisData]; })])
		} else {
			yScale = d3.scale.ordinal()
				.rangeRoundBands([0, chartConfig.chartWidth], .1)
				.domain(dataset.map(function(d) {
					return d.data[chartConfig.yAxisData];
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
		var w = chartConfig.chartWidth;
		var h = chartConfig.chartHight;
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
		if (dataTable.metadata.types[chartConfig.xAxisData] == 'C') {
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
			.text(dataTable.metadata.names[chartConfig.xAxisData]);


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
			.text(dataTable.metadata.names[chartConfig.yAxisData]);
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
				return xScale(d.data[d.config.xAxisData]);
			})
			.attr("cy", function(d) {
				return yScale(d.data[d.config.yAxisData]);
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
				return xScale(d.data[d.config.xAxisData]);
			})
			.attr("y", function(d) {
				return yScale(d.data[d.config.yAxisData]) - 10;
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