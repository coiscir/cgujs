/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Cookie
 *    Read, Write, and Delete (Expire) Cookies
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *
 *  cookie -> Read, Write, or Expire Cookies.
 *
 *    Syntax: CGU.cookie(key [, value [, options]])
 *
 *      key <String>: Name of the cookie.
 *
 *      value <String>: Value of the cookie.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        domain <String>: The domain associated with the cookie.
 *
 *        duration <Number>: Number of days the cookie should live.
 *                           Leave unset to create a session cookie.
 *
 *        expire <Boolean>: Force a cookie to expire.
 *
 *        path <String>: The path associated with the cookie.
 *
 *        secure <Boolean>: Create a secure cookie.
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <undefined>: Key was not specified.
 *
 *      <null>: Key wasn't found (Read). Key didn't exist (Expire).
 *
 *    Modes ("given" = not null or undefined)
 *
 *      Read - key is given
 *
 *      Write - key and value are given
 *
 *      Expire - key is given with options.expire or options.duration < 0
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Cookie() { // enable private members
  
  CGU.cookie = function (key, value, options) {
    if (CGU.isof(key, null, undefined)) return undefined;
    
    options = (function (o) { return {
      domain   : CGU.limit(o.domain,   String)  || false,
      duration : CGU.limit(o.duration, Number)  || false,
      expire   : CGU.limit(o.expire,   Boolean) || false,
      path     : CGU.limit(o.path,     String)  || false,
      secure   : CGU.limit(o.secure,   Boolean) || false
    };})(options || {});
    
    if (options.expire) options.duration = -1;
    
    var r = read(key);
    if (CGU.isof(value, null, undefined) && options.duration === false)
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
