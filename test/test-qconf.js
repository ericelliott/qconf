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

test('function parameters', function (t) {

  t.equal(config.get('param_setting'), 'yes',
    'should create new config settings.');

  t.equal(!!config.get('param_override'), true,
    'should override defaults.');

  t.end();
});

