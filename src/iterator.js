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
  
  CGU.iterate = function (object, iterator, inherit) {
    if (!CGU.isof(iterator, Function)) return;
    
    var type = CGU.type(object);
    var inst = inherit === !!inherit ? inherit : (type != 'object');
    
    for (var p in object)
      if (!inst || object.propertyIsEnumerable(p))
        if (CGU.is_a(iterator(object[p], p, type), null))
          return null;
    
    return true;
  };
  
  CGU.keys = function (object, inherit) {
    var ks = [];
    CGU.iterate(object, function (v, k) {
      ks.push(k);
    }, (inherit === false ? false : true));
    return ks;
  };
  
  CGU.map = function (object, mapping, inherit) {
    if (!CGU.is_a(mapping, Function)) return;
    
    var host = CGU.iterate(object, function (v, k, t) {
      object[k] = mapping(v, k, t);
    }, (inherit === false ? false : true));
    
    return CGU.isNil(host) ? host : object;
  };
  
})();
