/*************************************************** Initializtion functions ***************************************************************************************************/


igviz.draw = function (canvas, config, dataTable) {
    var chart = new Chart(canvas, config, dataTable);

    if (config.chartType == "singleNumber") {
        chart.diagram = this.drawSingleNumberDiagram(chart);
    } else if (config.chartType == "map") {
        chart.diagram = this.drawMap(canvas, config, dataTable);
    } else if (config.chartType == "table") {
        chart.diagram = this.drawTable(canvas, config, dataTable);
    } else if (config.chartType == "arc") {
        chart.diagram = this.drawArc(canvas, config, dataTable);
    } else if (config.chartType == "drill") {
        chart.diagram = this.drillDown(0, canvas, config, dataTable, dataTable);
    }

    return chart;
    //return
};

igviz.setUp = function (canvas, config, dataTable) {
    if (!dataTable.hasOwnProperty("metadata")) {
        newDataTable = {metadata: dataTable, data: []}
        dataTable = newDataTable;
        console.log(dataTable);
    }


    var chartObject = new Chart(canvas, config, dataTable);

    if (config.chartType == "bar") {
        this.drawBarChart(chartObject, canvas, config, dataTable);
    } else if (config.chartType == "scatter") {
        this.drawScatterPlot(chartObject);
    } else if (config.chartType == "line") {
        this.drawLineChart(chartObject);
    } else if (config.chartType == "area") {
        this.drawAreaChart(chartObject);
    } else if (config.chartType == "series") {
        this.drawSeries(chartObject);
    }


    return chartObject;
};
