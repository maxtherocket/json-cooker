/*
 * json-cooker
 * https://github.com/maxtherocket/json-cooker
 *
 * Copyright (c) 2013 Max Rusan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('cook', 'Cooking', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var re = /{{include:([^}]*)}}/ig;

    var getCookedFile = function(path, parent){
      parent = parent || '';
      // Check if file exists
      if (!grunt.file.exists(path)) {
        grunt.log.warn('File "' + path + '" not found.');
        return;
      }
      var fileContents = grunt.file.read(parent + path);
      var cookedContents = fileContents;
      // Find the path of the current dirrectory
      var parentDir = path.substring(0, Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\\\"))+1);
      console.log('parentDir: ', parentDir);
      // Match
      var match;
      while(match = re.exec(cookedContents)){
        var matchedPath = match[1];
        var cookedFile = getCookedFile(parentDir + matchedPath) || '';
        cookedContents = cookedContents.replace(match[0], cookedFile);
      }
      return cookedContents;
    };

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.

      if (!f.src.length) return;

      var srcPath = f.src[0];

      var src = getCookedFile(srcPath);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');

      // Write the destination file.
      grunt.file.write(f.dest, src);
    });

  });

};
