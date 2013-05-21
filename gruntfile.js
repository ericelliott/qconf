module.exports = function (grunt) {

  grunt.initConfig({
    jshint: {
      // define the files to lint
      files: ['*.js', 'test/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
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
