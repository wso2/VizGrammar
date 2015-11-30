var vizg = function(dataTable, config) {
	this.chart =  new window[config.type](dataTable, config);
};

vizg.prototype.draw = function(div) {
	this.chart.draw(div);
};

vizg.prototype.insert = function(data) {
	this.chart.insert(data);
};