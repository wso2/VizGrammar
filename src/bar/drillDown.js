

/*************************************************** Bar chart Drill Dowining Function  ***************************************************************************************************/

igviz.drillDown = function drillDown(index, divId, chartConfig, dataTable, originaltable) {
    //	console.log(dataTable,chartConfig,divId);
    if (index == 0) {
        d3.select(divId).append('div').attr({id: 'links', height: 20, 'bgcolor': 'blue'})
        d3.select(divId).append('div').attr({id: 'chartDiv'})
        chartConfig.height = chartConfig.height - 20;
        divId = "#chartDiv";
    }
    var currentChartConfig = JSON.parse(JSON.stringify(chartConfig));
    var current_x = 0;
    if (index < chartConfig.xAxis.length)
        current_x = chartConfig.xAxis[index].index
    else
        current_x = chartConfig.xAxis[index - 1].child;

    var current_y = chartConfig.yAxis;
    var currentData = {
        metadata: {
            names: [dataTable.metadata.names[current_x], dataTable.metadata.names[current_y]],
            types: [dataTable.metadata.types[current_x], dataTable.metadata.types[current_y]]
        },
        data: []
    }

    var tempData = [];
    for (i = 0; i < dataTable.data.length; i++) {
        name = dataTable.data[i][current_x];
        currentYvalue = dataTable.data[i][current_y];
        isFound = false;
        var j = 0;
        for (; j < tempData.length; j++) {
            if (tempData[j][0] === name) {
                isFound = true;
                break;
            }
        }
        if (isFound) {
            tempData[j][1] += currentYvalue;
            console.log(name, currentYvalue, tempData[j][1]);
        } else {
            console.log("create", name, currentYvalue);
            tempData.push([name, currentYvalue])
        }
    }

    currentData.data = tempData;
    currentChartConfig.xAxis = 0;
    currentChartConfig.yAxis = 1;
    currentChartConfig.chartType = 'bar';


    var x = this.setUp(divId, currentChartConfig, currentData);
    x.plot(currentData.data, function () {

        var filters = d3.select('#links .root').on('click', function () {
            d3.select("#links").html('');
            igviz.drillDown(0, divId, chartConfig, originaltable, originaltable);

        })


        var filters = d3.select('#links').selectAll('.filter');
        filters.on('click', function (d, i) {

            var filtersList = filters.data();

            console.log(filtersList)
            var filterdDataset = [];
            var selectionObj = JSON.parse(JSON.stringify(originaltable));
            var itr = 0;
            for (l = 0; l < originaltable.data.length; l++) {
                var isFiltered = true;
                for (k = 0; k <= i; k++) {

                    if (originaltable.data[l][filtersList[k][0]] !== filtersList[k][1]) {
                        isFiltered = false;
                        break;
                    }
                }
                if (isFiltered) {
                    filterdDataset[itr++] = originaltable.data[l];
                }

            }

            d3.selectAll('#links g').each(function (d, indx) {
                if (indx > i) {
                    this.remove();
                }
            })


            selectionObj.data = filterdDataset;

            igviz.drillDown(i + 1, divId, chartConfig, selectionObj, originaltable, true);


        });


        if (index < chartConfig.xAxis.length) {
            console.log(x);
            d3.select(x.chart._el).selectAll('g.type-rect rect').on('click', function (d, i) {
                console.log(d, i, this);
                console.log(d, i);
                var selectedName = d.datum.data[x.dataTable.metadata.names[x.config.xAxis]];
                //  console.log(selectedName);
                var selectedCurrentData = JSON.parse(JSON.stringify(dataTable));
                var innerText;

                var links = d3.select('#links').append('g').append('text').text(dataTable.metadata.names[current_x] + " : ").attr({

                    "font-size": "10px",
                    "x": 10,
                    "y": 20

                });

                d3.select('#links:first-child').selectAll('text').attr('class', 'root');

                d3.select('#links g:last-child').append('span').data([[current_x, selectedName]]).attr('class', 'filter').text(selectedName + "  >  ")

                var l = selectedCurrentData.data.length;
                var newdata = [];
                b = 0;
                for (a = 0; a < l; a++) {
                    if (selectedCurrentData.data[a][current_x] === selectedName) {
                        newdata[b++] = selectedCurrentData.data[a];
                    }
                }


                selectedCurrentData.data = newdata;


                igviz.drillDown(index + 1, divId, chartConfig, selectedCurrentData, originaltable, true);


            });

        }
    });


}

