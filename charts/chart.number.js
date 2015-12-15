
var number = function(dataTable, config) {
      this.metadata = dataTable[0].metadata;
      this.data = dataTable[0].values
      var marks =[];
      this.spec = {};

      config = checkConfig(config, this.metadata);
      this.config = config;
      dataTable[0].name= config.title;

};

number.prototype.draw = function(div) {
  div = div.replace("#","");
  var contentId = div+"Content";
  var divContent =    "<table align='center' width=100px><tr>" 
                      +"<td><p align='left'>"+config.title+"</p></td>"
                      +"<td align='center'><p  style='font-size:400%;' id='"+contentId+"'>"+this.data[data.length-1][this.metadata.names[this.config.x]]+"</p></td>";
                      +"</tr></table>" 

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    document.getElementById(this.view).innerHTML = data[data.length-1][this.metadata.names[this.config.x]];
};



