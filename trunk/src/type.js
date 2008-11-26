/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Type
 *    Enhanced Data-Type Distinction
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  clone -> Clone any type of object.
 *
 *    Syntax: CGU.clone(object)
 *
 *      object <Mixed>: The object to be cloned.
 *
 *    Return: <Mixed>: The object's clone.
 *----
 *
 *  is_a -> Enhanced instanceof.
 *
 *    Syntax: CGU.is_a(object, compare)
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
 *    Syntax: CGU.isof(object, compare [, ..])
 *
 *      Arguments are the same as is_a.
 *
 *    Return: <Boolean>: Object compared a type or Constructor.
 *----
 *
 *  limit -> Limit an object's type.
 *
 *    Syntax: CGU.limit(object, compare [, ..])
 *
 *      Arguments are the same as is_a and isof.
 *
 *    Return: <Mixed>: A clone of the object.
 *
 *      <undefined>: Object did not compare.
 *----
 *
 *  type -> Enhanced typeof.
 *
 *    Syntax: CGU.type(object)
 *
 *      object <Mixed>: The object to be tested.
 *
 *    Return: <String>: The object's type.
 *----
 *
 *  types -> Get a list of recognized types.
 *
 *    Syntax: CGU.types()
 *
 *    Return: <Array>: List of recognized types.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Type() { // enable private members

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
    var $object = function (object) {
      var obj = {};
      for (var prop in object) obj[prop] = CGU.clone(object[prop]);
      return obj;
    };
    
    switch (CGU.type(object)) {
      case NUL : return null;
      case ARR : return [].concat(object.valueOf());
      case BLN : return !!object.valueOf();
      case DTE : return new Date(object.valueOf());
      case ERR : /* continue */
      case FNC : return object.valueOf();
      case NUM : return 0 + object.valueOf();
      case OBJ : return $object(object.valueOf());
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
      case FNC :
        switch (compare) {
          case Boolean : return CGU.type(object) === BLN; // promote primitives
          case Number  : return CGU.type(object) === NUM;
          case String  : return CGU.type(object) === STR;
          case Object  : return CGU.type(object) === OBJ; // demote Object
          default      : return object instanceof compare;
        }
      default : return undefined;
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

})();
