/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Crypto :: MD5
**/
  Algos['md5'] = {
    call   : 'md5',
    block  : 64,
    method : function (options) { return Crypto.hash('md5', Type.clone(this), options); },
    algo   : function (input) {
      if (!Type.is_a(input, String)) return;
      
      var HASH = [0x067452301, 0x0efcdab89, 0x098badcfe, 0x010325476];
      
      var S11 = 7;
      var S12 = 12;
      var S13 = 17;
      var S14 = 22;
      var S21 = 5;
      var S22 = 9;
      var S23 = 14;
      var S24 = 20;
      var S31 = 4;
      var S32 = 11;
      var S33 = 16;
      var S34 = 23;
      var S41 = 6;
      var S42 = 10;
      var S43 = 15;
      var S44 = 21;
      
      var decode = FILO.decode;
      var encode = FILO.encode;
      
      var ROTL = CONV.ROTL;
      
      var F = function (x, y, z) { return ((x & y) | ((~x) & z)); };
      var G = function (x, y, z) { return ((x & z) | (y & (~z))); };
      var H = function (x, y, z) { return (x ^ y ^ z); };
      var I = function (x, y, z) { return (y ^ (x | (~z))); };
      
      var C = function (f, a, b, c, d, x, s, ac) {
        return ROTL((a + f(b, c, d) + x + ac), s) + b;
      };
      
      ////////////
      // Init
      var a, b, c, d;
      var x = [], i;
      
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
      while (padding.length < padlen) padding += '\x00';
      
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += (Sequence(encode([bitlen, count]))).str();
      
      ////////////
      // Update
      x = decode((Sequence(input)).raw());
      
      for (i = 0; i < x.length; i += 16) {
        a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3];
        
        // Round 1
        a = C(F, a, b, c, d, x[i+ 0], S11, 0xd76aa478);  // 1
        d = C(F, d, a, b, c, x[i+ 1], S12, 0xe8c7b756);  // 2
        c = C(F, c, d, a, b, x[i+ 2], S13, 0x242070db);  // 3
        b = C(F, b, c, d, a, x[i+ 3], S14, 0xc1bdceee);  // 4
        a = C(F, a, b, c, d, x[i+ 4], S11, 0xf57c0faf);  // 5
        d = C(F, d, a, b, c, x[i+ 5], S12, 0x4787c62a);  // 6
        c = C(F, c, d, a, b, x[i+ 6], S13, 0xa8304613);  // 7
        b = C(F, b, c, d, a, x[i+ 7], S14, 0xfd469501);  // 8
        a = C(F, a, b, c, d, x[i+ 8], S11, 0x698098d8);  // 9
        d = C(F, d, a, b, c, x[i+ 9], S12, 0x8b44f7af);  // 10
        c = C(F, c, d, a, b, x[i+10], S13, 0xffff5bb1);  // 11
        b = C(F, b, c, d, a, x[i+11], S14, 0x895cd7be);  // 12
        a = C(F, a, b, c, d, x[i+12], S11, 0x6b901122);  // 13
        d = C(F, d, a, b, c, x[i+13], S12, 0xfd987193);  // 14
        c = C(F, c, d, a, b, x[i+14], S13, 0xa679438e);  // 15
        b = C(F, b, c, d, a, x[i+15], S14, 0x49b40821);  // 16
        
        // Round 2
        a = C(G, a, b, c, d, x[i+ 1], S21, 0xf61e2562);  // 17
        d = C(G, d, a, b, c, x[i+ 6], S22, 0xc040b340);  // 18
        c = C(G, c, d, a, b, x[i+11], S23, 0x265e5a51);  // 19
        b = C(G, b, c, d, a, x[i+ 0], S24, 0xe9b6c7aa);  // 20
        a = C(G, a, b, c, d, x[i+ 5], S21, 0xd62f105d);  // 21
        d = C(G, d, a, b, c, x[i+10], S22, 0x02441453);  // 22
        c = C(G, c, d, a, b, x[i+15], S23, 0xd8a1e681);  // 23
        b = C(G, b, c, d, a, x[i+ 4], S24, 0xe7d3fbc8);  // 24
        a = C(G, a, b, c, d, x[i+ 9], S21, 0x21e1cde6);  // 25
        d = C(G, d, a, b, c, x[i+14], S22, 0xc33707d6);  // 26
        c = C(G, c, d, a, b, x[i+ 3], S23, 0xf4d50d87);  // 27
        b = C(G, b, c, d, a, x[i+ 8], S24, 0x455a14ed);  // 28
        a = C(G, a, b, c, d, x[i+13], S21, 0xa9e3e905);  // 29
        d = C(G, d, a, b, c, x[i+ 2], S22, 0xfcefa3f8);  // 30
        c = C(G, c, d, a, b, x[i+ 7], S23, 0x676f02d9);  // 31
        b = C(G, b, c, d, a, x[i+12], S24, 0x8d2a4c8a);  // 32
        
        // Round 3
        a = C(H, a, b, c, d, x[i+ 5], S31, 0xfffa3942);  // 33
        d = C(H, d, a, b, c, x[i+ 8], S32, 0x8771f681);  // 34
        c = C(H, c, d, a, b, x[i+11], S33, 0x6d9d6122);  // 35
        b = C(H, b, c, d, a, x[i+14], S34, 0xfde5380c);  // 36
        a = C(H, a, b, c, d, x[i+ 1], S31, 0xa4beea44);  // 37
        d = C(H, d, a, b, c, x[i+ 4], S32, 0x4bdecfa9);  // 38
        c = C(H, c, d, a, b, x[i+ 7], S33, 0xf6bb4b60);  // 39
        b = C(H, b, c, d, a, x[i+10], S34, 0xbebfbc70);  // 40
        a = C(H, a, b, c, d, x[i+13], S31, 0x289b7ec6);  // 41
        d = C(H, d, a, b, c, x[i+ 0], S32, 0xeaa127fa);  // 42
        c = C(H, c, d, a, b, x[i+ 3], S33, 0xd4ef3085);  // 43
        b = C(H, b, c, d, a, x[i+ 6], S34, 0x04881d05);  // 44
        a = C(H, a, b, c, d, x[i+ 9], S31, 0xd9d4d039);  // 45
        d = C(H, d, a, b, c, x[i+12], S32, 0xe6db99e5);  // 46
        c = C(H, c, d, a, b, x[i+15], S33, 0x1fa27cf8);  // 47
        b = C(H, b, c, d, a, x[i+ 2], S34, 0xc4ac5665);  // 48
        
        // Round 4
        a = C(I, a, b, c, d, x[i+ 0], S41, 0xf4292244);  // 49
        d = C(I, d, a, b, c, x[i+ 7], S42, 0x432aff97);  // 50
        c = C(I, c, d, a, b, x[i+14], S43, 0xab9423a7);  // 51
        b = C(I, b, c, d, a, x[i+ 5], S44, 0xfc93a039);  // 52
        a = C(I, a, b, c, d, x[i+12], S41, 0x655b59c3);  // 53
        d = C(I, d, a, b, c, x[i+ 3], S42, 0x8f0ccc92);  // 54
        c = C(I, c, d, a, b, x[i+10], S43, 0xffeff47d);  // 55
        b = C(I, b, c, d, a, x[i+ 1], S44, 0x85845dd1);  // 56
        a = C(I, a, b, c, d, x[i+ 8], S41, 0x6fa87e4f);  // 57
        d = C(I, d, a, b, c, x[i+15], S42, 0xfe2ce6e0);  // 58
        c = C(I, c, d, a, b, x[i+ 6], S43, 0xa3014314);  // 59
        b = C(I, b, c, d, a, x[i+13], S44, 0x4e0811a1);  // 60
        a = C(I, a, b, c, d, x[i+ 4], S41, 0xf7537e82);  // 61
        d = C(I, d, a, b, c, x[i+11], S42, 0xbd3af235);  // 62
        c = C(I, c, d, a, b, x[i+ 2], S43, 0x2ad7d2bb);  // 63
        b = C(I, b, c, d, a, x[i+ 9], S44, 0xeb86d391);  // 64
        
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
