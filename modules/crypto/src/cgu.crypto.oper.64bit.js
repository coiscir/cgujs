/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - 64-Bit Operations
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  var BIT64 = {
    
    NEW : function (x) {
      return [x[0] & 0xffffffff, x[1] & 0xffffffff];
    },
    
    ADD : function (x, y) {
      x = BIT64.NEW(x); y = BIT64.NEW(y);
      var b = x[1] + y[1];
      var a = x[0] + y[0] + (BIT32.LT(b, x[1]) ? 0x1 : 0x0);
      return BIT64.NEW([a, b]);
    },
    
    MULT : function (x, y) {
      var $ = BIT64.NEW([0x00000000, 0x00000000]);
      
      for (var i = 0; i < 64; i += 1) {
        if (BIT64.SHR(y, i)[1] & 0x1) {
          $ = BIT64.ADD($, BIT64.SHL(x, i));
        }
      }
      
      return BIT64.NEW($);
    },
    
    SUBT : function (x, y) {
      x = BIT64.NEW(x); y = BIT64.NEW(y);
      var b = x[1] - y[1];
      var a = x[0] - y[0] - (BIT32.GT(b, x[1]) ? 0x1 : 0x0);
      return BIT64.NEW([a, b]);
    },
    
    AND : function (x, y) {
      return BIT64.NEW([x[0] & y[0], x[1] & y[1]]);
    },
    
    OR : function (x, y) {
      return BIT64.NEW([x[0] | y[0], x[1] | y[1]]);
    },
    
    XOR : function (x, y) {
      return BIT64.NEW([x[0] ^ y[0], x[1] ^ y[1]]);
    },
    
    NOT : function (x) {
      return BIT64.NEW([~x[0], ~x[1]]);
    },
    
    ROTL : function (x, n) {
      return BIT64.OR(BIT64.SHR(x, (64 - n)), BIT64.SHL(x, n));
    },
    
    ROTR : function (x, n) {
      return BIT64.OR(BIT64.SHR(x, n), BIT64.SHL(x, (64 - n)));
    },
    
    SHL : function (x, n) {
      var a = x[0];
      var b = x[1];
      var c = n >= 32 ? (b << (n - 32)) :
              n == 0 ? a : ((a << n) | (b >>> (32 - n)));
      var d = n >= 32 ? 0x00000000 : (b << n);
      return BIT64.NEW([c, d]);
    },
    
    SHR : function (x, n) {
      var a = x[0], b = x[1];
      var c = n >= 32 ? 0x00000000 : (a >>> n);
      var d = n >= 32 ? (a >>> (n - 32)) :
              n == 0 ? b : ((a << (32 - n)) | (b >>> n));
      return BIT64.NEW([c, d]);
    },
    
    MSD : {
      decode : function (input) {
        var i, j, output = [];
        for (i = 0, j = 0; j < input.length; i += 1, j = (i * 8)) {
          output[i] = [
            ((input[j + 0] & 0xff) << 24) |
            ((input[j + 1] & 0xff) << 16) |
            ((input[j + 2] & 0xff) << 8 ) |
            ((input[j + 3] & 0xff) << 0 ),
            ((input[j + 4] & 0xff) << 24) |
            ((input[j + 5] & 0xff) << 16) |
            ((input[j + 6] & 0xff) << 8 ) |
            ((input[j + 7] & 0xff) << 0 )
          ];
        }
        return output;
      },
      
      encode : function (input) {
        var i, output = [];
        for (i = 0; i < input.length; i += 1) {
          output.push((input[i][0] >> 24) & 0xff);
          output.push((input[i][0] >> 16) & 0xff);
          output.push((input[i][0] >> 8 ) & 0xff);
          output.push((input[i][0] >> 0 ) & 0xff);
          output.push((input[i][1] >> 24) & 0xff);
          output.push((input[i][1] >> 16) & 0xff);
          output.push((input[i][1] >> 8 ) & 0xff);
          output.push((input[i][1] >> 0 ) & 0xff);
        }
        return output;
      },
      
      padded : function (input) {
        var length = input.length;
        var bitlen = length * 8;
        
        var padding = '\x80';
        var padlen = ((length % 128) < 112 ? 112 : 240) - (length % 128);
        while (padding.length < padlen) padding += '\x00';
        
        var count1 = (bitlen / Math.pow(2, 32));
        var count2 = (count1 / Math.pow(2, 32));
        var count3 = (count2 / Math.pow(2, 32));
        input += padding;
        input += CGU.Sequence(BIT64.MSD.encode([[count3 & 0xffffffff, count2 & 0xffffffff]])).str();
        input += CGU.Sequence(BIT64.MSD.encode([[count1 & 0xffffffff, bitlen & 0xffffffff]])).str();
        
        return input;
      }
    }
  };
