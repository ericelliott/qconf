var qconf = require('../qconf.js'),
  test = require('tape'),
  config = qconf({param_override: true, param_setting: 'yes'});

test('basics', function(t) {

  t.equal(!!config.get('default_setting'), true,
    'should create settings from defaults file.');

  t.end();
});

test('environment variables', function (t) {
  t.equal(!!config.get('env_override'), true,
    'should override defaults.');

  t.end();
});

test('command line', function (t) {
  t.equal(config.get('command-line'), 'foo',
    'should use command-line settings.');

  t.equal(!!config.get('arg-override'), true,
    'should use override defaults.');

  t.end();
});

test('function parameters', function (t) {

  t.equal(config.get('param_setting'), 'yes',
    'should create new config settings.');

  t.equal(!!config.get('param_override'), true,
    'should override defaults.');

  t.end();
});

test('path override', function (t) {
  var value;
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    './test/path-override.json');

  t.ok(config.get('path_override'),
    'should read configuration from custom paths.');
  t.ok(config.get('param_override'),
    'should allow param overrides.');
  t.end();
});
