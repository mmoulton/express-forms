var Schema = require('schema');

module.exports = {
  create: function(rawSchema) {
    var rawSchema = rawSchema;
    var schema = Schema.create(rawSchema);

    function elementToHtml(id, name, prop, callback) {
      var buffer = '';

      switch(prop.type) {
        // Todo: make this pluggable
        case 'string':
          buffer += '<label for="' + id + '">' + name + '</label>\n';
          buffer += '<input id="' + id + '" name="' + id + '" type="text"/>\n<br/>\n';
          break;
        case 'object':
          buffer += '<fieldset>\n';
          buffer += '<legend>' + name + '</legend>\n';
          Object.keys(prop.properties).forEach(function(k) {
            var key = id + '[' + k + ']';
            elementToHtml(key, k, prop.properties[k], function(result) {
              buffer += result;
            });
          });
          buffer += '</fieldset>\n';
          break;
        case 'array':
          // todo: handle multiple entries
          var key = id + '[]';
          elementToHtml(key, name, prop.items, function(result) {
            buffer += result;
          });
          break;
        default:
          break;
      }
      callback(buffer);
    }

    var f = {
      validate: function(req, res, next) {
        if (!req.body) {
          next();
          return;
        }

        var form = {
          data: req.body[rawSchema.id],
          validation: schema.validate(req.body[rawSchema.id])
        }
        
        res.local('form', form);
        next();
      },

      bind: function(model) {
      },
      
      render: function(req, res, next) {
        var buffer = '';
        if (rawSchema && typeof rawSchema === 'object') {
          elementToHtml(rawSchema.id, rawSchema.id, rawSchema, function(result) {
            buffer += result;
          });
        }
        var name = rawSchema.id + 'Form';
        res.local(name, buffer);
        next();
      }
    };
    return f;
  }
}