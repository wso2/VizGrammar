/*
 * Copyright (c) 2015, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing,
 *   software distributed under the License is distributed on an
 *   "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *   KIND, either express or implied.  See the License for the
 *   specific language governing permissions and limitations
 *   under the License.
 */

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
};

igviz.setUp = function (canvas, config, dataTable) {
    var newDataTable;
    if (!dataTable.hasOwnProperty("metadata")) {
        newDataTable = {metadata: dataTable, data: []};
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
