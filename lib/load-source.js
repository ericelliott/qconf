'use strict';

var parseUri = require('url').parse,
  q = require('q');

module.exports = function loadSource(source) {
  var args = [].slice.call(arguments),
    url, type,
    src,
    dfd = q.defer(),
    promise = dfd.promise,
    providers = this,

    cb = function cb(err, data) {
      if (err) {
        return dfd.reject(new Error('Error loading source ', source));
      }
      dfd.resolve(data);
      return promise;
    };

  args.push(cb);

  if (typeof source === 'object') {
    return source;
  }

  if (typeof source === 'function') {
    src = args.shift();
    return src.apply(null, args);
  }

  // Parse uri so we can decide which provider to use.
  url = parseUri(source);
  type = url.protocol.slice(0, url.protocol.length -1 );

  if (providers[type]) {
    return providers[type].apply(null, args, cb);
  }

  return dfd.promise;
};
