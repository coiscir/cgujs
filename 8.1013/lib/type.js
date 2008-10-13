/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type
 *    Enhanced Data-Type Distinction
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Type = new (function () {
  this.Version = '8.1013';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Types
**/
  var UND = 'undefined', NUL = 'null',
      ARR = 'array',     BLN = 'boolean',
      DTE = 'date',      FNC = 'function',
      NUM = 'number',    OBJ = 'object',
      RGX = 'regexp',    STR = 'string',
      UNK = 'unknown';

  this.types = function () {
    return this.clone([UND, NUL, ARR, BLN, DTE, FNC, NUM, OBJ, RGX, STR, UNK]);
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Utils
**/
  this.get = function (obj) {
    switch (typeof obj) {
      case 'undefined' : return UND;
      case 'boolean'   : return BLN;  // literal
      case 'number'    : return NUM;  // literal
      case 'string'    : return STR;  // literal
      case 'function'  :
        if (obj.constructor === RegExp)  return RGX;  // FF2
        return FNC;
      case 'object'    :
        if (obj === null) return NUL;
        if (obj.constructor === Array)   return ARR;
        if (obj.constructor === Boolean) return BLN;  // new operator
        if (obj.constructor === Date)    return DTE;
        if (obj.constructor === Number)  return NUM;  // new operator
        if (obj.constructor === RegExp)  return RGX;
        if (obj.constructor === String)  return STR;  // new operator
        return OBJ;
      default : return UNK;
    }
  };

  this.clone = function (obj) {
    switch (this.get(obj)) {
      case NUL : return null;
      case ARR :
      case BLN :
      case FNC :
      case NUM :
      case OBJ :
      case RGX :
      case STR : return obj.valueOf();
      case DTE : return new Date(obj.valueOf());
      default  : return undefined
    }
  };

  this.is_a = function () {
    switch (this.get(arguments[1])) {
      case FNC : return (arguments[0] instanceof arguments[1]);
      case STR : return this.get(arguments[0]) == arguments[1];
      default  : return undefined;
    };
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Lists
**/
  this.isof = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];

    var obj = args.shift();
    for (argi = 0; argi < args.length; argi += 1)
      if (this.is_a(obj, args[argi]))
        return true;
    return false;
  };

  this.limit = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];
    return this.isof.apply(this, args) ? this.clone(args[0]) : undefined;
  };

})();
