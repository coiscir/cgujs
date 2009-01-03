/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Iterator
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Iterator() {
  
  CGU.iterate = function (object, iterator, instance) {
    if (!CGU.is_a(iterator, Function)) return;
    
    var interrupt, type = CGU.type(object);
    var inst = instance === !!instance ? instance : (type != 'object');
    if (type == 'array' && inst) object = CGU.clone(object);
    
    for (var p in object)
      if (!inst || Object.prototype.hasOwnProperty.call(object, p))
        if (!CGU.is_a((interrupt = iterator(object[p], p, type)), undefined))
          return interrupt;
  };
  
  CGU.asArray = function (object) {
    var arr = [];
    if (CGU.is_a(object.length, Number))
      for (var i = 0; i < object.length; i += 1)
        arr.push(object[i]);
    return arr;
  };
  
  CGU.keys = function (object, instance) {
    var ks = [];
    CGU.iterate(object, function (v, k) {
      ks.push(k);
    }, (instance === false ? false : true));
    return ks;
  };
  
  CGU.map = function (object, mapping, instance) {
    if (!CGU.is_a(mapping, Function)) return;
    
    CGU.iterate((object = CGU.clone(object)), function (v, k, t) {
      object[k] = mapping(v, k, t);
    }, (instance === false ? false : true));
    
    return object;
  };
  
  CGU.trials = function () {
    return CGU.iterate(CGU.asArray(arguments), function (v) {
      try { return v(); } catch (e) {}
    }, true);
  };
  
})();
