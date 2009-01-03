/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - 32-Bit Operations
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var BIT32 = {
  
  GT : function (a, b) {
    for (var c, d, i = 0; i < 32; i += 1) {
      c = (a >> (31 - i)) & 0x1;
      d = (b >> (31 - i)) & 0x1;
      if (c == d) continue;
      if (c > d) return true;
      if (c < d) break;
    }
    return false;
  },
  
  LT : function (a, b) {
    for (var c, d, i = 0; i < 32; i += 1) {
      c = (a >> (31 - i)) & 0x1;
      d = (b >> (31 - i)) & 0x1;
      if (c == d) continue;
      if (c < d) return true;
      if (c > d) break;
    }
    return false;
  },
  
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
  },
  
  FIFO : {
    decode : function (input) {
      var i, j, output = [];
      for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
        output[i] = 
          ((input[j + 0] & 0xff) << 24) |
          ((input[j + 1] & 0xff) << 16) |
          ((input[j + 2] & 0xff) << 8 ) |
          ((input[j + 3] & 0xff) << 0 );
      }
      return output;
    },
    
    encode : function (input) {
      var i, output = [];
      for (i = 0; i < input.length; i += 1) {
        output.push((input[i] >> 24) & 0xff);
        output.push((input[i] >> 16) & 0xff);
        output.push((input[i] >> 8 ) & 0xff);
        output.push((input[i] >> 0 ) & 0xff);
      }
      return output;
    },
    
    padded : function (input) {
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
      while (padding.length < padlen) padding += '\x00';
      
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += Sequence(BIT32.FIFO.encode([(count  & 0xffffff)])).str();
      input += Sequence(BIT32.FIFO.encode([(bitlen & 0xffffff)])).str();
      
      return input;
    }
  },
  
  FILO : {
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
    },
    
    padded : function (input) {
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
      while (padding.length < padlen) padding += '\x00';
      
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += (Sequence(BIT32.FILO.encode([bitlen, count]))).str();
      
      return input;
    }
  }
};
