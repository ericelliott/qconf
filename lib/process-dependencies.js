/**
 * This module declares dependencies using promises. It goes through
 * each source in the dependency list, and creates a list of
 * dependencies for each. When all of the dependencies for a source
 * are resolved, it resolves the source that declared the dependencies,
 * which triggers a call to that source function, passing in the
 * resolved dependency data as parameters.
 *
 * Finally, when that function has resolved (either by returning the
 * source data, or resolving a returned promise), that source is
 * also resolved.
 */
'use strict';
var q = require('q'),
  loadSource = require('./load-source.js'),
  handleResponse,
  resolve;

resolve = function resolve(loaded, name, val, dfd) {
  loaded[name] = val;
  dfd.resolve(val);
};

handleResponse = function handleResponse(loaded,
    name, response, dfd) {
  // If response is a promise...
  if (typeof response.then === 'function') {
    return response.then(function (val) {
      resolve(loaded, name, val, dfd);
    });
  }

  // If response is a value...
  resolve(loaded, name, response, dfd);
};

module.exports = function processDependencies(dependencyList) {
  var dfd = q.defer(),
    loading = {},
    loaded = {},
    listLoaded;

  listLoaded = dependencyList.map(function (source) {
    var dependencyNames = source.dependencies || [],
      dependencyPromises,
      dependencyDfd = q.defer(),
      response,
      src = source.source,
      name = source.name;

    
    // Process dependencies...
    loading[source.name] = dependencyDfd.promise;

    if (dependencyNames.length) {
      dependencyPromises = dependencyNames.map(function (name) {
        // Add promises

        if (!loading[name]) {

          dependencyDfd.reject(
            new Error('Undefined dependency: ' + name));
        }

        return loading[name];
      });

      q.all(dependencyPromises).then(function depFinished(depArgs) {
        // All dependencies have loaded for source.name

        depArgs.unshift(source.source);

        // Load the source.
        response = loadSource.apply(null, depArgs);

        // Handle the load response:
        handleResponse(loaded, name, response, dependencyDfd);
      }, function dependencyError(err) {
        dfd.reject(new Error('Problem loading dependencies: ', err ));
      });
    } else {
      // No dependencies for source. Go ahead and load it.
      response = loadSource.call(null, src);
      handleResponse(loaded, name, response, dependencyDfd);
    }
    return dependencyDfd.promise;
  });

  q.all(listLoaded).then(function () {
    // Everything is loaded now. Resolve with all the source
    // data.

    var sources = dependencyList.map(function (loadedSrc) {
      var name = loadedSrc.name;
      return loaded[name];
    });

    dfd.resolve(sources);
  });

  return dfd.promise;
};
