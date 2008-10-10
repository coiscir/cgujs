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

