'use strict';

var yamlParser = require('js-yaml'),
    fs = require('fs'),
    path = require('path'),
    loadJSON = function loadJSON(data){
      return JSON.parse(data);
    },
    loadYAML = function loadYAML(data){
      return yamlParser.safeLoad(data);
    },
    commandMap = {
      'json': loadJSON,
      'yml' : loadYAML
    };

module.exports = function loadSource(file){
  var ext = file.split('.').pop(),
      parser = commandMap[ext];
  if (! parser) {
    throw new Error ('Extension \'' + ext + '\' not supported');
  }
  var resolvedPath = path.resolve(process.cwd(), file),
      data = fs.readFileSync(resolvedPath, 'utf-8');
  return parser(data);
};
