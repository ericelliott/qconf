var qconf = require('../qconf.js'),
    test = require('tape');

/**
 * If a function is passed as the only parameter, qconf
 * loads sources asyncronously.
**/
test('async support - only callback', function (t) {
  qconf.clear();
  qconf(function(err, config){
    t.error(err, 'should not cause error');
    t.ok(config, 'should return config singleton');
    t.end();
  });
});

/**
 * If a function is passed as the last parameter, qconf
 * loads sources asyncronously.
**/
test('async support - with default file override', function (t) {
  qconf.clear();
  qconf("config/config.json", function(err, config){
    t.error(err, 'should not cause error');
    t.ok(config, 'should return config singleton');
    t.end();
  });
});

/**
 * If a function is passed as the last parameter, qconf
 * loads sources asyncronously.
**/
test('async support - with filelist and override', function (t) {
  qconf.clear();
  qconf({hello: 'world'},["config/config.json"], function(err, config){
    t.error(err, 'should not cause error');
    t.ok(config, 'should return config singleton');
    t.end();
  });
});

/**
 * Add support for HTTP(S) configuration sources
 * Keep it simple at first:
 *   GET requests only
 *   JSON responses only
 * Forces the requirment of a callback, therefore forcing qconf initialization to asyncronous.
**/
test('http', function (t) {
  qconf.clear();
  qconf('http://www.getyourjsonconfighere.com', function(err, config){
    t.error(err, 'should not cause error');
    t.ok(config, 'should return config singleton');
    t.end();
  });
});

/**
 * Add support for HTTP(S) configuration sources
 * Error thrown in the case of not passing qconf a callback function
 * when asking for an http(s) source
**/
test('http - no callback', function (t) {
  qconf.clear();
  t.throws(qconf('http://www.getyourjsonconfighere.com'), 'Some message', 'should throw an error due to missing callback');
});

/**
 * Add support for refresh.
 *
 * Under the covers its basically the same as a clear and recreate with same variables.
 * Takes refresh rate in ms (if not passes, it will refresh once and stop)
 * Returns config object (chaining purposes)
 *
 * Update clear to stop refresh.
**/
test('refresh', function (t) {
  qconf.clear();
  var override = {hello: 'world'},
      config = qconf(override);
  override.hello = 'foo';
  config.refresh();
  t.equals(config.get('hello'), 'foo', 'should equal value in overrides');
  t.end();
});
