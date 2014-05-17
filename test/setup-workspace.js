'use strict';

var path = require('path');
var fs = require('fs');
var helpers = require('yeoman-generator').test;

module.exports = function(appdir, done) {
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

        var app = helpers.createGenerator('markdown:app', [appdir]);
        helpers.mockPrompt(app, {'someOption': true});
        app.options['skip-install'] = true;
        app.run({}, function () {
          app.installDependencies(function () {
            done();
          });
        });
      });
    }
  });
};
