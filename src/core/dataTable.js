

/*************************************************** Data Table Generation class ***************************************************************************************************/


    //DataTable that holds data in a tabular format
    //E.g var dataTable = new igviz.DataTable();
    //dataTable.addColumn("OrderId","C");
    //dataTable.addColumn("Amount","N");
    //dataTable.addRow(["12SS",1234.56]);
igviz.DataTable = function () {
    this.metadata = {};
    this.metadata.names = [];
    this.metadata.types = [];
    this.data = [];
};

igviz.DataTable.prototype.addColumn = function (name, type) {
    this.metadata.names.push(name);
    this.metadata.types.push(type);
};

igviz.DataTable.prototype.addRow = function (row) {
    this.data.push(row);
};

igviz.DataTable.prototype.addRows = function (rows) {
    for (var i = 0; i < rows.length; i++) {
        this.data.push(rows[i]);
    }

};

igviz.DataTable.prototype.getColumnNames = function () {
    return this.metadata.names;
};

igviz.DataTable.prototype.getColumnByName = function (name) {
    var column = {};
    for (var i = 0; i < this.metadata.names.length; i++) {
        //TODO Need to check for case sensitiveness
        if (this.metadata.names[i] == name) {
            column.name = this.metadata.names[i];
            column.type = this.metadata.types[i];
            return column;
        }
    }
    ;
};

igviz.DataTable.prototype.getColumnByIndex = function (index) {
    var column = this.metadata.names[index];
    if (column) {
        column.name = column;
        column.type = this.metadata.types[index];
        return column;
    }

};

igviz.DataTable.prototype.getColumnData = function (columnIndex) {
    var data = [];
    this.data.map(function (d) {
        data.push(d[columnIndex]);
    });
    return data;
};

igviz.DataTable.prototype.toJSON = function () {
    console.log(this);
};

