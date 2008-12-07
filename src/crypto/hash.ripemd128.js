(function RIPEMD128() {
  
  Algos.ripemd128 = {
    block: 64,
    algo: function (input) {
      if (!CGU.is_a(input, String)) return;
      
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
      
      var S = [
        11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8, // round 1
         7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12, // round 2
        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5, // round 3
        11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12, // round 4
         8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6, // parallel round 1
         9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11, // parallel round 2
         9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5, // parallel round 3
        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8  // parallel round 4
      ];
      
      var X = [
         0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, // round 1
         7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8, // round 2
         3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12, // round 3
         1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2, // round 4
         5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12, // parallel round 1
         6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2, // parallel round 2
        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13, // parallel round 3
         8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14  // parallel round 4
      ];
      
      var F = function (t, x, y, z) {
        t = t < 64 ? t : 64 - (t % 64) - 1;
        if (t < 16) return (x ^ y ^ z);
        if (t < 32) return ((x & y) | ((~x) & z));
        if (t < 48) return ((x | (~y)) ^ z);
        if (t < 64) return ((x & z) | (y & (~z)));
      };
      
      var K = function (t) {
        if (t <  16) return 0x00000000; // FF
        if (t <  32) return 0x5a827999; // GG
        if (t <  48) return 0x6ed9eba1; // HH
        if (t <  64) return 0x8f1bbcdc; // II
        if (t <  80) return 0x50a28be6; // III
        if (t <  96) return 0x5c4dd124; // HHH
        if (t < 112) return 0x6d703ef3; // GGG
        if (t < 128) return 0x00000000; // FFF
      };
      
      var decode = BIT32.FILO.decode;
      var encode = BIT32.FILO.encode;
      var padded = BIT32.FILO.padded;
      
      var ROL = BIT32.CONV.ROTL;
      
      var C = function (t, a, b, c, d, x) {
        return ROL((a + F(t, b, c, d) + x + K(t)), S[t]);
      };
      
      ////////////
      // Init
      var aa, bb, cc, dd, aaa, bbb, ccc, ddd;
      var x = [], i, t, tmp;
      
      ////////////
      // Update
      x = decode((Sequence(padded(input))).raw());
      
      for (i = 0, t = 0; i < x.length; i += 16, t = 0) {
        aa = aaa = HASH[0];
        bb = bbb = HASH[1];
        cc = ccc = HASH[2];
        dd = ddd = HASH[3];
        
        /* left */
        for (; t < 64; t += 1) {
          aa = C(t, aa, bb, cc, dd, x[i+X[t]]);
          
          tmp = dd;
          dd = cc;
          cc = bb;
          bb = aa;
          aa = tmp;
        }
        
        /* right */
        for (; t < 128; t += 1) {
          aaa = C(t, aaa, bbb, ccc, ddd, x[i+X[t]]);
          
          tmp = ddd;
          ddd = ccc;
          ccc = bbb;
          bbb = aaa;
          aaa = tmp;
        }
        
        /* combine results */
        ddd     = HASH[1] + cc + ddd;
        HASH[1] = HASH[2] + dd + aaa;
        HASH[2] = HASH[3] + aa + bbb;
        HASH[3] = HASH[0] + bb + ccc;
        HASH[0] = ddd;
      }
      
      ////////////
      // Final
      return encode(HASH);
    }
  };
  
})();
