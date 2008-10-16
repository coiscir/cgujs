/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: SHA-224
**/
  Algos['sha224'] = {
    call   : 'sha224',
    block  : 64,
    method : function (options) { return Crypto.hash('sha224', Type.clone(this), options); },
    algo   : function (input) {
      if (!Type.is_a(input, String)) return;
      
      var HASH = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
      ];
      var K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
        0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
        0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
        0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
        0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
        0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
        0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
        0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ];
      
      var SHR  = function (x, n) { return x >>> n; };
      var ROTL = function (x, n) { return ((x <<  n) | (x >>> (32 - n))); };
      var ROTR = function (x, n) { return ((x >>> n) | (x <<  (32 - n))); };
      
      var BSIG0 = function (x) { return ROTR(x,  2) ^ ROTR(x, 13) ^ ROTR(x, 22); };
      var BSIG1 = function (x) { return ROTR(x,  6) ^ ROTR(x, 11) ^ ROTR(x, 25); };
      var SSIG0 = function (x) { return ROTR(x,  7) ^ ROTR(x, 18) ^ SHR( x,  3); };
      var SSIG1 = function (x) { return ROTR(x, 17) ^ ROTR(x, 19) ^ SHR( x, 10); };
      
      var CH  = function (x, y, z) { return (x & y) ^ ((~x) & z);        };
      var MAJ = function (x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };
      
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
      
      var a, b, c, d, e, f, g, h, tmp1, tmp2;
      var x = [], w = [], i, t;
      
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += (Sequence(encode([count  & 0xffffffff]))).str();
      input += (Sequence(encode([bitlen & 0xffffffff]))).str();
      
      ////////////
      // Update
      x = decode((Sequence(input)).raw());
      
      for (i = 0; i < x.length; i += 16) {
        a = 0xffffffff & HASH[0];
        b = 0xffffffff & HASH[1];
        c = 0xffffffff & HASH[2];
        d = 0xffffffff & HASH[3];
        e = 0xffffffff & HASH[4];
        f = 0xffffffff & HASH[5];
        g = 0xffffffff & HASH[6];
        h = 0xffffffff & HASH[7];
        
        for (t = 0; t < 64; t += 1) {
          if (t < 16) {
            w[t] = x[i+t] & 0xffffffff;
          } else {
            w[t] = SSIG1(w[t-2]) + w[t-7] + SSIG0(w[t-15]) + w[t-16];
          }
          
          tmp1 = 0xffffffff & (h + BSIG1(e) + CH(e, f, g) + K[t] + w[t]);
          tmp2 = 0xffffffff & (BSIG0(a) + MAJ(a, b, c));
          h = 0xffffffff & (g);
          g = 0xffffffff & (f);
          f = 0xffffffff & (e);
          e = 0xffffffff & (d + tmp1);
          d = 0xffffffff & (c);
          c = 0xffffffff & (b);
          b = 0xffffffff & (a);
          a = 0xffffffff & (tmp1 + tmp2);
        }
        
        HASH[0] += 0xffffffff & a;
        HASH[1] += 0xffffffff & b;
        HASH[2] += 0xffffffff & c;
        HASH[3] += 0xffffffff & d;
        HASH[4] += 0xffffffff & e;
        HASH[5] += 0xffffffff & f;
        HASH[6] += 0xffffffff & g;
        HASH[7] += 0xffffffff & h;
      }
      
      ////////////
      // Final
      return encode(HASH.slice(0, 7));
    }
  };
