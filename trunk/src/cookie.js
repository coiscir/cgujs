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
      return r;
    
    var e = options.duration < 0;
    var w = write(key, value, options);
    return e ? (r === null ? r : !w) : w;
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var read = function (key) {
    key = String(key);
    var cookies = CGU.clone(document.cookie).split(/\;\s*/), i;
    for (i = 0; i < cookies.length; i += 1)
      if (key === decodeURIComponent(cookies[i].split('=')[0]))
        return decodeURIComponent(cookies[i].split('=')[1] || '');
    return null;
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
    
    return read(key) !== null;
  };
  
})();
