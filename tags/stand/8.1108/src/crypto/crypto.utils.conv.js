/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Utils :: Conv
**/
  ////////////
  // Conversions
  var CONV = {
    ROTL : function (x, n) {
      return ((x << n) | (x >>> (32 - n)));
    },
    
    ROTR : function (x, n) {
      return ((x >>> n) | (x << (32 - n)));
    },
    
    SHL : function (x, n) {
      return x << n;
    },
    
    SHR : function (x, n) {
      return x >>> n;
    }
  };
