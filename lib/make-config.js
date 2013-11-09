'use strict';
var stampit = require('stampit'),
  EventEmitter = require('events').EventEmitter,
  events = stampit.convertConstructor(EventEmitter),
  dotty = require('dotty');

module.exports = function makeConfig(sources) {
  return stampit.compose(events)
    .enclose(function () {
      var factory = stampit(),
          attrs = factory
            .state.apply(factory, 
              sources)
            .create();

      return stampit.extend(this, {
        /**
         * Return the value of the attribute requested.
         * @param  {String} attr The name of the attribute to return.
         * @return {Any} The value of the requested attribute.
         */
        get: function get(attr) {
          var val = dotty.get(attrs, attr);
          if (val === undefined) {
            this.emit('undefined',
              'WARNING: Undefined environment variable: ' + attr, attr);
          }
          return val;
        },
        /**
         * Set the value of an attribute.
         * @param {String} attr  The name of the attribute to set.
         * @param {Any} value The value to set the attribute to.
         * @return {Object} The config object (for chaining).
         */
        set: function set(attr, value) {
          if (!attr) {
            return;
          }

          attrs[attr] = value;
          return this;
        },

        getAll: function getAll() {
          return attrs;
        }
      });
    }).create();
};
