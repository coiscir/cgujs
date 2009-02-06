/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Cookie
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Cookie() {
  
  CGU.cookie = function (key, value, options) {
    if (CGU.isNil(key)) return undefined;
    
    options = (function (o) { return {
      domain   : CGU.limit(o.domain,   String)  || false,
      duration : CGU.limit(o.duration, Number)  || false,
      expire   : CGU.limit(o.expire,   Boolean) || false,
      path     : CGU.limit(o.path,     String)  || false,
      secure   : CGU.limit(o.secure,   Boolean) || false
    };})(options || {});
    
    if (options.expire) options.duration = -1;
    
    var r = read(key);
    if (CGU.isNil(value) && options.duration === false)
      return CGU.isNil(r) ? null : r;
    
    var e = options.duration < 0;
    var w = write(key, value, options);
    return e ? (CGU.isNil(r) ? null : !w) : w;
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var read = function (key) {
    key = String(key);
    var cookies = CGU.clone(document.cookie).split(/\;\s*/), i;
    return CGU.each(cookies, function (v) {
      if (key === decodeURIComponent(v.split('=')[0]))
        return decodeURIComponent(v.split('=')[1] || '');
    });
  };
  
  var write = function (key, value, options) {
    var day = 24 * 60 * 60 * 1000;
    
    document.cookie = ''.concat(
      encodeURIComponent(key), '=',
      encodeURIComponent(value),
      (!options.duration ? '' : ('; expires=' + new Date(new Date().getTime() + options.duration * day).toUTCString())),
      (!options.domain   ? '' : ('; domain='  + options.domain)),
      (!options.path     ? '' : ('; path='    + options.path)),
      (!options.secure   ? '' : ('; secure'))
    );
    
    return !CGU.isNil(read(key));
  };
  
})();
