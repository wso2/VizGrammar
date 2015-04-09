//Constructor for SPEC object



igviz.Spec = (function () {

    //spec is function object that will be returned as the constructor
    var spec = function (s) {
        this.spec = {
            width: 500,
            height: 500,
            padding: 0,
            data: [],
            legends: [],
            scales: [],
            axes: [],
            marks: []
        };
        if (s) igviz.extend(this.spec, s);
    };


    var prototype = spec.prototype;

    prototype.width = function (w) {
        this.spec.width = w;
        return this;
    };

    prototype.height = function (h) {
        this.spec.height = h;
        return this;
    };

    prototype.padding = function (p) {
        this.spec.padding = p;
        return this;
    };

    prototype.viewport = function (v) {
        this.spec.viewport = v;
        return this;
    };


    return spec;
})();


igviz.spec = function (specConfig) {
    return new igviz.Spec(specConfig);
};
