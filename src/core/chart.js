//Constructor for CHART Object


/*************************************************** Chart Class And API ***************************************************************************************************/


function Chart(canvas, config, dataTable) {
    this.dataTable = dataTable;
    this.config = config;
    this.canvas = canvas;
}

Chart.prototype.setXAxis = function (xAxisConfig) {

    var xAxisSpec = this.spec.axes[0];
    if (xAxisConfig.zero != undefined) {
        this.spec.scales[0].zero = xAxisConfig.zero;
    }
    if (xAxisConfig.nice != undefined) {
        this.spec.scales[0].nice = xAxisConfig.nice;
    }

    setGenericAxis(xAxisConfig, xAxisSpec);

    return this;
}


Chart.prototype.setYAxis = function (yAxisConfig) {

    var yAxisSpec = this.spec.axes[1];
    if (yAxisConfig.zero != undefined) {
        this.spec.scales[1].zero = yAxisConfig.zero;
    }
    if (yAxisConfig.nice != undefined) {
        this.spec.scales[1].nice = xAxisConfig.nice;
    }

    setGenericAxis(yAxisConfig, yAxisSpec);

    return this;
}


Chart.prototype.setPadding = function (paddingConfig) {

    if (this.spec.padding == undefined) {
        this.spec.padding = {}
        this.spec.padding.top = 0;
        this.spec.padding.bottom = 0;
        this.spec.padding.left = 0;
        this.spec.padding.right = 0;
    }
    for (var propt in paddingConfig) {
        if (paddingConfig.hasOwnProperty(propt)) {

            this.spec.padding[propt] = paddingConfig[propt];
        }
    }

    this.spec.width = this.originalWidth - this.spec.padding.left - this.spec.padding.right;
    this.spec.height = this.originalHeight - this.spec.padding.top - this.spec.padding.bottom;

    return this;
}

Chart.prototype.unsetPadding = function () {
    delete this.spec.padding;
    this.spec.width = this.originalWidth;
    this.spec.height = this.originalHeight;
    return this;
}

Chart.prototype.setDimension = function (dimensionConfig) {

    if (dimensionConfig.width != undefined) {
        this.spec.width = dimensionConfig.width;
        this.originalWidth = dimensionConfig.width;
    }

    if (dimensionConfig.height != undefined) {
        this.spec.height = dimensionConfig.height;
        this.originalHeight = dimensionConfig.height;

    }

}

Chart.prototype.update = function (pointObj) {

    var newTable = setData([pointObj], this.config, this.dataTable.metadata);

    if (this.config.update == "slide") {

        var point = this.table.shift();
        this.dataTable.data.shift();

    }

    this.dataTable.data.push(pointObj);

    console.log(dataTable.data);
    this.table.push(newTable[0]);
    this.chart.data(this.data).update({"duration": 500});

}

Chart.prototype.updateList = function (dataList, callback) {

    for (i = 0; i < dataList.length; i++) {
        if (this.config.update == "slide")
            this.dataTable.data.shift();

        this.dataTable.data.push(dataList[i]);
    }

    var newTable = setData(dataList, this.config, this.dataTable.metadata);

    for (i = 0; i < dataList.length; i++) {


        if (this.config.update == "slide") {
            this.table.shift();
        }

        this.table.push(newTable[i]);
    }

    //     console.log(point,this.chart,this.data);
    this.chart.data(this.data).update({"duration": 500});

}

Chart.prototype.resize = function () {
    var ref = this;
    var newH = document.getElementById(ref.canvas.replace('#', '')).offsetHeight
    var newW = document.getElementById(ref.canvas.replace('#', '')).offsetWidth
    console.log("Resized", newH, newW, ref)

    var left = 0, top = 0, right = 0, bottom = 0;

    var w = ref.spec.width;
    var h = ref.spec.height;

    //if(ref.spec.padding==undefined)
    //{
    //    w=newW;
    //    h=newH;
    //
    //}
    // else {
    //
    //    if (ref.spec.padding.left!=undefined){
    //        left=ref.spec.padding.left;
    //
    //    }
    //
    //    if (ref.spec.padding.bottom!=undefined){
    //        bottom=ref.spec.padding.bottom;
    //
    //    }
    //    if (ref.spec.padding.top!=undefined){
    //        top=ref.spec.padding.top;
    //
    //    }
    //    if (ref.spec.padding.right!=undefined){
    //        right=ref.spec.padding.right;
    //
    //    }
    //    w=newW-left-right;
    //    h=newH-top-bottom;
    //
    //}

    console.log(w, h);
    ref.chart.width(w).height(h).renderer('svg').update({props: 'enter'}).update();

}

function sortDataTable(dataTable, xAxis) {
    if (dataTable.metadata.types[xAxis] == 'U' || dataTable.metadata.types[xAxis] == 'T') {
        dataTable.data.sort(function (a, b) {

            return (new Date(a[xAxis])).getTime() - (new Date(b[xAxis])).getTime();
        })


    }
    else if (dataTable.metadata.types[xAxis] == 'C') {
        dataTable.data.sort(function (a, b) {

            return a[xAxis].localeCompare(b[xAxis])
        })

    } else {

        dataTable.data.sort(function (a, b) {

            return a[xAxis] - b[xAxis];
        })

    }

}

function getIndexOfMaxRange(dataTable, yAxis, aggregate, groupedBy) {

    var newDataTable = JSON.parse(JSON.stringify(dataTable));
    if (aggregate != undefined) {
        newDataTable.data = aggregatedTable(dataTable, groupedBy, aggregate)
    }


    var currentMaxIndex = -1;
    var currentMax = Number.NEGATIVE_INFINITY;
    for (i = 0; i < yAxis.length; i++) {

        var newMax = d3.max(parseColumnFrom2DArray(newDataTable.data, yAxis[i]));
        console.log(parseColumnFrom2DArray(newDataTable.data, yAxis[i]));
        if (currentMax <= newMax) {
            currentMaxIndex = i;
            currentMax = newMax;
        }
    }

    if (aggregate == undefined) {
        return "data." + createAttributeNames(dataTable.metadata.names[yAxis[currentMaxIndex]]);

    } else {
        if (aggregate == 'count')
            return "data." + aggregate;
        else
            return "data." + aggregate + "_" + createAttributeNames(dataTable.metadata.names[yAxis[currentMaxIndex]]);


    }

}

Chart.prototype.plot = function (dataset, callback) {
    this.dataTable.data = dataset;
    console.log(this.dataTable)
    sortDataTable(this.dataTable, this.config.xAxis);

    var table = setData(dataset, this.config, this.dataTable.metadata);
    if (this.config.yAxis != undefined && this.config.yAxis.constructor == Array) {
        //var scaleIndex=getIndexOfMaxRange(this.dataTable,this.config.yAxis)
        var name = getIndexOfMaxRange(this.dataTable, this.config.yAxis, this.config.aggregate, this.config.xAxis);
        console.log("myName", name);


        this.spec.scales[1].domain.field = name;
    }


    console.log(this.dataTable)

    var data = {table: table}

    if (this.config.update == undefined) {
        this.config.update = "slide";
    }
    var divId = this.canvas;
    this.data = data;
    this.table = table;

    console.log(data);
    var delay = {};

    if (this.legend) {
        legendsList = [];
        for (i = 0; i < dataset.length; i++) {
            a = dataset[i][this.legendIndex]
            isfound = false;
            for (j = 0; j < legendsList.length; j++) {
                if (a == legendsList[j]) {
                    isfound = true;
                    break;
                }
            }

            if (!isfound) {
                legendsList.push(a);
            }
        }

        delay = {"duration": 600}
        this.spec.legends[0].values = legendsList;
    }

    var specification = this.spec;
    var isTool = this.toolTip;
    var toolTipFunction = this.toolTipFunction
    var ref = this

    vg.parse.spec(specification, function (chart) {
        ref.chart = chart({
            el: divId,
            renderer: 'svg',
            data: data


        }).update();


        //viz_render = function() {
        //    ref.chart.width(window.innerWidth-viz_vega_spec.padding.left-viz_vega_spec.padding.right).height(window.innerHeight-viz_vega_spec.padding.top - viz_vega_spec.padding.bottom).renderer('svg').update({props:'enter'}).update();
        //}


        if (isTool) {

            tool = d3.select('body').append('div').style({
                'position': 'absolute',
                'opacity': 0,
                'padding': "4px",
                'border': "2px solid ",
                'background': 'white'
            });

            ref.chart.on('mouseover', toolTipFunction[0]);

            ref.chart.on('mouseout', toolTipFunction[1]);


        }

        if (callback)
            callback.call(ref);

        console.log("inside", ref);
    });

    console.log(this);


}

