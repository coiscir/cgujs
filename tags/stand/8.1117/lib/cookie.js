/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie
 *    Read, Write, and Delete (Expire) Cookies
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *
 *  expire -> Force a cookie to expire.
 *
 *    Syntax: Cookie.expire(key [, options])
 *
 *      key <String>: Name of the cookie.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <null>: Wasn't previously written.
 *----
 *
 *  read -> Get the value of a cookie.
 *
 *    Syntax: Cookie.read(key)
 *
 *      key <String>: Name of the cookie.
 *
 *    Return: <String>: Value of the cookie.
 *
 *      <null>: Cookie hasn't been written.
 *----
 *
 *  toObject -> Create an object representation of cookies.
 *
 *    Syntax: Cookie.toObject()
 *
 *    Return: <Object>: With cookie names as keys and string values respectively.
 *----
 *
 *  write -> Create a cookie.
 *
 *    Syntax: Cookie.write(key, value [, options])
 *
 *      key <String>: Name of the cookie.
 *
 *      value <String>: Value of the cookie.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        domain <String>: The domain associated with the cookie.
 *
 *        expire <Number>: Number of days the cookie should live.
 *                         Leave unset to create a session cookie.
 *
 *        path <String>: The path associated with the cookie.
 *
 *        secure <Boolean>: Create a secure cookie.
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <null>: Key was not specified.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Cookie = new (function () {
  this.Version = '8.1117';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Core
**/
  this.read = function (key) {
    key = String(key);
    var cookies = Type.clone(document.cookie).split(/\;\s*/), i;
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

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Conversion
**/
  this.toObject = function () {
    var object = {}, k, v;
    var cookies = Type.clone(document.cookie).split(/\;\s*/);
    for (var i = 0; i < cookies.length; i += 1) {
      k = decodeURIComponent(cookies[i].split('=')[0]);
      v = decodeURIComponent(cookies[i].split('=')[1]) || '';
      if (k != '')
        object[k] = v;
    }
    return Type.clone(object);
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Requires
**/
  var Type=new(function(){this.Version='8.1117';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',ERR='error',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,ERR,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object instanceof Error)return ERR;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){var $object=function(object){var obj={};for(var prop in object)obj[prop]=object[prop];return obj;};switch(this.get(object)){case NUL:return null;case ARR:return[].concat(object.valueOf());case BLN:return!!object.valueOf();case DTE:return new Date(object.valueOf());case ERR:case FNC:return object.valueOf();case NUM:return 0+object.valueOf();case OBJ:return $object(object.valueOf());case RGX:return new RegExp(object.valueOf());case STR:return''+object.valueOf();default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
