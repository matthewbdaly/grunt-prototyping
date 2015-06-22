/*
 * grunt-prototyping
 * https://github.com/matthewdaly/grunt-prototyping
 *
 * Copyright (c) 2015 Matthew Daly
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    prototyping: {
      default: {
        options: {
          data: {
            author: "My Name",
            url: "http://www.example.com",
            email: "user@example.com",
            googleanalytics: "UA-XXXXX-X",
            title: 'My new site',
            description: 'A website',
            keywords: [
              'my',
              'blog'
            ]
          },
          template: {
            page: 'templates/page.hbs',
            header: 'templates/partials/header.hbs',
            footer: 'templates/partials/footer.hbs',
            sidebar: 'templates/partials/sidebar.hbs',
            notfound: 'templates/404.hbs',
            robots: 'templates/robots.txt'
          },
          src: {
            pages: 'content/'
          },
          www: {
            dest: 'build'
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'prototyping', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
