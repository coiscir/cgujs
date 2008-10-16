/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Core
**/
  this.read = function (key) {
    key = String(key);
    var cookies = ('' + document.cookie).split(/\;\s*/), i;
    for (i = 0; i < cookies.length; i += 1)
      if (typeof cookies[i] === 'string' && cookies[i].match(/[^\=]+\=/))
        if (key === decodeURIComponent(cookies[i].split('=')[0]))
          return decodeURIComponent(cookies[i].split('=')[1] || '');
    return null;
  };
  
  this.write = function (key, value, options) {
    options = (function (o) { return {
      path     : Type.limit(o.path,     String)  || false,
      domain   : Type.limit(o.domain,   String)  || false,
      secure   : Type.limit(o.secure,   Boolean) || false,
      duration : Type.limit(o.duration, Number)  || false
    };})(options || {});
    
    if (encodeURIComponent(key) === '') return null;
    
    document.cookie = ''.concat(
      encodeURIComponent(key), '=',
      encodeURIComponent(value),
      (!options.domain   ? '' : ('; domain='  + options.domain)),
      (!options.path     ? '' : ('; path='    + options.path)),
      (!options.duration ? '' : ('; expires=' + (function () {
        var date = new Date();
        date.setTime(date.getTime() + (options.duration * 24 * 60 * 60 * 1000));
        return date.toUTCString();
      })())),
      (!options.secure  ? '' : '; secure')
    );
    return (this.read(key) !== null);
  };
  
  this.expire = function (key, options) {
    options = (function (o) { return {
      path     : Type.limit(o.path,   String)  || false,
      domain   : Type.limit(o.domain, String)  || false,
      secure   : Type.limit(o.secure, Boolean) || false,
      duration : -1
    };})(options || {});
    
    if (this.read(key) === null) return null; // doesn't exist
    
    this.write(key, '', options);
    return (this.read(key) === null);
  };
