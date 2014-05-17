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
        src: ['test/*.js', 'test/e2e/*.js']
      }
    },
    env: {
      test: {
        XUNIT_FILE: 'testresults/xunit.xml'
      },
    },
    mochaTest: {
      options: {
        reporter: 'xunit-file',
        timeout: 0
      },
      test: {
        src: ['test/*.js']
      }
    }
  });

  grunt.registerTask('test', [
    'env:test',
    'mochaTest'
  ]);

  grunt.registerTask('default', [
    'jshint:all',
    'jshint:test',
    'test'
  ]);


  require('mkdirp').sync('testresults');
};
