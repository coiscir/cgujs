/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: SHA-1
**/
Crypto.register({
  call  : 'sha1',
  block : 64,
  algo  : function (input) {
    if (!Crypto.Type.isof(input, 'string')) return;
    
    var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    
    var ROTL = function (x, n) { return ((x << n) | (x >>> (32 - n))); };
    
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
    
    var decode = function (input) {
      var i, j, output = [];
      for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
        output[i] = 
          ((input[j + 0] & 0xff) << 24) |
          ((input[j + 1] & 0xff) << 16) |
          ((input[j + 2] & 0xff) << 8 ) |
          ((input[j + 3] & 0xff) << 0 );
      }
      return output;
    };
    var encode = function (input) {
      var i, output = [];
      for (i = 0; i < input.length; i += 1) {
        output.push((input[i] >> 24) & 0xff);
        output.push((input[i] >> 16) & 0xff);
        output.push((input[i] >> 8 ) & 0xff);
        output.push((input[i] >> 0 ) & 0xff);
      }
      return output;
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
    input += Crypto.Sequence(encode([(count  & 0xffffff)])).str();
    input += Crypto.Sequence(encode([(bitlen & 0xffffff)])).str();
    
    ////////////
    // Update
    x = decode((Crypto.Sequence(input)).raw());
    
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
});
