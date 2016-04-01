
var stack = function(dataTable, config) {
      this.barChart = new bar(dataTable, config);
      this.metadata = this.barChart.metadata;

      var spec = this.barChart.getSpec();

      spec.axes = [spec.axes[0]];
      spec.axes[0].grid = false;

      spec.data.push(   
                {
                  "name": "selectedPoints",
                  "modify": [
                    {"type": "clear", "test": "!multi"},
                    {"type": "toggle", "signal": "clickedPoint", "field": "id"}
                  ]
                });

      spec.signals.push(    {
                    "name": "clickedPoint",
                    "init": 0,
                    "verbose": true,
                    "streams": [{"type": "click", "expr": "datum._id"}]
                  },
                  {
                    "name": "multi",
                    "init": false,
                    "verbose": true,
                    "streams": [{"type": "click", "expr": "datum._id"}]
                  });

      var textMark =  JSON.parse(JSON.stringify(spec.marks[0]));
      textMark.type = "text";
      textMark.properties.update.text = {"field" :spec.marks[0].properties.update.fill.field};
      textMark.properties.update.x.offset = 10;
      textMark.properties.update.y.offset = -5;
      textMark.properties.update.fill = {"value": config.legendTitleColor};
      delete textMark.properties.update.y2;
      delete textMark.properties.hover;
      spec.marks.push(textMark);

      delete spec.marks[0].properties.hover;
      spec.marks[0].properties.update.fill = [
            {
              "test": "indata('selectedPoints', datum._id, 'id')",
              "value": config.selectionColor
            },spec.marks[0].properties.update.fill
          ];

      this.barChart.setSpec(spec);

};

stack.prototype.draw = function(div, callbacks) {
       this.barChart.draw(div, callbacks); 
};

stack.prototype.insert = function(data) {
     this.barChart.insert(data); 
};

stack.prototype.getSpec = function() {
  return  this.barChart.getSpec();
};

