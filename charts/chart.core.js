var vizg = function(dataTable, config) {

	dataTable = buildTable(dataTable); 

	if (config.charts.length == 1) {
		config.type = config.charts[0].type;
		config.y = config.charts[0].y;
		config.color = config.charts[0].color;

		this.chart =  new window[config.type]([dataTable], config);
	} else {
		
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