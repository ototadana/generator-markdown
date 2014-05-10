/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var fs = require('fs');
var helpers = require('yeoman-generator').test;
var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

describe('markdown generator', function () {
  beforeEach(function (done) {
    var dir = path.join(__dirname, 'temp');
    fs.exists(path.join(dir, 'node_modules'), function(exists) {
      if(exists) {
        process.chdir(dir);
        done();
      } else {
        helpers.testDirectory(dir, function (err) {
          if (err) {
            return done(err);
          }

          this.app = helpers.createGenerator('markdown:app', [
            '../../app'
          ]);

          helpers.mockPrompt(this.app, {'someOption': true});

          this.app.options['skip-install'] = true;
          var app = this.app;
          this.app.run({}, function () {
            app.installDependencies(function () {
              done();
            });
          });
        }.bind(this));
      }
    }.bind(this));
  });

  it('creates expected files', function (done) {
    helpers.assertFile([
      'src/css/index.css',
      'src/index.md',
      'src/template.html',
      'node_modules',
      'dist',
      'package.json',
      'Gruntfile.js',
      '.editorconfig'
    ]);
    done();
  });

  it('deletes *.css and *.html files at dist by "grunt clean:dist"', function (done) {
    fs.writeFileSync('dist/test0.txt', 'test0');
    fs.writeFileSync('dist/test1.css', 'test1');
    fs.writeFileSync('dist/test2.css', 'test2');
    fs.writeFileSync('dist/test3.html', 'test3');
    fs.writeFileSync('dist/test4.html', 'test4');
    mkdirp.sync('dist/css');
    fs.writeFileSync('dist/css/test5.css', 'test5');

    var files = [
      'dist/test1.css',
      'dist/test2.css',
      'dist/test3.html',
      'dist/test4.html',
      'dist/css/test5.css'
    ];

    helpers.assertFile(files);

    exec('grunt clean:dist', function(error, stdout, stderr) {
      console.log('<<<');
      console.log(stdout);
      console.log(stderr);
      console.log('>>>');
      helpers.assertNoFile(files);
      helpers.assertFile(['dist/test0.txt']);
      done(error);
    });
    
  });

  it('copies *.css files from src/ to dist/ by "grunt copy:dist"', function (done) {
    try {fs.unlinkSync('dist/test1.css');}catch(e){}
    fs.writeFileSync('src/test1.css', 'test1');
    fs.writeFileSync('src/test2.txt', 'test2');

    exec('grunt copy:dist', function(error, stdout, stderr) {
      console.log('<<<');
      console.log(stdout);
      console.log(stderr);
      console.log('>>>');
      helpers.assertFile(['dist/test1.css', 'dist/css/index.css']);
      helpers.assertNoFile(['dist/test2.txt']);
      fs.unlinkSync('src/test1.css');
      fs.unlinkSync('src/test2.txt');
      done(error);
    });
  });

  it('generates *.html files by "grunt markdown"', function (done) {
    try {fs.unlinkSync('dist/index.html');}catch(e){}
    try {fs.unlinkSync('dist/sub/test1.html');}catch(e){}
    mkdirp.sync('src/sub');
    fs.writeFileSync('src/sub/test1.md', 'test1');
    fs.writeFileSync('src/test2.txt', 'test2');

    exec('grunt markdown', function(error, stdout, stderr) {
      console.log('<<<');
      console.log(stdout);
      console.log(stderr);
      console.log('>>>');
      helpers.assertFile(['dist/index.html', 'dist/sub/test1.html']);
      helpers.assertNoFile(['dist/test2.html']);
      fs.unlinkSync('src/sub/test1.md');
      fs.unlinkSync('src/test2.txt');
      done(error);
    });
  });

  it('do "clean", "copy" and "markdown" tasks by "grunt build"', function (done) {
    try {fs.unlinkSync('dist/index.html');}catch(e){}
    try {fs.unlinkSync('dist/css/index.css');}catch(e){}
    fs.writeFileSync('dist/test1.html', 'test1');

    var files = ['dist/index.html', 'dist/css/index.css'];
    helpers.assertNoFile(files);
    helpers.assertFile(['dist/test1.html']);

    exec('grunt build', function(error, stdout, stderr) {
      console.log('<<<');
      console.log(stdout);
      console.log(stderr);
      console.log('>>>');
      helpers.assertFile(files);
      helpers.assertNoFile(['dist/test1.html']);
      done(error);
    });
  });

});
