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
                    'src/models/**/*.js',
                    'src/core/specGenerator.js',
                    'src/core/util.js',
                    'src/core/chart.js',
                    'src/core/dataTable.js',
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
                 //   'build/igviz.full.min.js': ['build/igviz.full.js'],
                    'build/igviz.min.js': ['build/igviz.js'],
                    'igviz.min.js': ['build/igviz.js']
                }
            },

        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['concat', 'uglify']);


}




