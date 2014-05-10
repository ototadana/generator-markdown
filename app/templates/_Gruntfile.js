'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      options: {
        port: 9999,
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: 'dist'
        }
      }
    },
    watch: {
      update: {
        files: ['src/**/*.css', 'src/**/*.md', 'src/template.html'],
        tasks: ['newer:copy:dist', 'newer:markdown']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: ['dist/**/*.html', 'dist/css/index.css'],
      }
    },

    clean: {
      dist:  ['dist/**/*.css', 'dist/**/*.html']
    },
    copy: {
      dist: {
        expand: true,
        cwd: 'src/',
        src: '**/*.css',
        dest: 'dist/'
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            cwd: 'src/',
            src: '**/*.md',
            dest: 'dist/',
            ext: '.html'
          }
        ],
        options: {
          template: 'src/template.html',
          markdownOptions: {
            gfm: true,
            highlight: 'manual'
          },
          postCompile : function(html, templateContext) {
            var $ = require('cheerio').load(html);
            templateContext.rooturl = '.';
            templateContext.title = $('h1').first().text() || $('h2').first().text() || $('h3').first().text();
            return html;
          }
        }
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist', 
    'copy:dist', 
    'markdown'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect:livereload',
    'watch'
  ]);
};
