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
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    './test/path-override.json');

  t.ok(config.get('path_override'),
    'should read configuration from custom paths.');
  t.ok(config.get('param_override'),
    'should allow param overrides.');
  t.end();
});

test('path override with array', function (t) {
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    ['./test/path-override.json']);

  t.ok(config.get('path_override'),
    'should read configuration from custom paths from in passed array.');
  t.ok(config.get('param_override'),
    'should allow param overrides.');
  t.end();
});

test('multifile path override', function (t) {
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    ['./test/path-override.json', './config/config.json']);

  t.ok(config.get('default_setting'),
    'should read configuration from custom paths from in passed array.');
  t.equal(config.get('path_override'), false,
    'path_override should be false.');
  t.end();
});

test('yaml', function (t) {
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    './test/yaml-file.yml');

  t.ok(config.get('yaml_loaded'),
    'should read configuration from yaml file.');
  t.equal(config.get('path_override'), "oh, yes",
    'path_override should be set from yaml data');
  t.end();
});

test('file overrides', function (t) {
  qconf.clear();
  config = qconf({param_override: true, param_setting: 'yes'},
    [
      './config/config.json',
      './test/path-override.json',
      './test/yaml-file.yml'
    ]);

  t.equal(config.get('path_override'), "oh, yes",
    'path_override should be set from yaml data');
  t.end();
});

test('emit on undefined', function (t) {
  var attr = 'not_defined';
  qconf.clear();
  config = qconf();

  config.on('undefined', function (msg, attempted) {
    t.equal(attempted, attr,
      'should trigger "undefined" event when attr is undefined');

    t.equal('WARNING: Undefined environment variable: ' + attr, msg,
      'should emit appropriate message.');
    t.end();
  });
  config.get(attr);
});
