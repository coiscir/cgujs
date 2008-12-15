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
    var inst = inherit === true || type != 'object';
    var host;
    
    for (var p in object)
      if (!inst || object.propertyIsEnumerable(p)) {
        host = iterator(object[p], p);
        if (!CGU.isNil(host)) return host;
      }
    
    return true;
  };
  
  CGU.keys = function (object, inherit) {
    var ks = [];
    CGU.iterate(object, function (v, k) {
      ks.push(k);
    }, inherit);
    return ks;
  };
  
  CGU.map = function (object, mapping, inherit) {
    if (!CGU.is_a(mapping, Function)) return;
    
    var host = CGU.iterate(object, function (v, k) {
      object[k] = mapping(v, k);
    }, (inherit === false ? false : true));
    
    return CGU.isNil(host) ? host : object;
  };
  
})();
