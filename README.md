##Overview
Interactive Generic Visualization library(IGViz) is a wrapper around powerful d3.js library. It makes charting easy by adding required boilerplate code so that developers/designers can get started in few minutes.


##Getting Started
Download [d3.v3.js](http://d3js.org/ "d3js.org"). This is the only required library for IGViz.
Download the latest igviz.js (version 1.0 alpha). It is still in WIP state.
Don’t forget the igviz.css file!

##Data table
IGViz required you to arrange your source dataset in a tabular way similar to follwing JSON format.

`{
	"metadata":{
	  "names":["Column1","Column2",...],
	  "types":['C', 'N',]
	},
	"data": [
	  ["value1",numericValue1,...],
	  ["value2",numericValue2,...],
	]
}`

metadata.names is an array consists of column names/fields of the table where metadata.types records their types (categorical (C) or numerical (N)).
names and types are aligned together in a way that "Coulmn1" => 'C' and "Coulmn2" => 'N' and so on.

data section is a collection of arrays of data rows. Single row is stored as an array and their element order follows the order of metadata.names.

##Chart Config

Charts have some attributes in common while some are specific to certain chart types. Those attributes can be passed to IGViz using a JS object.

`var config = {
	"title" : "Chart Title",	
	"chartWidth" : 640,	
	"chartHeight" : 480,
	"chartType" : "bar"	
};`

##Chart Canvas

This is the div element where chart will be renedered on. IGviz accepts the id attribute of a div element formatted as "#divId"

##igviz.plot()

Drawring a chart means simply calling 

`igviz.plot("#canvas",config,dataTable)`

with parameters.
Please follow the sample application so that you'll get a better idea.

