/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Type
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Type() {

  var UND = 'undefined', NUL = 'null',
      ARR = 'array',     BLN = 'boolean',
      DTE = 'date',      ERR = 'error',
      FNC = 'function',  NUM = 'number',
      OBJ = 'object',    RGX = 'regexp',
      STR = 'string',    UNK = 'unknown';
  
  CGU.types = function () {
    return [UND, NUL, ARR, BLN, DTE, ERR, FNC, NUM, OBJ, RGX, STR, UNK];
  };
  
  CGU.type = function (object) {
    switch (typeof object) {
      case 'undefined' : return UND;
      case 'boolean'   : return BLN;  // literal
      case 'number'    : return NUM;  // literal
      case 'string'    : return STR;  // literal
      case 'function'  :
        if (object.constructor === RegExp)  return RGX;  // FF2
        return FNC;
      case 'object' :
        if (object === null) return NUL;
        if (object instanceof Error) return ERR;
        if (object.constructor === Array)   return ARR;
        if (object.constructor === Boolean) return BLN;  // new operator
        if (object.constructor === Date)    return DTE;
        if (object.constructor === Number)  return NUM;  // new operator
        if (object.constructor === RegExp)  return RGX;
        if (object.constructor === String)  return STR;  // new operator
        return OBJ;
      default : return UNK;
    }
  };
  
  CGU.clone = function (object) {
    switch (CGU.type(object)) {
      case NUL : return null;
      case ARR : return [].concat(object.valueOf());
      case BLN : return !!object.valueOf();
      case DTE : return new Date(object.valueOf());
      case ERR : /* continue */
      case FNC : return object.valueOf();
      case NUM : return 0 + object.valueOf();
      case OBJ : return CGU.map(object, function (v) { return v; });
      case RGX : return new RegExp(object.valueOf());
      case STR : return '' + object.valueOf();
      default  : return undefined
    }
  };
  
  CGU.is_a = function (object, compare) {
    switch (CGU.type(compare)) {
      case UND : return CGU.type(object) === UND;
      case NUL : return CGU.type(object) === NUL;
      case STR : return CGU.type(object) === compare;
      default :
        switch (compare) {
          case Boolean : return CGU.type(object) === BLN; // promote primitives
          case Number  : return CGU.type(object) === NUM;
          case String  : return CGU.type(object) === STR;
          case Object  : return CGU.type(object) === OBJ; // demote Object
          default      : return object instanceof compare;
        }
    }
  };
  
  CGU.isof = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];
      
    var object = args.shift();
    for (argi = 0; argi < args.length; argi += 1)
      if (CGU.is_a(object, args[argi]))
        return true;
    return false;
  };
  
  CGU.limit = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];
    return CGU.isof.apply(CGU, args) ? CGU.clone(args[0]) : undefined;
  };
  
  CGU.isNil = function (object) {
    return CGU.isof(object, null, undefined);
  };
  
  CGU.isElement = function (object) {
    return window.HTMLElement ? CGU.is_a(object, HTMLElement) :
      CGU.is_a(object, Object) &&
      CGU.is_a(object.nodeType, Number) &&
      CGU.is_a(object.nodeName, String) &&
      CGU.is_a(object.tagName, String);
  };
  
})();
