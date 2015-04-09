

/*************************************************** map ***************************************************************************************************/

igviz.drawMap = function (divId, chartConfig, dataTable) {
    //add this
    //Width and height
    var divId = divId.substr(1);
    var w = chartConfig.width;
    var h = chartConfig.height;

    var mode = chartConfig.mode;
    var regionO = chartConfig.region;


    //prepare the dataset (all plot methods should use { "data":dataLine, "config":chartConfig } format
    //so you can use util methods
    var dataset = dataTable.data.map(function (d, i) {
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
    }
    ;

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

