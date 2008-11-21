/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Type :: Types
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
