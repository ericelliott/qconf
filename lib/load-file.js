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
  file: function loadFile(url, cb){
    var file = url.split('//')[1],
      ext = file.split('.').pop(),    
      parser = commandMap[ext],
      resolvedPath, data, parsed;

    if (!parser) {
      cb( new Error ('Extension \'' + ext + '\' not supported') );
    }

    resolvedPath = path.resolve(process.cwd(), file),
    data = fs.readFileSync(resolvedPath, 'utf-8');

    try {
      parsed = parser(data);
    } catch(err) {
      cb(err);
    }

    return parsed;
  }
};
