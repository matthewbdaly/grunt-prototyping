/*
 * grunt-prototyping
 * https://github.com/matthewdaly/grunt-prototyping
 *
 * Copyright (c) 2015 Matthew Daly
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('prototyping', 'A plugin for prototyping websites with Handlebars, Markdown and Bootstrap', function() {

    // Declare variables
    var parseUrl = require('url'),
      MarkedMetadata = require('meta-marked'),
      Handlebars = require('handlebars');
    

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    options.domain = parseUrl.parse(options.data.url).hostname;

    // Create a helper for joining arrays
    Handlebars.registerHelper('join', function (items) {
        return items.join(',');
    });

    // Create a helper for capitalizing the first letter of words
    Handlebars.registerHelper('capitalize', function (item, options) {
        // Break string into parts
        var reservedWords, word, words = item.split(' ');

        // Define reserved words
        reservedWords = [
            'a',
            'and',
            'in',
            'from',
            'to',
            'the',
            'for',
            'on',
            'of'
        ];

        // If is not one of the reserved words
        for (word in words) {
            // Skip the first word
            if (word === 0) {
                continue;
            }

            // Search for word in reservedWords
            if (reservedWords.indexOf(words[word]) === -1) {
                // Is word already capitalized?
                if (words[word].toUpperCase() !== words[word]) {
                    words[word] = words[word].charAt(0).toUpperCase() + words[word].slice(1).toLowerCase();
                }
            }
        }

        return words.join(' ');
    });

    // Set options
    var mdoptions = {
      gfm: true,
      tables: true,
      smartLists: true,
      smartypants: true
    };
    MarkedMetadata.setOptions(mdoptions);

    // Register partials
    Handlebars.registerPartial({
        header: grunt.file.read(options.template.header),
        footer: grunt.file.read(options.template.footer),
        sidebar: grunt.file.read(options.template.sidebar)
    });

    // Get matching files
    var pages = grunt.file.expand(options.src.pages + '*.md', options.src.pages + '*.markdown');

    // Get Handlebars templates
    var pageTemplate = Handlebars.compile(grunt.file.read(options.template.page));
    var notFoundTemplate = Handlebars.compile(grunt.file.read(options.template.notfound));

    // Generate pages and add them to the index
    var file;
    pages.forEach(function (file) {
        // Convert it to Markdown
        var content = grunt.file.read(file);
        var md = new MarkedMetadata(content);
        var mdcontent = md.html;
        var meta = md.meta;

        // Set permalink
        var permalink;
        if (file.indexOf('index.md') > -1 || file.indexOf('index.markdown') > -1) {
          permalink = '/';
        } else {
          permalink = '/' + (file.replace(options.src.pages, '').replace('.markdown', '').replace('.md', ''));
        }
        var path = options.www.dest + permalink;

        // Render the Handlebars template with the content
        var data = {
            year: options.year,
            data: options.data,
            domain: options.domain,
            canonical: options.data.url + permalink + '/',
            path: path,
            meta: {
                title: meta.title.replace(/"/g, ''),
                date: meta.date
            },
            post: {
                content: mdcontent,
                rawcontent: content
            }
        };
        var output = pageTemplate(data);

        // Write page to destination
        if (permalink !== '/') {
          grunt.file.mkdir(path);
        }
        grunt.file.write(path + '/index.html', output);
    });
  });

};
