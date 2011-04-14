/*!
 * express-forms
 * Copyright(c) 2011 Mike Moulton <mike@meltmedia.com>
 * MIT Licensed
 */

var Schema = require('schema'),
    util = require('util'),
    qs = require('./querystring');

module.exports = {

  /**
   * Create a new form from the supplied JSON Schema
   *
   * @param {String} rawSchema
   * @return {Object} The form
   * @api public
   */
  create: function(rawSchema) {
    var rawSchema = rawSchema;
    var schema = Schema.create(rawSchema);

    function renderHtml(form) {
      var buffer = '';
      if (form && typeof form === 'object') {
        elementToHtml(form.id, form.id, form, function(result) {
          buffer += result;
        });
      }
      return buffer;
    }

    function elementToHtml(id, name, prop, callback) {
      var buffer = '';

      switch(prop.type) {
        // Todo: make this pluggable
        case 'integer':
        case 'number':
        case 'string':
          buffer += '<label for="' + name + '">' + name + '</label>\n';
          buffer += '<input id="' + name + '" name="' + id + '" type="text"/>\n<br/>\n';
          break;
        case 'object':
          buffer += '<fieldset>\n';
          buffer += '<legend>' + name + '</legend>\n';
          Object.keys(prop.properties).forEach(function(k) {
            var key = id + '.' + k;
            elementToHtml(key, k, prop.properties[k], function(result) {
              buffer += result;
            });
          });
          buffer += '</fieldset>\n';
          break;
        case 'array':
          // todo: handle multiple entries
          var key = id + '[0]';
          elementToHtml(key, name, prop.items, function(result) {
            buffer += result;
          });
          break;
        default:
          break;
      }
      callback(buffer);
    }

    var f = function form(req, res, next) {
      var data = {},
          id = rawSchema.id;

      if (req.rawBody || req.body) {
        var body = (req.rawBody) ? req.rawBody : req.body;
        data = qs.parse(body);
      }


      var formData = data[id] ? data[id] : {};
      console.log('Form: %s', util.inspect(formData, false, 10));

      var form = {
        data: formData,

        validation: schema.validate(formData),

        html: renderHtml(rawSchema),

        // todo
        bind: function(model) {
        }

      };
      
      var name = id + 'Form';
      res.local(name, form);
      next();
    };

    return f;
  }
};