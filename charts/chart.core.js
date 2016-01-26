var vizg = function(dataTable, config) {
	dataTable = buildTable(dataTable); 
	if (typeof config.charts !== "undefined" && config.charts.length == 1) {
		//Set chart config properties for main
		for (var property in config.charts[0]) {
		    if (config.charts[0].hasOwnProperty(property)) {
		        config[property] = config.charts[0][property];
		    }
		}

		this.chart =  new window[config.type]([dataTable], config);
	}
};

vizg.prototype.draw = function(div) {
	this.chart.draw(div);
};

vizg.prototype.insert = function(data) {
	this.chart.insert(buildData(data, this.chart.metadata));
};

vizg.prototype.getSpec = function() {
	return this.chart.getSpec();
};