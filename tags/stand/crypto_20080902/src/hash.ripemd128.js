/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: RIPEMD-128
**/
Crypto.register({
  call  : 'ripemd128',
  block : 64,
  algo  : function (input) {
    if (!Crypto.Type.isof(input, 'string')) return;
    
    var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
    
    var ROL = function (x, n) { return ((x << n) | (x >>> (32 - n))); };
    
    var F = function (x, y, z) { return (x ^ y ^ z); };
    var G = function (x, y, z) { return ((x & y) | ((~x) & z)); };
    var H = function (x, y, z) { return ((x | (~y)) ^ z); };
    var I = function (x, y, z) { return ((x & z) | (y & (~z))); };
    
    /* left */
    var FF = 0x00000000;
    var GG = 0x5a827999;
    var HH = 0x6ed9eba1;
    var II = 0x8f1bbcdc;
    
    /* right */
    var III = 0x50a28be6;
    var HHH = 0x5c4dd124;
    var GGG = 0x6d703ef3;
    var FFF = 0x00000000;
    
    var C = function (f, k, a, b, c, d, x, s) {
      return ROL((a + f(b, c, d) + x + k), s);
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
    
    var length = input.length;
    var bitlen = length * 8;
    
    var padding = '\x80';
    var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
    while (padding.length < padlen) padding += '\x00';
    
    var aa, bb, cc, dd, aaa, bbb, ccc, ddd;
    var x = [], i;
    
    ////////////
    // Init
    var count = (bitlen / Math.pow(2, 32));
    input += padding;
    input += Crypto.Sequence(encode([bitlen, count])).str();
    
    ////////////
    // Update
    x = decode((Crypto.Sequence(input)).raw());
    
    for (i = 0; i < x.length; i += 16) {
      aa = aaa = HASH[0];
      bb = bbb = HASH[1];
      cc = ccc = HASH[2];
      dd = ddd = HASH[3];
      
      /* round 1 */
      aa = C(F, FF, aa, bb, cc, dd, x[i+ 0], 11);
      dd = C(F, FF, dd, aa, bb, cc, x[i+ 1], 14);
      cc = C(F, FF, cc, dd, aa, bb, x[i+ 2], 15);
      bb = C(F, FF, bb, cc, dd, aa, x[i+ 3], 12);
      aa = C(F, FF, aa, bb, cc, dd, x[i+ 4],  5);
      dd = C(F, FF, dd, aa, bb, cc, x[i+ 5],  8);
      cc = C(F, FF, cc, dd, aa, bb, x[i+ 6],  7);
      bb = C(F, FF, bb, cc, dd, aa, x[i+ 7],  9);
      aa = C(F, FF, aa, bb, cc, dd, x[i+ 8], 11);
      dd = C(F, FF, dd, aa, bb, cc, x[i+ 9], 13);
      cc = C(F, FF, cc, dd, aa, bb, x[i+10], 14);
      bb = C(F, FF, bb, cc, dd, aa, x[i+11], 15);
      aa = C(F, FF, aa, bb, cc, dd, x[i+12],  6);
      dd = C(F, FF, dd, aa, bb, cc, x[i+13],  7);
      cc = C(F, FF, cc, dd, aa, bb, x[i+14],  9);
      bb = C(F, FF, bb, cc, dd, aa, x[i+15],  8);
      
      /* round 2 */
      aa = C(G, GG, aa, bb, cc, dd, x[i+ 7],  7);
      dd = C(G, GG, dd, aa, bb, cc, x[i+ 4],  6);
      cc = C(G, GG, cc, dd, aa, bb, x[i+13],  8);
      bb = C(G, GG, bb, cc, dd, aa, x[i+ 1], 13);
      aa = C(G, GG, aa, bb, cc, dd, x[i+10], 11);
      dd = C(G, GG, dd, aa, bb, cc, x[i+ 6],  9);
      cc = C(G, GG, cc, dd, aa, bb, x[i+15],  7);
      bb = C(G, GG, bb, cc, dd, aa, x[i+ 3], 15);
      aa = C(G, GG, aa, bb, cc, dd, x[i+12],  7);
      dd = C(G, GG, dd, aa, bb, cc, x[i+ 0], 12);
      cc = C(G, GG, cc, dd, aa, bb, x[i+ 9], 15);
      bb = C(G, GG, bb, cc, dd, aa, x[i+ 5],  9);
      aa = C(G, GG, aa, bb, cc, dd, x[i+ 2], 11);
      dd = C(G, GG, dd, aa, bb, cc, x[i+14],  7);
      cc = C(G, GG, cc, dd, aa, bb, x[i+11], 13);
      bb = C(G, GG, bb, cc, dd, aa, x[i+ 8], 12);
      
      /* round 3 */
      aa = C(H, HH, aa, bb, cc, dd, x[i+ 3], 11);
      dd = C(H, HH, dd, aa, bb, cc, x[i+10], 13);
      cc = C(H, HH, cc, dd, aa, bb, x[i+14],  6);
      bb = C(H, HH, bb, cc, dd, aa, x[i+ 4],  7);
      aa = C(H, HH, aa, bb, cc, dd, x[i+ 9], 14);
      dd = C(H, HH, dd, aa, bb, cc, x[i+15],  9);
      cc = C(H, HH, cc, dd, aa, bb, x[i+ 8], 13);
      bb = C(H, HH, bb, cc, dd, aa, x[i+ 1], 15);
      aa = C(H, HH, aa, bb, cc, dd, x[i+ 2], 14);
      dd = C(H, HH, dd, aa, bb, cc, x[i+ 7],  8);
      cc = C(H, HH, cc, dd, aa, bb, x[i+ 0], 13);
      bb = C(H, HH, bb, cc, dd, aa, x[i+ 6],  6);
      aa = C(H, HH, aa, bb, cc, dd, x[i+13],  5);
      dd = C(H, HH, dd, aa, bb, cc, x[i+11], 12);
      cc = C(H, HH, cc, dd, aa, bb, x[i+ 5],  7);
      bb = C(H, HH, bb, cc, dd, aa, x[i+12],  5);
      
      /* round 4 */
      aa = C(I, II, aa, bb, cc, dd, x[i+ 1], 11);
      dd = C(I, II, dd, aa, bb, cc, x[i+ 9], 12);
      cc = C(I, II, cc, dd, aa, bb, x[i+11], 14);
      bb = C(I, II, bb, cc, dd, aa, x[i+10], 15);
      aa = C(I, II, aa, bb, cc, dd, x[i+ 0], 14);
      dd = C(I, II, dd, aa, bb, cc, x[i+ 8], 15);
      cc = C(I, II, cc, dd, aa, bb, x[i+12],  9);
      bb = C(I, II, bb, cc, dd, aa, x[i+ 4],  8);
      aa = C(I, II, aa, bb, cc, dd, x[i+13],  9);
      dd = C(I, II, dd, aa, bb, cc, x[i+ 3], 14);
      cc = C(I, II, cc, dd, aa, bb, x[i+ 7],  5);
      bb = C(I, II, bb, cc, dd, aa, x[i+15],  6);
      aa = C(I, II, aa, bb, cc, dd, x[i+14],  8);
      dd = C(I, II, dd, aa, bb, cc, x[i+ 5],  6);
      cc = C(I, II, cc, dd, aa, bb, x[i+ 6],  5);
      bb = C(I, II, bb, cc, dd, aa, x[i+ 2], 12);
      
      /* parallel round 1 */
      aaa = C(I, III, aaa, bbb, ccc, ddd, x[i+ 5],  8);
      ddd = C(I, III, ddd, aaa, bbb, ccc, x[i+14],  9);
      ccc = C(I, III, ccc, ddd, aaa, bbb, x[i+ 7],  9);
      bbb = C(I, III, bbb, ccc, ddd, aaa, x[i+ 0], 11);
      aaa = C(I, III, aaa, bbb, ccc, ddd, x[i+ 9], 13);
      ddd = C(I, III, ddd, aaa, bbb, ccc, x[i+ 2], 15);
      ccc = C(I, III, ccc, ddd, aaa, bbb, x[i+11], 15);
      bbb = C(I, III, bbb, ccc, ddd, aaa, x[i+ 4],  5);
      aaa = C(I, III, aaa, bbb, ccc, ddd, x[i+13],  7);
      ddd = C(I, III, ddd, aaa, bbb, ccc, x[i+ 6],  7);
      ccc = C(I, III, ccc, ddd, aaa, bbb, x[i+15],  8);
      bbb = C(I, III, bbb, ccc, ddd, aaa, x[i+ 8], 11);
      aaa = C(I, III, aaa, bbb, ccc, ddd, x[i+ 1], 14);
      ddd = C(I, III, ddd, aaa, bbb, ccc, x[i+10], 14);
      ccc = C(I, III, ccc, ddd, aaa, bbb, x[i+ 3], 12);
      bbb = C(I, III, bbb, ccc, ddd, aaa, x[i+12],  6);
      
      /* parallel round 2 */
      aaa = C(H, HHH, aaa, bbb, ccc, ddd, x[i+ 6],  9);
      ddd = C(H, HHH, ddd, aaa, bbb, ccc, x[i+11], 13);
      ccc = C(H, HHH, ccc, ddd, aaa, bbb, x[i+ 3], 15);
      bbb = C(H, HHH, bbb, ccc, ddd, aaa, x[i+ 7],  7);
      aaa = C(H, HHH, aaa, bbb, ccc, ddd, x[i+ 0], 12);
      ddd = C(H, HHH, ddd, aaa, bbb, ccc, x[i+13],  8);
      ccc = C(H, HHH, ccc, ddd, aaa, bbb, x[i+ 5],  9);
      bbb = C(H, HHH, bbb, ccc, ddd, aaa, x[i+10], 11);
      aaa = C(H, HHH, aaa, bbb, ccc, ddd, x[i+14],  7);
      ddd = C(H, HHH, ddd, aaa, bbb, ccc, x[i+15],  7);
      ccc = C(H, HHH, ccc, ddd, aaa, bbb, x[i+ 8], 12);
      bbb = C(H, HHH, bbb, ccc, ddd, aaa, x[i+12],  7);
      aaa = C(H, HHH, aaa, bbb, ccc, ddd, x[i+ 4],  6);
      ddd = C(H, HHH, ddd, aaa, bbb, ccc, x[i+ 9], 15);
      ccc = C(H, HHH, ccc, ddd, aaa, bbb, x[i+ 1], 13);
      bbb = C(H, HHH, bbb, ccc, ddd, aaa, x[i+ 2], 11);
      
      /* parallel round 3 */
      aaa = C(G, GGG, aaa, bbb, ccc, ddd, x[i+15],  9);
      ddd = C(G, GGG, ddd, aaa, bbb, ccc, x[i+ 5],  7);
      ccc = C(G, GGG, ccc, ddd, aaa, bbb, x[i+ 1], 15);
      bbb = C(G, GGG, bbb, ccc, ddd, aaa, x[i+ 3], 11);
      aaa = C(G, GGG, aaa, bbb, ccc, ddd, x[i+ 7],  8);
      ddd = C(G, GGG, ddd, aaa, bbb, ccc, x[i+14],  6);
      ccc = C(G, GGG, ccc, ddd, aaa, bbb, x[i+ 6],  6);
      bbb = C(G, GGG, bbb, ccc, ddd, aaa, x[i+ 9], 14);
      aaa = C(G, GGG, aaa, bbb, ccc, ddd, x[i+11], 12);
      ddd = C(G, GGG, ddd, aaa, bbb, ccc, x[i+ 8], 13);
      ccc = C(G, GGG, ccc, ddd, aaa, bbb, x[i+12],  5);
      bbb = C(G, GGG, bbb, ccc, ddd, aaa, x[i+ 2], 14);
      aaa = C(G, GGG, aaa, bbb, ccc, ddd, x[i+10], 13);
      ddd = C(G, GGG, ddd, aaa, bbb, ccc, x[i+ 0], 13);
      ccc = C(G, GGG, ccc, ddd, aaa, bbb, x[i+ 4],  7);
      bbb = C(G, GGG, bbb, ccc, ddd, aaa, x[i+13],  5);
      
      /* parallel round 4 */
      aaa = C(F, FFF, aaa, bbb, ccc, ddd, x[i+ 8], 15);
      ddd = C(F, FFF, ddd, aaa, bbb, ccc, x[i+ 6],  5);
      ccc = C(F, FFF, ccc, ddd, aaa, bbb, x[i+ 4],  8);
      bbb = C(F, FFF, bbb, ccc, ddd, aaa, x[i+ 1], 11);
      aaa = C(F, FFF, aaa, bbb, ccc, ddd, x[i+ 3], 14);
      ddd = C(F, FFF, ddd, aaa, bbb, ccc, x[i+11], 14);
      ccc = C(F, FFF, ccc, ddd, aaa, bbb, x[i+15],  6);
      bbb = C(F, FFF, bbb, ccc, ddd, aaa, x[i+ 0], 14);
      aaa = C(F, FFF, aaa, bbb, ccc, ddd, x[i+ 5],  6);
      ddd = C(F, FFF, ddd, aaa, bbb, ccc, x[i+12],  9);
      ccc = C(F, FFF, ccc, ddd, aaa, bbb, x[i+ 2], 12);
      bbb = C(F, FFF, bbb, ccc, ddd, aaa, x[i+13],  9);
      aaa = C(F, FFF, aaa, bbb, ccc, ddd, x[i+ 9], 12);
      ddd = C(F, FFF, ddd, aaa, bbb, ccc, x[i+ 7],  5);
      ccc = C(F, FFF, ccc, ddd, aaa, bbb, x[i+10], 15);
      bbb = C(F, FFF, bbb, ccc, ddd, aaa, x[i+14],  8);
      
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
});
