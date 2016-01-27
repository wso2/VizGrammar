##Overview
VizGrammar is a wrapper around powerful d3.js and vega.js library. It makes charting easy by adding required boilerplate code so that developers/designers can get started in few minutes.

A gadget can be drawn in a given location by simply calling 
```javascript
igviz.plot(canvas,config,dataTable);
```
where 

- canvas is the div element which contains the gadget, 
- config is the additional gadget configurations specified as a JSON object
- dataTable is the JSON object that holds the dataset in a tabular format

## Build Process

To manually build VizGrammar, you need to have [npm](https://www.npmjs.com/) and [grunt](http://gruntjs.com/) installed.

1. Run `npm install` in the VizGrammar directory to install dependencies.
2. Run `grunt`, this will combine JS files and do the minification.

##Getting Started
Download [d3.js](http://d3js.org/ "d3js.org") and [vega.js](http://vega.github.io/ "vega.github.io").
Download the latest vizg.js.

##Documentation
[VizGrammar Documentation](https://github.com/wso2/VizGrammar/wiki)

##Data table
VizGrammar required you to arrange your source dataset in a tabular way similar to follwing JSON format.
```javascript
{
	"metadata":{
	  "names":["Column1","Column2",...],
	  "types":['ordinal', 'linear',]
	},
	"data": [
	  ["value1",numericValue1,...],
	  ["value2",numericValue2,...],
	]
}
```

Sample data table would be like following:
```javascript
    var data =  [
      { 
        "metadata" : {
            "names" : ["rpm","torque","horsepower", "EngineType"],
            "types" : ["linear","linear", "ordinal","ordinal"]
        },
        "data": [
          [8000, 75, 120, "Piston"], [9000, 81, 130, "Rotary"]]
      }
    ];
```


metadata.names is an array consists of column names/fields of the table where metadata.types records their types (ordinal (C) or linear).
names and types are aligned together in a way that "Coulmn1" => 'ordinal' and "Coulmn2" => 'linear' and so on.

data section is a collection of arrays of data rows. Single row is stored as an array and their element order follows the order of metadata.names.


##Chart Config

Once the data structure is ready, igviz will try to draw a table out of it.

Users can add additional parameters to the gadget using config object. It is a JSON object that has well known configuration properties. For example, default table implementation can be changed to a bar chart by setting chartType property in the config object.

E.g Following is the bare minimum set of configurations require to draw a bar chart from above tabular data format.
```javascript
var config = {
                  x : "rpm",
                  charts : [{type: "line",  y : "torque", color: "EngineType"}],
                  maxLength: 10,
                  width: 400,
                  height: 200
                }
```

##Chart Canvas

This is the div element where chart will be renedered on. VizGrammar accepts the id attribute of a div element formatted as "#chartDiv"
```javascript
        var chart = new vizg(data, configSingle);
        chart.draw("#chartDiv");
```

##Plot Chart

Drawring a chart means simply calling 
```javascript
        chart.insert([[8000, 74, 120, "Rotary"]]);
```
with parameters. VizGrammar currently supports six chart types including table, bar,line, scatter and map. Single number chart and an area chart is still in development. Drill down capabilities will be added to bar chart later.

Visit [VizGrammar Samples Web Site](http://dunithd.github.io/igviz-site/samples/index.html) to see sample chart types and their documentation. Please note that the documentation is still in progress :)

You can also follow the samples folder so that you'll get a better idea.


