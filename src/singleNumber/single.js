

/*************************************************** Single Number chart ***************************************************************************************************/

igviz.drawSingleNumberDiagram = function (chartObj) {
    var divId = chartObj.canvas;
    var chartConfig = chartObj.config;
    var dataTable = chartObj.dataTable;

    //Width and height
    var w = chartConfig.width;
    var h = chartConfig.height;

    //configure font sizes
    var MAX_FONT_SIZE = w / 25;
    var AVG_FONT_SIZE = w / 18;
    var MIN_FONT_SIZE = w / 25;

    //div elements to append single number diagram components
    var minDiv = "minValue";
    var maxDiv = "maxValue";
    var avgDiv = "avgValue";


    var chartConfig = {
        "xAxis": chartConfig.xAxis,
        "yAxis": 1,
        "aggregate": "sum",
        "chartType": "bar",
        "width": 600,
        "height": h * 3 / 4
    };


    var chart = igviz.setUp(divId, chartConfig, dataTable);
    chart.plot(dataTable.data);

    //prepare the dataset (all plot methods should use { "data":dataLine, "config":chartConfig } format
    //so you can use util methods
    var dataset = dataTable.data.map(function (d) {
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
        .attr("height", h);


    //Minimum value goes here
    SingleNumberDiagram.append("text")
        .attr("id", minDiv)
        .text("Max: " + d3.max(selectedColumn))
        //.text(50)
        .attr("font-size", MIN_FONT_SIZE)
        .attr("x", w * 3 / 4)
        .attr("y", 6 * h / 7)
        .style("fill", "Red")
        .style("text-anchor", "start")
        .style("lignment-baseline", "middle");

    //Average value goes here
    SingleNumberDiagram.append("text")
        .attr("id", avgDiv)
        .text("Avg :" + getAvg(selectedColumn))
        .attr("font-size", AVG_FONT_SIZE)
        .attr("x", w / 2)
        .attr("y", 6 * h / 7)
        //d3.select("#" + avgDiv).attr("font-size") / 5)
        .style("fill", "Green")
        .style("text-anchor", "middle")
        .style("lignment-baseline", "middle");

    //Maximum value goes here
    SingleNumberDiagram.append("text")
        .attr("id", maxDiv)
        .text("Min: " + d3.min(selectedColumn))
        .attr("font-size", MAX_FONT_SIZE)
        .attr("x", w / 4)
        .attr("y", 6 * h / 7)
        .style("fill", "Black")
        .style("text-anchor", "end")
        .style("lignment-baseline", "middle");
};
