/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - MD5
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD5 (c) 1992 R. Rivest                                          [RFC 1321]
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function MD5() {
  
  Algos.md5 = {
    block: 64,
    usekey: false,
    algo: function (input) {
      if (!CGU.is_a(input, String)) return;
      
      var HASH = [0x067452301, 0x0efcdab89, 0x098badcfe, 0x010325476];
      
      var AC = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, // Round 1
        0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
        0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
        0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
        0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, // Round 2
        0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
        0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
        0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, // Round 3
        0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
        0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
        0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
        0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, // Round 4
        0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
        0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
      ];
      var X = [
        0, 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, // Round 1
        1, 6, 11,  0,  5, 10, 15,  4,  9, 14,  3,  8, 13,  2,  7, 12, // Round 2
        5, 8, 11, 14,  1,  4,  7, 10, 13,  0,  3,  6,  9, 12, 15,  2, // Round 3
        0, 7, 14,  5, 12,  3, 10,  1,  8, 15,  6, 13,  4, 11,  2,  9  // Round 4
      ];
      
      var F = function (t, x, y, z) {
        if (t < 16) return (x & y) | ((~x) & z);
        if (t < 32) return (x & z) | (y & (~z));
        if (t < 48) return (x ^ y ^ z);
        if (t < 64) return (y ^ (x | (~z)));
      };
      var S = function (t) {
        if (t < 16) return [7, 12, 17, 22][t % 4];
        if (t < 32) return [5,  9, 14, 20][t % 4];
        if (t < 48) return [4, 11, 16, 23][t % 4];
        if (t < 64) return [6, 10, 15, 21][t % 4];
      };
      
      var decode = BIT32.FILO.decode;
      var encode = BIT32.FILO.encode;
      var padded = BIT32.FILO.padded;
      
      var ROTL = BIT32.ROTL;
      
      var C = function (t, a, b, c, d, x, ac) {
        return ROTL((a + F(t, b, c, d) + x + ac), S(t)) + b;
      };
      
      ////////////
      // Init
      var a, b, c, d;
      var x = [], i, t, tmp;
      
      ////////////
      // Update
      x = decode((Sequence(padded(input))).raw());
        
      for (i = 0; i < x.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        
        for (t = 0; t < 64; t += 1) {
          a = C(t, a, b, c, d, x[i+X[t]], AC[t]);
          
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
      
      ////////////
      // Final
      return encode(HASH);
    }
  };
  
})();
