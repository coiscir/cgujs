/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Iterator
 *    Object and Array Iteration
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Iterator() { // enable private members
  
  CGU.iterate = function (object, iterator, instance) {
    if (!CGU.is_a(iterator, Function)) return;
    
    var type = CGU.type(object);
    var inst = instance === !!instance ? instance : (type != 'object');
    
    for (var p in object)
      if (!inst || Object.prototype.hasOwnProperty.call(object, p))
        if (CGU.is_a(iterator(object[p], p, type), null))
          return null;
    
    return true;
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
    
    var host = CGU.iterate(object, function (v, k, t) {
      object[k] = mapping(v, k, t);
    }, (instance === false ? false : true));
    
    return CGU.isNil(host) ? host : object;
  };
  
})();
