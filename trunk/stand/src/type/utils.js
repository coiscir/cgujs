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
    switch (this.get(object)) {
      case NUL : return null;
      case ARR :
      case BLN :
      case FNC :
      case NUM :
      case OBJ :
      case RGX :
      case STR : return object.valueOf();
      case DTE : return new Date(object.valueOf());
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
