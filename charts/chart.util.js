function checkConfig(config, metadata){

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
	} else {
		config.color = metadata.names.indexOf(config.color);
	}

	if (config.maxLength == null) {
		config.maxLength = -1;
	}

	if (config.padding == null) {
		config.padding = {"top": 30, "left": 50, "bottom": 100, "right": 100};
	}

	config.x = metadata.names.indexOf(config.x);
    config.y = metadata.names.indexOf(config.y);

    return config;
}

function buildTable(datatable) {
	var chartDatatable = {}
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



