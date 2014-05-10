'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'app/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/*.js']
      }
    },
    mochaTest: {
      options: {
        timeout:0
      },
      test: {
        src: ['test/*.js']
      }
    }
  });

  grunt.registerTask('default', [
    'jshint:all',
    'jshint:test',
    'mochaTest'
  ]);
};
