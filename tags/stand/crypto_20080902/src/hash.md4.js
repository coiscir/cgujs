/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: MD4
**/
Crypto.register({
  call  : 'md4',
  block : 64,
  algo  : function (input) {
    if (!Crypto.Type.isof(input, 'string')) return;
    
    var HASH = [0x067452301, 0x0efcdab89, 0x098badcfe, 0x010325476];
    
    var S11 = 3;
    var S12 = 7;
    var S13 = 11;
    var S14 = 19;
    var S21 = 3;
    var S22 = 5;
    var S23 = 9;
    var S24 = 13;
    var S31 = 3;
    var S32 = 9;
    var S33 = 11;
    var S34 = 15;
    
    var ROTL = function (x, n) { return ((x << n) | (x >>> (32 - n))); };
    
    var F = function (x, y, z) { return ((x & y) | ((~x) & z)); };
    var G = function (x, y, z) { return ((x & y) | (x & z) | (y & z)); };
    var H = function (x, y, z) { return (x ^ y ^ z); };
    
    var FF = 0x00000000;
    var GG = 0x5a827999;
    var HH = 0x6ed9eba1;
    
    var C = function (f, k, a, b, c, d, x, s) {
      return ROTL((a + f(b, c, d) + x + k), s);
    };
    
    var decode = function (input) {
      var i, j, output = [];
      for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
        output[i] = ((input[j]) & 0xff) |
          ((input[j + 1] << 8 ) & 0xff00) |
          ((input[j + 2] << 16) & 0xff0000) |
          ((input[j + 3] << 24) & 0xff000000);
      }
      return output;
    };
    var encode = function (input) {
      var i, output = [];
      for (i = 0; i < input.length; i += 1) {
        output.push((input[i] >> 0 ) & 0xff);
        output.push((input[i] >> 8 ) & 0xff);
        output.push((input[i] >> 16) & 0xff);
        output.push((input[i] >> 24) & 0xff);
      }
      return output;
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
    input += (Crypto.Sequence(encode([bitlen, count]))).str();
    
    ////////////
    // Update
    x = decode((Crypto.Sequence(input)).raw());
      
    for (i = 0; i < x.length; i += 16) {
      a = HASH[0], b = HASH[1], c = HASH[2], d = HASH[3];
      
      // Round 1
      a = C(F, FF, a, b, c, d, x[i+ 0], S11);  // 1
      d = C(F, FF, d, a, b, c, x[i+ 1], S12);  // 2
      c = C(F, FF, c, d, a, b, x[i+ 2], S13);  // 3
      b = C(F, FF, b, c, d, a, x[i+ 3], S14);  // 4
      a = C(F, FF, a, b, c, d, x[i+ 4], S11);  // 5
      d = C(F, FF, d, a, b, c, x[i+ 5], S12);  // 6
      c = C(F, FF, c, d, a, b, x[i+ 6], S13);  // 7
      b = C(F, FF, b, c, d, a, x[i+ 7], S14);  // 8
      a = C(F, FF, a, b, c, d, x[i+ 8], S11);  // 9
      d = C(F, FF, d, a, b, c, x[i+ 9], S12);  // 10
      c = C(F, FF, c, d, a, b, x[i+10], S13);  // 11
      b = C(F, FF, b, c, d, a, x[i+11], S14);  // 12
      a = C(F, FF, a, b, c, d, x[i+12], S11);  // 13
      d = C(F, FF, d, a, b, c, x[i+13], S12);  // 14
      c = C(F, FF, c, d, a, b, x[i+14], S13);  // 15
      b = C(F, FF, b, c, d, a, x[i+15], S14);  // 16
      
      // Round 2
      a = C(G, GG, a, b, c, d, x[i+ 0], S21);  // 17
      d = C(G, GG, d, a, b, c, x[i+ 4], S22);  // 18
      c = C(G, GG, c, d, a, b, x[i+ 8], S23);  // 19
      b = C(G, GG, b, c, d, a, x[i+12], S24);  // 20
      a = C(G, GG, a, b, c, d, x[i+ 1], S21);  // 21
      d = C(G, GG, d, a, b, c, x[i+ 5], S22);  // 22
      c = C(G, GG, c, d, a, b, x[i+ 9], S23);  // 23
      b = C(G, GG, b, c, d, a, x[i+13], S24);  // 24
      a = C(G, GG, a, b, c, d, x[i+ 2], S21);  // 25
      d = C(G, GG, d, a, b, c, x[i+ 6], S22);  // 26
      c = C(G, GG, c, d, a, b, x[i+10], S23);  // 27
      b = C(G, GG, b, c, d, a, x[i+14], S24);  // 28
      a = C(G, GG, a, b, c, d, x[i+ 3], S21);  // 29
      d = C(G, GG, d, a, b, c, x[i+ 7], S22);  // 30
      c = C(G, GG, c, d, a, b, x[i+11], S23);  // 31
      b = C(G, GG, b, c, d, a, x[i+15], S24);  // 32
      
      // Round 3
      a = C(H, HH, a, b, c, d, x[i+ 0], S31);  // 33
      d = C(H, HH, d, a, b, c, x[i+ 8], S32);  // 34
      c = C(H, HH, c, d, a, b, x[i+ 4], S33);  // 35
      b = C(H, HH, b, c, d, a, x[i+12], S34);  // 36
      a = C(H, HH, a, b, c, d, x[i+ 2], S31);  // 37
      d = C(H, HH, d, a, b, c, x[i+10], S32);  // 38
      c = C(H, HH, c, d, a, b, x[i+ 6], S33);  // 39
      b = C(H, HH, b, c, d, a, x[i+14], S34);  // 40
      a = C(H, HH, a, b, c, d, x[i+ 1], S31);  // 41
      d = C(H, HH, d, a, b, c, x[i+ 9], S32);  // 42
      c = C(H, HH, c, d, a, b, x[i+ 5], S33);  // 43
      b = C(H, HH, b, c, d, a, x[i+13], S34);  // 44
      a = C(H, HH, a, b, c, d, x[i+ 3], S31);  // 45
      d = C(H, HH, d, a, b, c, x[i+11], S32);  // 46
      c = C(H, HH, c, d, a, b, x[i+ 7], S33);  // 47
      b = C(H, HH, b, c, d, a, x[i+15], S34);  // 48
      
      HASH[0] += a;
      HASH[1] += b;
      HASH[2] += c;
      HASH[3] += d;
    }
    
    ////////////
    // Final
    return encode(HASH);
  }
});
