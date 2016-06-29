
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
      textContent = this.data[this.data.length - 1][this.metadata.names[this.config.x]];    
  }

  var divContent = "<p class='title" + contentId + "'>" + this.config.title+ "</p>"
                  + "<p class='val" + contentId + "' id='val"+ contentId+"'>" + textContent + "</p>"
                 + "<p class='diff" + contentId + "' id='diff"+ contentId+"'>0</p>"
                 + "<p class='diffPercentage" + contentId + "' id='diffPercentage"+ contentId+"'>0%</p>";

   document.getElementById(div).innerHTML = divContent;
   this.view = contentId;
};

number.prototype.insert = function(data) {
    var current = data[data.length-1][this.metadata.names[this.config.x]];
    var previous  = document.getElementById("val" + this.view).innerHTML;
    var difference =  previous - current;
    var diffPercentage;

    if (previous != "" && previous != 0) {
      diffPercentage = (difference / previous).toFixed(2) + "%";
    } else {
      diffPercentage = "";
    }

    document.getElementById("diffPercentage" + this.view).innerHTML = diffPercentage;
    document.getElementById("diff" + this.view).innerHTML = difference;
    document.getElementById("val" + this.view).innerHTML = current;

};



