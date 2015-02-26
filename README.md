##Overview
Interactive Generic Visualization library(IGViz) is a wrapper around powerful d3.js library. It makes charting easy by adding required boilerplate code so that developers/designers can get started in few minutes.

A gadget can be drawn in a given location by simply calling 
```javascript
igviz.plot(canvas,config,dataTable);
```
where 

- canvas is the div element which contains the gadget, 
- config is the additional gadget configurations specified as a JSON object
- dataTable is the JSON object that holds the dataset in a tabular format


##Getting Started
Download [d3.v3.js](http://d3js.org/ "d3js.org"). This is the only required library for IGViz.
Download the latest igviz.js (version 1.0 alpha). It is still in WIP state.
Don’t forget the igviz.css file!

##Data table
IGViz required you to arrange your source dataset in a tabular way similar to follwing JSON format.
```javascript
{
	"metadata":{
	  "names":["Column1","Column2",...],
	  "types":['C', 'N',]
	},
	"data": [
	  ["value1",numericValue1,...],
	  ["value2",numericValue2,...],
	]
}
```

Sample data table would be like following:
```javascript
var dataTable = {
    "metadata" : {
        "names" : ["Year","Sales","Expenses"],
        "types" : ["C","N","N"]
    },
    "data" : [
        [2004,  1000,      400],
        [2005,  1170,      460],
        [2006,  660,       1120],
        [2007,  1030,      540]
    ]
};
```


metadata.names is an array consists of column names/fields of the table where metadata.types records their types (categorical (C) or numerical (N)).
names and types are aligned together in a way that "Coulmn1" => 'C' and "Coulmn2" => 'N' and so on.

data section is a collection of arrays of data rows. Single row is stored as an array and their element order follows the order of metadata.names.

igviz.DataTable exposes several convenient API methods to populate the above data structure programmatically. Decison is up to the user to select between handcoding the dataset vs populating it using API. However the endresult will be same.
```javascript
var dataTable = new igviz.DataTable();
dataTable.addColumn("Year","C");
dataTable.addColumn("Sales","N");
dataTable.addColumn("Expenses","N");

dataTable.addRow([2004,  1000,      400]);
         
dataTable.addRows(
     [
         [2005,  1170,      460],
         [2006,  660,       1120],
         [2007,  1030,      540]

     ]
 );
```


##Chart Config

Once the data structure is ready, igviz will try to draw a table out of it.

Users can add additional parameters to the gadget using config object. It is a JSON object that has well known configuration properties. For example, default table implementation can be changed to a bar chart by setting chartType property in the config object.

E.g Following is the bare minimum set of configurations require to draw a bar chart from above tabular data format.
```javascript
var config = {
            "xAxis": 0,	//Column 0 will be selected as X axis data (That means Year)
            "yAxis": 1, //Column 1 will be selected as Y axis data (That means Sales)
            "padding": 60,
            "width": 480,
            "height": 360,
            "chartType": "bar"
}
```

##Chart Canvas

This is the div element where chart will be renedered on. IGviz accepts the id attribute of a div element formatted as "#divId"

##igviz.plot()

Drawring a chart means simply calling 
```javascript
igviz.plot("#canvas",config,dataTable)
```
with parameters. IGviz currently supports six chart types including table, bar,line, scatter and map. Single number chart and an area chart is still in development. Drill down capabilities will be added to bar chart later.

Visit [IGViz Samples Web Site](http://dunithd.github.io/igviz-site/samples/index.html) to see sample chart types and their documentation. Please note that the documentation is still in progress :)

You can also follow the samples folder so that you'll get a better idea.

Happy Coding!
- IGViz Team

