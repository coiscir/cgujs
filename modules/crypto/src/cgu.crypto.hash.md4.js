/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - MD4
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function MD4() {
    Algos.md4 = new Algo(64, false, function (input) {
      var HASH = [0x067452301, 0x0efcdab89, 0x098badcfe, 0x010325476];
      
      var X = [
        0, 1, 2,  3, 4,  5, 6,  7, 8, 9, 10, 11, 12, 13, 14, 15, // Round 1
        0, 4, 8, 12, 1,  5, 9, 13, 2, 6, 10, 14,  3,  7, 11, 15, // Round 2
        0, 8, 4, 12, 2, 10, 6, 14, 1, 9,  5, 13,  3, 11,  7, 15  // Round 3
      ];
      
      var decode = BIT32.LSD.decode;
      var encode = BIT32.LSD.encode;
      var padded = BIT32.LSD.padded;
      
      var ROTL = BIT32.ROTL;
      
      var F = function (t, x, y, z) {
        if (t < 16) return (x & y) | ((~x) & z);
        if (t < 32) return (x & y) | (x & z) | (y & z);
        if (t < 48) return (x ^ y ^ z);
      };
      var K = function (t) {
        if (t < 16) return 0x00000000;
        if (t < 32) return 0x5a827999;
        if (t < 48) return 0x6ed9eba1;
      };
      var S = function (t) {
        if (t < 16) return [3, 7, 11, 19][t % 4];
        if (t < 32) return [3, 5,  9, 13][t % 4];
        if (t < 48) return [3, 9, 11, 15][t % 4];
      };
      
      var C = function (t, a, b, c, d, x) {
        return ROTL((a + F(t, b, c, d) + x + K(t)), S(t));
      };
      
      var a, b, c, d, i, t, tmp;
      var x = decode((CGU.Sequence(padded(input))).raw());
        
      for (i = 0; i < x.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        
        for (t = 0; t < 48; t += 1) {
          a = C(t, a, b, c, d, x[i+X[t]]);
          
          tmp = d;
          d = c;
          c = b;
          b = a;
          a = tmp;
        }
        
        HASH[0] += a;
        HASH[1] += b;
        HASH[2] += c;
        HASH[3] += d;
      }
      
      return encode(HASH);
    });
  })();
