/**
 * Gruntfile
 *
 * If you created your Sails app with `sails new foo --linker`,
 * the following files will be automatically injected (in order)
 * into the EJS and HTML files in your `views` and `assets` folders.
 *
 * At the top part of this file, you'll find a few of the most commonly
 * configured options, but Sails' integration with Grunt is also fully
 * customizable.  If you'd like to work with your assets differently
 * you can change this file to do anything you like!
 *
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

var fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    browserify = require('browserify'),
    stringify = require('stringify'),
    _ = require( 'lodash' );

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-browserify');
  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks( 'node_modules/grunt-sass/tasks' );

  // -------------------------------------------------------------------
  // Tooling Configuration
  // -------------------------------------------------------------------
  var config = _.assign(

    { pkg: grunt.file.readJSON('package.json') },
    require( './tools/grunt/config/sass' ),
    require( './tools/grunt/config/browserify' ),
    require( './tools/grunt/config/cssmin' ),
    require( './tools/grunt/config/copy' ),
    require( './tools/grunt/config/clean' ),
    require( './tools/grunt/config/jsonlint' ),
    require( './tools/grunt/config/watch' )

  );

  grunt.initConfig( config );

  // When Sails is lifted:
  grunt.registerTask('default', [
    'clean:prod',
    // Check validity of JSON files.
    'jsonlint',
    // build js bundle
    'browserify:dev',
    // compile sass
    'sass',
    // copy over sourcemaps
    'copy:csssourcemaps',
    // compile the css
    'cssmin',
    // copy fonts
    'copy:font',
    // copy css-support images (images that css expects to be in the css directory)
    'copy:csssupport',
    // copy assets
    'copy:prod'
  ]);

  grunt.registerTask('build', [
    'clean:prod',
    // Check validity of JSON files.
    'jsonlint',
    // build js bundle
    'browserify',
    // compile sass
    'sass',
    // copy over sourcemaps
    'copy:csssourcemaps',
    // compile the css
    'cssmin',
    // copy fonts
    'copy:font',
    // copy css-support images (images that css expects to be in the css directory)
    'copy:csssupport',
    // copy assets
    'copy:prod'
  ]);

  // When sails is lifted in production
  // clean and only copy the production files
  grunt.registerTask('prod', [
    'clean:prod',
    // copy fonts
    'copy:font',
    // compile sass
    'sass',
    // copy over sourcemaps
    'copy:csssourcemaps',
    // copy css-support images (images that css expects to be in the css directory)
    'copy:csssupport',
    // copy assets
    'copy:prod'
  ]);

  grunt.registerTask('initTags', 'load tag data', function() {
    var done = this.async();
    var toolPath = "tools/tagtool";
    fs.readdir(toolPath, function (err, files) {
      if (err) {
          throw err;
      }
      files.map(function (file) {
          return path.join(toolPath, file);
      }).filter(function (file) {
          return fs.statSync(file).isFile() &&
                 path.extname(file) === ('.txt');
      }).forEach(function (file) {
          var cmd = 'node ' + toolPath + '/tagtool.js ' + path.basename(file, '.txt') + ' ' +  file;
          grunt.log.write('Adding tags from ' + file).ok();
          exec(cmd);
      });
      done();
    });
  });
};
