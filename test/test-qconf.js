'use strict';

var test = require('tape'),
  qconf = require('../qconf.js'),
  own = require('mout/object/forOwn'),
  config = qconf({param_override: true, param_setting: 'yes'});

test('basics', function(t) {

  t.equal(!!config.get('default_setting'), true,
    'should create settings from defaults file.');

  t.end();
});

test('basics', function(t) {
  var conf = qconf({
    deep:{
      val: true
    }
  });
  t.equal(!!conf.get('deep.val'), true,
    'Should support deep property lookup.');

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
  var conf = qconf({param_override: true, param_setting: 'yes'},
    'file://test/path-override.json');

  t.ok(conf.get('path_override'),
    'should read configuration from custom paths.');
  t.ok(conf.get('param_override'),
    'should allow param overrides.');
  t.end();
});

test('path override with array', function (t) {
  config = qconf({param_override: true, param_setting: 'yes'},
    ['file://test/path-override.json']);

  t.ok(config.get('path_override'),
    'should read configuration from custom paths from in passed array.');
  t.ok(config.get('param_override'),
    'should allow param overrides.');
  t.end();
});

test('multifile path override', function (t) {
  config = qconf({param_override: true, param_setting: 'yes'},
    ['file://test/path-override.json', 'file://config/config.json']);

  t.ok(config.get('default_setting'),
    'should read configuration from custom paths from in passed array.');
  t.equal(config.get('path_override'), false,
    'path_override should be false.');
  t.end();
});

test('yaml', function (t) {
  config = qconf({param_override: true, param_setting: 'yes'},
    'file://test/yaml-file.yml');

  t.ok(config.get('yaml_loaded'),
    'should read configuration from yaml file.');
  t.equal(config.get('path_override'), "oh, yes",
    'path_override should be set from yaml data');
  t.end();
});

test('file overrides', function (t) {
  config = qconf({param_override: true, param_setting: 'yes'},
    [
      'file://config/config.json',
      'file://test/path-override.json',
      'file://test/yaml-file.yml'
    ]);

  t.equal(config.get('path_override'), "oh, yes",
    'path_override should be set from yaml data');
  t.end();
});

test('emit on undefined', function (t) {
  var attr = 'not_defined';
  config = qconf();

  config.on('undefined', function (msg, attempted) {
    t.equal(attempted, attr,
      'should trigger "undefined" event when attr is undefined');

    t.equal('WARNING: Undefined environment variable: ' + attr, msg,
      'should emit undefined warning message.');
    t.end();
  });
  config.get(attr);
});

test('Dependencies callback', function (t) {
  var subject = {hello: 'world'},
    sentence = function (subject, cb) {
      var res = {
        sentence: 'goodbye, cruel ' + subject.hello
      };
      return cb(null, res);
    };

  // Callback = Return undefined.  
  qconf([{
      name: 'subject',
      source: subject
    },
    {
      name: 'sentence',
      source: sentence,
      dependencies: ['subject']
    }
  ], 
  function (err, conf) {
    t.error(err, 'Should not cause error.');
    t.equal(conf.get('sentence'), 'goodbye, cruel world',
      'Should load dependencies and call callback.');
    t.end();
  });
 
});
 
test('Dependencies promise', function (t) {
  var subject = {hello: 'world'},
    sentence = function (subject, cb) {
      var res = {
        sentence: 'goodbye, cruel ' + subject.hello
      };
      return cb(null, res);
    }, loadConfig;
 
  // No callback = return promise.
  loadConfig = qconf([{
      name: 'subject',
      source: subject
    },
    {
      name: 'sentence',
      source: sentence,
      dependencies: ['subject']
    }
  ]).then(function (conf) {
    t.equal(conf.get('sentence'), 'goodbye, cruel world',
      'should resolve promise with config.');
    t.end();  
  }, function (err) {
    t.error(err, 'Should not cause error.');
  });
});

test('Dependencies x3', function (t) {
  var subject = {hello: 'world'},
    sentence = function (subject, cb) {
      var res = {
        sentence: 'Goodbye, cruel ' + subject.hello
      };
      return cb(null, res);
    },
    para = function (subject, sentence, cb) {
      var res = {
        para: sentence.sentence + '. Hello again!'
      };
      return cb(null, res);
    };
 
  // No callback = return promise.
  qconf([{
      name: 'subject',
      source: subject
    },
    {
      name: 'sentence',
      source: sentence,
      dependencies: ['subject']
    },
    {
      name: 'para',
      source: para,
      dependencies: ['subject', 'sentence']
    }
  ]).then(function (conf) {
    t.equal(conf.get('para'),
      'Goodbye, cruel world. Hello again!',
      'Should handle multiple dependencies.');
    t.end();
  }, function (err) {
    t.error(err, 'Should not cause error.');
  });
});

test('Custom providers', function (t) {
  var configure = qconf.addProviders({
      custom: function (uri, cb) {
        return cb(null, {
          custom: 'foo'
        });
      }
    });

  configure([{
    name: 'custom',
    source: 'custom://' 
  }]).then(function (conf) {
    t.equal(conf.get('custom'), 'foo',
      'Should load data from custom provider.');
    t.end();
  });
});

test('refreshInterval', function (t) {
  var subject = {hello: 'world'},
    sentence = function (subject, cb) {
      var res = {
        sentence: 'goodbye, cruel ' + subject.hello
      };
      return cb(null, res);
    };

  // Callback = Return undefined.  
  qconf([{
      name: 'subject',
      source: subject,
      refreshInterval: 500
    },
    {
      name: 'sentence',
      source: sentence,
      dependencies: ['subject']
    }
  ], 
  function (err, conf) {
    t.error(err, 'Should not cause error.');
    t.equal(conf.get('sentence'), 'goodbye, cruel world',
      'Should load dependencies and call callback.');
    conf.on('refresh', function (changes) {
      t.pass('should emit refresh event.');
      t.ok(changes, 'Should pass changes');
      t.end();
    });
  });
 
});