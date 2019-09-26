var camelCase = require('camel-case');
var snakeCase = require('snake-case');
var paramCase = require('param-case');

var changeKeys = function changeKeys(transformer, obj, options) {
  var objectKeys;
  var ignoreArray = (options || {}).ignoreArray || false;

  if (Array.isArray(obj)) {
    if (ignoreArray) return obj;
    return obj.map(function keysMap(key) {
      if (typeof key === 'string') {
        return transformer(key);
      }

      return changeKeys(transformer, key);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    objectKeys = Object.keys(obj);
    return objectKeys.map(function keysMap(key) {
      return transformer(key);
    }).reduce(function keysReducer(object, changedKey, index) {
      var objValue;
      var transformedValue;

      objValue = obj[objectKeys[index]];
      transformedValue = changeKeys(transformer, objValue);
      object[changedKey] = transformedValue;
      return object;
    }, {});
  }

  return obj;
};

var changeCaseObject = {};
changeCaseObject.camel = changeCaseObject.camelCase = function camelCaseObject(obj, options) {
  if (typeof obj === 'string') {
    return camelCase(obj);
  }

  return changeKeys(camelCase, obj, options);
};

changeCaseObject.snake = changeCaseObject.snakeCase = function snakeCaseObject(obj, options) {
  if (typeof obj === 'string') {
    return snakeCase(obj);
  }

  return changeKeys(snakeCase, obj, options);
};

changeCaseObject.param = changeCaseObject.paramCase = function paramCaseObject(obj, options) {
  if (typeof obj === 'string') {
    return paramCase(obj);
  }

  return changeKeys(paramCase, obj, options);
};

module.exports = changeCaseObject;
