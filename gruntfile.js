'use strict';

module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      all: ['./*.js', './lib/**/*.js',
        './test/**/*.js', './providers/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        nonew: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        node: true,
        strict: true,
        boss: false
      }
    },

    lexicon: {
      all: {
        src: ["./qconf.js"],
        dest: "doc",
        options: {
          title: "Qconf API",
          format: "markdown"
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  // grunt.loadNpmTasks('grunt-lexicon');

  grunt.registerTask('default', ['jshint']);
};
