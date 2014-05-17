'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var assert = require('assert');
var setupWorkspace = require('../setup-workspace.js');

describe('grunt', function() {
  var text;

  beforeEach(function(done) {

    browser.assertText = function(selector, expected) {
      browser.getText(selector, function(err, text) {
        assert(err === null, 'err != null');
        assert(text === expected, text + ' != ' + expected);
      });
      return browser;
    };

    setupWorkspace('../../../app', function() {
      var grunt = exec('grunt');
      grunt.stdout.on('data', function(data) {
        process.stderr.write('[Grunt] '+ data);
      });
      grunt.stderr.on('data', function(data) {
        process.stderr.write('[Grunt] '+ data);
      });
      text = fs.readFileSync('src/index.md').toString();
      done();
    });
  });

  afterEach(function(done) {
    fs.writeFileSync('src/index.md', text);
    done();
  });

  it('generates and updates html files', function(done) {
    browser
      .pause(5000)
      .url('http://localhost:9999/')
      .assertText('h1', 'H1 header')
      .assertText('h2', 'H2 header')
      .assertText('h3', 'H3 header')
      .call(function(){
        fs.writeFileSync('src/index.md', text.replace('H1 header', 'h1 HEADER'));
      })
      .pause(5000)
      .assertText('h1', 'h1 HEADER')
      .end(done);
  });

});
