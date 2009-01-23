/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Iterator
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Iterator() {
  
  CGU.asArray = function (object) {
    var array = [];
    if (!CGU.isNil(object) && CGU.is_a(object.length, Number))
      for (var i = 0; i < object.length; i += 1)
        array.push(object[i]);
    return array;
  };
  
  CGU.each = function (object, iterator) {
    return iterate(object, iterator, false);
  };
  
  CGU.every = function (object, iterator) {
    return iterate(object, iterator, true);
  };
  
  CGU.keys = function (object, where) {
    var keys = [], use = CGU.is_a(where, Function);
    CGU.every(object, function (v, k, i) {
      if (!use || where(v, k, i))
        keys.push(k);
    });
    return keys;
  };
  
  CGU.map = function (object, map) {
    if (!CGU.is_a(map, Function)) return;
    
    var result = CGU.is_a(object, Array) ? [] : {};
    CGU.each(object, function (v, k) {
      result[k] = map(v, k);
    });
    return result;
  };
  
  CGU.properties = function (object, where) {
    var props = [], use = CGU.is_a(where, Function);
    CGU.each(object, function (v, k, i) {
      if (!use || where(v, k, i))
        props.push(k);
    });
    return props;
  };
  
  CGU.reject = function (object, reject) {
    if (!CGU.is_a(reject, Function)) return;
    
    var array = CGU.is_a(object, Array);
    var accept = array ? [] : {};
    CGU.each(object, function (v, k, i) {
      if (!reject(v, k, i))
        array ? (accept.push(v)) : (accept[k] = v);
    });
    return accept;
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var iterate = function (object, iterator, every) {
    if (!CGU.is_a(iterator, Function)) return;
    
    var iter = function (key) {
      var instance = Object.prototype.propertyIsEnumerable.call(object, key);
      if (every || instance)
        return iterator(object[key], key, instance);
    };
    
    var interrupt, instance;
    if (CGU.is_a(object, Array) && !every) {
      for (var i = 0; i < object.length; i += 1)
        if (!CGU.is_a((interrupt = iter(i)), undefined))
          return interrupt;
    } else {
      for (var key in object)
        if (!CGU.is_a((interrupt = iter(key)), undefined))
          return interrupt;
    }
  };
  
})();
