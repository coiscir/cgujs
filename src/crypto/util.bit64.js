var BIT64 = {
  OPER : {
    ADD : function (x, y) {
      var b = (x[1] + y[1]) & 0xffffffff;
      var a = (x[0] + y[0] + (b < x[1] ? 0x1 : 0x0)) & 0xffffffff;
      return [a, b];
    },
    
    AND : function (x, y) {
      var a = x[0] & y[0] & 0xffffffff;
      var b = x[1] & y[1] & 0xffffffff;
      return [a, b];
    },
    
    OR : function (x, y) {
      var a = x[0] | y[0] & 0xffffffff;
      var b = x[1] | y[1] & 0xffffffff;
      return [a, b];
    },
    
    XOR : function (x, y) {
      var a = x[0] ^ y[0] & 0xffffffff;
      var b = x[1] ^ y[1] & 0xffffffff;
      return [a, b];
    },
    
    NOT : function (x) {
      var a = ~x[0] & 0xffffffff;
      var b = ~x[1] & 0xffffffff;
      return [a, b];
    }
  },
  
  CONV : {
    ROTL : function (x, n) {
      return BIT64.OPER.OR(BIT64.CONV.SHR(x, (64 - n)), BIT64.CONV.SHL(x, n));
    },
    
    ROTR : function (x, n) {
      return BIT64.OPER.OR(BIT64.CONV.SHR(x, n), BIT64.CONV.SHL(x, (64 - n)));
    },
    
    SHL : function (x, n) {
      var a = x[0], b = x[1];
      var c = n >= 32 ? (b << (n - 32)) :
              n == 0 ? a : ((a << n) | (b >>> (32 - n)));
      var d = n >= 32 ? 0x00000000 : (b << n);
      return [c & 0xffffffff, d & 0xffffffff];
    },
    
    SHR : function (x, n) {
      var a = x[0], b = x[1];
      var c = n >= 32 ? 0x00000000 : (a >>> n);
      var d = n >= 32 ? (a >>> (n - 32)) :
              n == 0 ? b : ((a << (32 - n)) | (b >>> n));
      return [c & 0xffffffff, d & 0xffffffff];
    }
  },
  
  
  FIFO : {
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
    }
  }
};
