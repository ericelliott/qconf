'use strict';

var yamlParser = require('js-yaml'),
    fs = require('fs'),
    path = require('path'),
    parseJSON = JSON.parse,
    parseYAML = yamlParser.safeLoad,
    commandMap = {
      'json': parseJSON,
      'yml' : parseYAML
    };

module.exports = {
  file: function loadFile(file){
    var ext = file.split('.').pop(),
        parser = commandMap[ext];
    if (!parser) {
      throw new Error ('Extension \'' + ext + '\' not supported');
    }
    var resolvedPath = path.resolve(process.cwd(), file),
        data = fs.readFileSync(resolvedPath, 'utf-8');
    return parser(data);
  }
};
