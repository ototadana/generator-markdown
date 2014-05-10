'use strict';
var yeoman = require('yeoman-generator');

var MarkdownGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  app: function () {
    this.mkdir('dist');
    this.mkdir('src');
    this.mkdir('src/css');

    this.copy('_package.json', 'package.json');
    this.copy('_template.html', 'src/template.html');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.copy('_index.md', 'src/index.md');
    this.copy('_index.css', 'src/css/index.css');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
  }
});

module.exports = MarkdownGenerator;