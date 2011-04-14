
/*!
 * querystring
 *
 * Yet another querystring implementation.
 * This builds of of TJ Holowaychuk work in 'node-querystring'
 * (https://github.com/visionmedia/node-querystring)
 *
 * Copyright(c) 2011 Mike Moulton <mike@meltmedia.com>
 * MIT Licensed
 */

var util = require('util');

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Parse the given query `str`, returning an object.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */


exports.parse = function(str) {
  if (str == undefined || str == '') return {};

  return String(str)
    .split('&')
    .reduce(function(ret, pair) {

      var pair = decodeURIComponent(pair.replace(/\+/g, ' ')),
          eql = pair.indexOf('='),
          key = pair.substr(0, eql),
          value = pair.substr(eql, pair.length),
          value = value.substr(value.indexOf('=') + 1, value.length),
          obj = ret;

      // ?foo
      if (key == '') key = pair, value = '';

      // creating a nested object structure
      if (~key.indexOf('.') || ~key.indexOf('[')) {
        var parts = key.split('.'),
            indexRegex = /.*\[(\d+)\].*/,
            length = parts.length,
            last = length - 1;

        // assemble the nested structure and store the value
        parts.forEach(function(part, index) {
          var arrayIndex = part.indexOf('['),
              insertIndex = ~part.search(indexRegex) ? Number(part.replace(indexRegex, "$1")) : -1,
              part = ~arrayIndex ? part.substr(0, arrayIndex) : part,
              lastPart = last == index,
              val = lastPart ? value : {};

          // is this part of the structue an array, and is a specific index being requested
          if (~arrayIndex) {
            obj = obj[part] = Array.isArray(obj[part]) ? obj[part] : [];

            if (~insertIndex) {
              obj = obj[insertIndex] = obj[insertIndex] === undefined ? val : obj[insertIndex];
            } else if (value != '') {
              var o = val;
              obj.push(o);
              obj = o;
            }
          } else {
            obj = obj[part] = obj[part] === undefined ? val : obj[part];
          }
        });


      } else {
        // Set `obj`'s `key` to `value` respecting
        // the weird and wonderful syntax of a qs,
        // where "foo=bar&foo=baz" becomes an array.
        var v = obj[key];
        if (v === undefined) {
          obj[key] = value;
        } else if (Array.isArray(v)) {
          v.push(value);
        } else {
          obj[key] = [v, value];
        }
      }

      return ret;
    }, {});
};
