/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type
 *    Enhanced Data-Type Distinction
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
 *  clone -> Clone any type of object.
 *
 *    Syntax: Type.clone(object)
 *
 *      object <Mixed>: The object to be cloned.
 *
 *    Return: <Mixed>: The object's clone.
 *----
 *
 *  get -> Enhanced typeof.
 *
 *    Syntax: Type.get(object)
 *
 *      object <Mixed>: The object to be tested.
 *
 *    Return: <String>: The object's type.
 *----
 *
 *  is_a -> Enhanced instanceof.
 *
 *    Syntax: Type.is_a(object, compare)
 *
 *      object <Mixed>: The object to be compared.
 *
 *      compare <String>: A type.
 *      compare <Function>: A constructor.
 *
 *    Return: <Boolean>: Object compared the type or Constructor.
 *----
 *
 *  isof -> Multiple is_a with OR testing.
 *
 *    Syntax: Type.isof(object, compare [, ..])
 *
 *      Properties are the same as is_a.
 *
 *    Return: <Boolean>: Object compared a type or Constructor.
 *----
 *
 *  limit -> Limit an object's type.
 *
 *    Syntax: Type.limit(object, compare [, ..])
 *
 *      Properties are the same as is_a and isof.
 *
 *    Return: <Mixed>: A clone of the object.
 *
 *      <undefined>: Object did not compare.
 *----
 *
 *  types -> Get a list of recognized types.
 *
 *    Syntax: Type.types()
 *
 *    Return: <Array>: List of recognized types.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Type = new (function () {
  this.Version = '8.1117';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Types
**/
  var UND = 'undefined', NUL = 'null',
      ARR = 'array',     BLN = 'boolean',
      DTE = 'date',      ERR = 'error',
      FNC = 'function',  NUM = 'number',
      OBJ = 'object',    RGX = 'regexp',
      STR = 'string',    UNK = 'unknown';

  this.types = function () {
    return this.clone([UND, NUL, ARR, BLN, DTE, ERR, FNC, NUM, OBJ, RGX, STR, UNK]);
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Utils
**/
  this.get = function (object) {
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

  this.clone = function (object) {
    var $object = function (object) {
      var obj = {};
      for (var prop in object) obj[prop] = object[prop];
      return obj;
    };

    switch (this.get(object)) {
      case NUL : return null;
      case ARR : return [].concat(object.valueOf());
      case BLN : return !!object.valueOf();
      case DTE : return new Date(object.valueOf());
      case ERR :
      case FNC : return object.valueOf();
      case NUM : return 0 + object.valueOf();
      case OBJ : return $object(object.valueOf());
      case RGX : return new RegExp(object.valueOf());
      case STR : return '' + object.valueOf();
      default  : return undefined
    }
  };

  this.is_a = function (object, compare) {
    switch (this.get(compare)) {
      case UND : return this.get(object) === UND;
      case NUL : return this.get(object) === NUL;
      case STR : return this.get(object) === compare;
      case FNC :
        switch (compare) { // promote primitives
          case Boolean : return this.get(object) === BLN;
          case Number  : return this.get(object) === NUM;
          case String  : return this.get(object) === STR;
          default      : return object instanceof compare;
        }
      default : return undefined;
    }
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type :: Lists
**/
  this.isof = function () {
    var args = [], argc = arguments.length, argi;
    for (argi = 0; argi < argc; argi += 1)
      args[argi] = arguments[argi];

    var object = args.shift();
    for (argi = 0; argi < args.length; argi += 1)
      if (this.is_a(object, args[argi]))
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
