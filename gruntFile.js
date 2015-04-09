var version = '1.7.1';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*********IGVIZ.js******************************/'
            },
            dist: {
                src: ['src/copyRights.txt',

                    'src/core/_start.js',
                    'src/core/init.js',


                    'src/series/series.js',

                    'src/line/line.js',
                    'src/line/aggregatedLine.js',

                    'src/bar/bar.js',
                    'src/bar/aggregatedBar.js',
                    'src/bar/groupedBar.js',
                    'src/bar/stackedBar.js',
                    'src/bar/drillDown.js',

                    'src/area/area.js',
                    'src/area/aggregatedArea.js',
                    'src/area/aggregatedMultiArea.js',
                    'src/area/multiArea.js',
                    'src/area/stackedArea.js',

                    'src/diagram/arc.js',

                    'src/scatter/scatter.js',

                    'src/singleNumber/single.js',

                    'src/table/table.js',

                    'src/map/map.js',

                    'src/core/specGenerator.js',


                    'src/core/util.js',
                    'src/core/chart.js',
                    'src/core/dataTable.js',


                    //
                    //'src/core/spec.js',
                    //'src/core/axis.js',
                    //'src/core/scale.js',

                    'src/core/_end.js'],
                dest: 'build/igviz.js'
            }
        },
        uglify: {
            options: {
                banner: "/***igviz.js***/"
            },

            js: {
                files: {
                    'build/igviz.min.js': ['build/igviz.js'],
                    'igviz.min.js': ['build/igviz.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat', 'uglify']);


}




