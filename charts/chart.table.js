
var table = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};
      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

table.prototype.draw = function(div) {
  var table = d3.select(div).append("table").attr( "border", "2px");

      // set up the table header
      table.append('thead')
          .append('tr')
          .selectAll('th')
              .data(this.metadata.names)
          .enter()
              .append('th')
              .text(function (d) { return d })

      table.append('tbody');
      setupData(this.data, this.metadata.names[this.config["x"]]);
      };

table.prototype.insert = function(data) {
    setupData(data, this.metadata.names[this.config["x"]]);
};


function setupData(data, xAxis) {
   //Select Rows by x Axis
    var rows = d3.select('tbody')
        .selectAll('tr')
        .data(data, function(d) { return d[xAxis]})

    var entertd = rows.enter()
        .append('tr')
            .selectAll('td')
                .data(function(d) { return d3.map(d).values() })
            .enter()
                .append('td')
                .attr("width", "100px")
    
    entertd.append('div')
    entertd.append('span')
    var td = rows.selectAll('td')
        .data(function(d) { return d3.map(d).entries() })
        .attr('class', function (d) { return d.key })
    

    td.select('span')
        .text(function(d) {
            return d.value
        })
}