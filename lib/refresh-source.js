'use strict';

var loadSource = require('./load-source.js'),

  getDependencies = function getDependencies(source, loaded) {
    var sources,
    dependencies = source.dependencies || [];

    dependencies.forEach(function (dep) {
      sources.push(loaded[dep]);
    });

    return sources;
  };


module.exports = function refreshSource(providers, source, sourceList,
    loaded, config) {

  var dependencies = getDependencies(source, loaded),

    args = dependencies ? [source].concat(dependencies) :
      [source],
    response,

    responseHandler = function responseHandler(data) {
      var sources = sourceList.map(function (loadedSrc) {
        var name = loadedSrc.name;
        if (name === source) {
          return data;
        }
        return loaded[name];
      });
      config.refresh(sources);
    };

  response = loadSource.apply(providers, args);
  if (response && response.then) {
    response.then(responseHandler);
  } else {
    responseHandler(response);
  }
};
