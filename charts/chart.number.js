
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
  var textContent = "";

  if (this.data != null && this.data.length != 0) {
      textContent = this.data[this.data.length-1][this.metadata.names[this.config.x]];    
  }

  var divContent = "<p style='padding: 0px 0px 0px 20px;'>"+this.config.title+"</p><br/>"
                  +"<p style='font-size:60;padding: 0px 0px 0px 20px;' id='"+contentId+"'>"
                  +textContent+"</p>";

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    document.getElementById(this.view).innerHTML = data[data.length-1][this.metadata.names[this.config.x]];
};



