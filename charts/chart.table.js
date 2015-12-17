
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
      table.append('thead').attr("align", "center")
          .append('tr')
          .selectAll('th')
              .data(this.metadata.names)
          .enter()
              .append('th')
              .text(function (d) { return d })


      table.append('tbody');
      setupData(this.data, this.metadata.names[this.config["x"]]);

      table.selectAll("thead th")
      .text(function(column) {
          return column.charAt(0).toUpperCase() + column.substr(1);
      });
  
      
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
              
    entertd.append('span')
    var td = rows.selectAll('td')
    .style({"padding": "0px 10px 0px 10px"})
        .data(function(d) { return d3.map(d).entries() })
        .attr('class', function (d) { return d.key })
    

    td.select('span')
        .text(function(d) {
            return d.value
        })

    //Remove data items when it hits maxLength 
    if (this.config.maxLength != -1 && d3.select('tbody').selectAll('tr').data().length > this.config.maxLength) {
          var allowedDataset = d3.select('tbody').selectAll('tr').data().slice(d3.select('tbody').selectAll('tr').data().length- this.config.maxLength,this.config.maxLength);
          d3.select('tbody').selectAll('tr').data(allowedDataset, 
            function(d) { 
              return(d); 
            })  
          .remove();
    }
}