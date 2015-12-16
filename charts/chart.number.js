
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
  var divContent = "<p style='padding: 0px 0px 0px 20px;'>"+config.title+"</p>"
                  +"<p style='font-size:60;padding: 0px 0px 0px 20px;' id='"+contentId+"'>"
                  +this.data[data.length-1][this.metadata.names[this.config.x]]+"</p>";

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    document.getElementById(this.view).innerHTML = data[data.length-1][this.metadata.names[this.config.x]];
};



