(function SHA1() {
  
  Algos.sha1 = {
    block: 64,
    algo: function (input) {
      if (!CGU.is_a(input, String)) return;
      
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
      
      var decode = FIFO.decode;
      var encode = FIFO.encode;
      
      var ROTL = CONV.ROTL;
      
      var F = function (t, b, c, d) {
        if (t < 20) return (b & c) | ((~b) & d);
        if (t < 40) return (b ^ c ^ d);
        if (t < 60) return (b & c) | (b & d) | (c & d);
        if (t < 80) return (b ^ c ^ d);
      };
      var K = function (t) {
        if (t < 20) return 0x5a827999;
        if (t < 40) return 0x6ed9eba1;
        if (t < 60) return 0x8f1bbcdc;
        if (t < 80) return 0xca62c1d6;
      };
      
      ////////////
      // Init
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
      while (padding.length < padlen) padding += '\x00';
      
      var a, b, c, d, e, tmp;
      var x = [], w = [], i, t;
      
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += Sequence(encode([(count  & 0xffffff)])).str();
      input += Sequence(encode([(bitlen & 0xffffff)])).str();
      
      ////////////
      // Update
      x = decode((Sequence(input)).raw());
      
      for (i = 0; i < x.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        
        for (t = 0; t < 80; t += 1) {
          if (t < 16) {
            w[t] = x[i+t];
          } else {
            w[t] = ROTL((w[t-3] ^ w[t-8] ^ w[t-14] ^ w[t-16]), 1);
          }
          
          tmp = (ROTL(a, 5) + F(t, b, c, d) + e + w[t] + K(t));
          e = d;
          d = c;
          c = ROTL(b, 30);
          b = a;
          a = tmp;
        }
        
        HASH[0] += a;
        HASH[1] += b;
        HASH[2] += c;
        HASH[3] += d;
        HASH[4] += e;
      }
      
      ////////////
      // Final
      return encode(HASH);
    }
  };

})();