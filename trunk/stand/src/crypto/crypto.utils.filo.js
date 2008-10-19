/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Utils :: FILO
**/
  ////////////
  // First In, Last Out
  // Algos: MD, RIPEMD
  var FILO = {
    decode : function (input) {
      var i, j, output = [];
      for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
        output[i] = ((input[j]) & 0xff) |
          ((input[j + 1] << 8 ) & 0xff00) |
          ((input[j + 2] << 16) & 0xff0000) |
          ((input[j + 3] << 24) & 0xff000000);
      }
      return output;
    },
    
    encode : function (input) {
      var i, output = [];
      for (i = 0; i < input.length; i += 1) {
        output.push((input[i] >> 0 ) & 0xff);
        output.push((input[i] >> 8 ) & 0xff);
        output.push((input[i] >> 16) & 0xff);
        output.push((input[i] >> 24) & 0xff);
      }
      return output;
    }
  };
