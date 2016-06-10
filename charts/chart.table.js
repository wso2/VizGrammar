
var table = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};
      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

      if (this.config.columnTitles == null) {
        this.config.columnTitles = this.config.columns;
      }

};

table.prototype.draw = function(div) {
  var table = d3.select(div).append("table")
                .attr( "class", "table table-bordered")
                .attr("id", this.config.title);

      // set up the table header
      table.append('thead').attr("align", "center")
          .append('tr') 
          .selectAll('th')
              .data(this.config.columnTitles)
          .enter()
              .append('th')
              .html(function (d) { return d });

      table.append('tbody').attr("id", "tableChart-"+this.config.title);
      this.setupData(this.data, this.config);

      table.selectAll("thead th")
      .html(function(column) {
          return column.charAt(0).toUpperCase() + column.substr(1);
      });
  
      
      };

table.prototype.insert = function(data) {
    this.setupData(data, this.config);
};


table.prototype.setupData = function (dataset, config) {
    var data = [];
    var allColumns = this.metadata.names;
    
    //Select specified columns from dataset
    for (var i = 0; i < dataset.length; i++) {
        var row = {};

        for (var x = 0; x < config.columns.length; x++) {
            row[config.columns[x]] = dataset[i][config.columns[x]];
        }
        data.push(row);
    }

   //Select Rows by x Axis
    var rows = d3.select('#tableChart-'+config.title)
        .selectAll('tr')
        .data(data, function(d) { return d[config.key]})

    var entertd = rows.enter()
        .append('tr')
            .selectAll('td')
               .data(function(row) {
                return config.columns.map(function(column) {
                    return {column: column, value: row[column]};
                });
            })
            .enter()
            .append('td')

    //Color cell background
    if (config.color != -1) {
            d3.select('#tableChart-'+config.title)
                  .selectAll('td')
                      .attr('bgcolor',
                        function(d) { 
                            var column = d.key  || d.column;

                                var color;
                                if (typeof config.colorScale == "string") {
                                  color = window["d3"]["scale"][config.colorScale]().range();
                                } else {
                                  color = config.colorScale;
                                }

                                var colorIndex;
                                for(var i = 0; i < allColumns.length; i += 1) {
                                if(allColumns[i] === column) {
                                    colorIndex = i;
                                }
                            }

                            if (typeof d.value == "string") {

                                      var colorDomain;

                               if (config.colorDomain == -1) {
                                colorDomain = [d3.min(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; }), 
                                              d3.max(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; })]

                               } else {
                                  colorDomain = config.colorDomain
                               }

                                var color;
                                if (typeof config.colorScale == "string") {
                                  color = window["d3"]["scale"][config.colorScale]().range();
                                } else {
                                  color = config.colorScale;
                                }

                                var colorScale = d3.scale.ordinal()
                                                .range(color)
                                                .domain(colorDomain);
                                return colorScale(d.value); 

                            } else if (config.color == "*" || column == allColumns[config.color]){

                                var colorScale = d3.scale.linear()
                                                .range(['#f2f2f2', color[colorIndex]])
                                                .domain([d3.min(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; }), 
                                                         d3.max(d3.select('#tableChart-'+config.title) .selectAll('tr') .data(), function(d) { return d[column]; })]
                                                        );
                                
                                return colorScale(d.value); 
                            }

            });
    }

                
              
    entertd.append('span')
    var td = rows.selectAll('td')
    .style({"padding": "0px 10px 0px 10px"})

        .data(function(d) { return d3.map(d).entries() })
        .attr('class', function (d) { return d.key })


    

    td.select('span')
        .html(function(d) {
            return d.value
        })
    //Remove data items when it hits maxLength 
    if (config.maxLength != -1 && d3.select('tbody').selectAll('tr').data().length > config.maxLength) {
          var allowedDataset = d3.select('tbody').selectAll('tr').data().slice(d3.select('tbody').selectAll('tr').data().length- config.maxLength, config.maxLength);
          d3.select('tbody').selectAll('tr').data(allowedDataset, 
            function(d) { 
              return(d); 
            })  
          .remove();
    }
}