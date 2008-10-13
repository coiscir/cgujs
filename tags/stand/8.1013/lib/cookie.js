/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie
 *    Read, Write, and Delete (Expire) Cookies
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Cookie = new (function () {
  this.Version = '8.1013';

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
      path     : Type.limit(o.path,     'string')  || false,
      domain   : Type.limit(o.domain,   'string')  || false,
      secure   : Type.limit(o.secure,   'boolean') || false,
      duration : Type.limit(o.duration, 'number')  || false
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
      path     : Type.limit(o.path,   'string')  || false,
      domain   : Type.limit(o.domain, 'string')  || false,
      secure   : Type.limit(o.secure, 'boolean') || false,
      duration : -1
    };})(options || {});

    if (this.read(key) === null) return null; // doesn't exist

    this.write(key, '', options);
    return (this.read(key) === null);
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Includes
**/
var Type=new(function(){this.Version='8.1013';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(obj){switch(typeof obj){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(obj.constructor===RegExp)return RGX;return FNC;case'object':if(obj===null)return NUL;if(obj.constructor===Array)return ARR;if(obj.constructor===Boolean)return BLN;if(obj.constructor===Date)return DTE;if(obj.constructor===Number)return NUM;if(obj.constructor===RegExp)return RGX;if(obj.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(obj){switch(this.get(obj)){case NUL:return null;case ARR:case BLN:case FNC:case NUM:case OBJ:case RGX:case STR:return obj.valueOf();case DTE:return new Date(obj.valueOf());default:return undefined}};this.is_a=function(){switch(this.get(arguments[1])){case FNC:return(arguments[0]instanceof arguments[1]);case STR:return this.get(arguments[0])==arguments[1];default:return undefined;};};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var obj=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(obj,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
