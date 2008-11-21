/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Crypto :: RIPEMD-160
**/
  Algos['ripemd160'] = {
    call   : 'ripemd160',
    block  : 64,
    method : function (options) { return Crypto.hash('ripemd160', Type.clone(this), options); },
    algo   : function (input) {
      if (!Type.is_a(input, String)) return;
      
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
      
      var decode = FILO.decode;
      var encode = FILO.encode;
      
      var ROL = CONV.ROTL;
      
      var F = function (x, y, z) { return (x ^ y ^ z); };
      var G = function (x, y, z) { return ((x & y) | ((~x) & z)); };
      var H = function (x, y, z) { return ((x | (~y)) ^ z); };
      var I = function (x, y, z) { return ((x & z) | (y & (~z))); };
      var J = function (x, y, z) { return (x ^ (y | (~z))); };
      
      /* left */
      var FF = 0x00000000;
      var GG = 0x5a827999;
      var HH = 0x6ed9eba1;
      var II = 0x8f1bbcdc;
      var JJ = 0xa953fd4e;
      
      /* right */
      var JJJ = 0x50a28be6;
      var III = 0x5c4dd124;
      var HHH = 0x6d703ef3;
      var GGG = 0x7a6d76e9;
      var FFF = 0x00000000;
      
      var C = function (f, k, a, b, c, d, e, x, s) {
        return ROL((a + f(b, c, d) + x + k), s) + e;
      };
      
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
      while (padding.length < padlen) padding += '\x00';
      
      var aa, bb, cc, dd, ee, aaa, bbb, ccc, ddd, eee;
      var x = [], i;
      
      ////////////
      // Init
      var count = (bitlen / Math.pow(2, 32));
      input += padding;
      input += Sequence(encode([bitlen, count])).str();
      
      ////////////
      // Update
      x = decode((Sequence(input)).raw());
      
      for (i = 0; i < x.length; i += 16) {
        aa = aaa = HASH[0];
        bb = bbb = HASH[1];
        cc = ccc = HASH[2];
        dd = ddd = HASH[3];
        ee = eee = HASH[4];
        
        /* round 1 */
        aa = C(F, FF, aa, bb, cc, dd, ee, x[i+ 0], 11);          cc = ROL(cc, 10);
        ee = C(F, FF, ee, aa, bb, cc, dd, x[i+ 1], 14);          bb = ROL(bb, 10);
        dd = C(F, FF, dd, ee, aa, bb, cc, x[i+ 2], 15);          aa = ROL(aa, 10);
        cc = C(F, FF, cc, dd, ee, aa, bb, x[i+ 3], 12);          ee = ROL(ee, 10);
        bb = C(F, FF, bb, cc, dd, ee, aa, x[i+ 4],  5);          dd = ROL(dd, 10);
        aa = C(F, FF, aa, bb, cc, dd, ee, x[i+ 5],  8);          cc = ROL(cc, 10);
        ee = C(F, FF, ee, aa, bb, cc, dd, x[i+ 6],  7);          bb = ROL(bb, 10);
        dd = C(F, FF, dd, ee, aa, bb, cc, x[i+ 7],  9);          aa = ROL(aa, 10);
        cc = C(F, FF, cc, dd, ee, aa, bb, x[i+ 8], 11);          ee = ROL(ee, 10);
        bb = C(F, FF, bb, cc, dd, ee, aa, x[i+ 9], 13);          dd = ROL(dd, 10);
        aa = C(F, FF, aa, bb, cc, dd, ee, x[i+10], 14);          cc = ROL(cc, 10);
        ee = C(F, FF, ee, aa, bb, cc, dd, x[i+11], 15);          bb = ROL(bb, 10);
        dd = C(F, FF, dd, ee, aa, bb, cc, x[i+12],  6);          aa = ROL(aa, 10);
        cc = C(F, FF, cc, dd, ee, aa, bb, x[i+13],  7);          ee = ROL(ee, 10);
        bb = C(F, FF, bb, cc, dd, ee, aa, x[i+14],  9);          dd = ROL(dd, 10);
        aa = C(F, FF, aa, bb, cc, dd, ee, x[i+15],  8);          cc = ROL(cc, 10);
        
        /* round 2 */
        ee = C(G, GG, ee, aa, bb, cc, dd, x[i+ 7],  7);          bb = ROL(bb, 10);
        dd = C(G, GG, dd, ee, aa, bb, cc, x[i+ 4],  6);          aa = ROL(aa, 10);
        cc = C(G, GG, cc, dd, ee, aa, bb, x[i+13],  8);          ee = ROL(ee, 10);
        bb = C(G, GG, bb, cc, dd, ee, aa, x[i+ 1], 13);          dd = ROL(dd, 10);
        aa = C(G, GG, aa, bb, cc, dd, ee, x[i+10], 11);          cc = ROL(cc, 10);
        ee = C(G, GG, ee, aa, bb, cc, dd, x[i+ 6],  9);          bb = ROL(bb, 10);
        dd = C(G, GG, dd, ee, aa, bb, cc, x[i+15],  7);          aa = ROL(aa, 10);
        cc = C(G, GG, cc, dd, ee, aa, bb, x[i+ 3], 15);          ee = ROL(ee, 10);
        bb = C(G, GG, bb, cc, dd, ee, aa, x[i+12],  7);          dd = ROL(dd, 10);
        aa = C(G, GG, aa, bb, cc, dd, ee, x[i+ 0], 12);          cc = ROL(cc, 10);
        ee = C(G, GG, ee, aa, bb, cc, dd, x[i+ 9], 15);          bb = ROL(bb, 10);
        dd = C(G, GG, dd, ee, aa, bb, cc, x[i+ 5],  9);          aa = ROL(aa, 10);
        cc = C(G, GG, cc, dd, ee, aa, bb, x[i+ 2], 11);          ee = ROL(ee, 10);
        bb = C(G, GG, bb, cc, dd, ee, aa, x[i+14],  7);          dd = ROL(dd, 10);
        aa = C(G, GG, aa, bb, cc, dd, ee, x[i+11], 13);          cc = ROL(cc, 10);
        ee = C(G, GG, ee, aa, bb, cc, dd, x[i+ 8], 12);          bb = ROL(bb, 10);
        
        /* round 3 */
        dd = C(H, HH, dd, ee, aa, bb, cc, x[i+ 3], 11);          aa = ROL(aa, 10);
        cc = C(H, HH, cc, dd, ee, aa, bb, x[i+10], 13);          ee = ROL(ee, 10);
        bb = C(H, HH, bb, cc, dd, ee, aa, x[i+14],  6);          dd = ROL(dd, 10);
        aa = C(H, HH, aa, bb, cc, dd, ee, x[i+ 4],  7);          cc = ROL(cc, 10);
        ee = C(H, HH, ee, aa, bb, cc, dd, x[i+ 9], 14);          bb = ROL(bb, 10);
        dd = C(H, HH, dd, ee, aa, bb, cc, x[i+15],  9);          aa = ROL(aa, 10);
        cc = C(H, HH, cc, dd, ee, aa, bb, x[i+ 8], 13);          ee = ROL(ee, 10);
        bb = C(H, HH, bb, cc, dd, ee, aa, x[i+ 1], 15);          dd = ROL(dd, 10);
        aa = C(H, HH, aa, bb, cc, dd, ee, x[i+ 2], 14);          cc = ROL(cc, 10);
        ee = C(H, HH, ee, aa, bb, cc, dd, x[i+ 7],  8);          bb = ROL(bb, 10);
        dd = C(H, HH, dd, ee, aa, bb, cc, x[i+ 0], 13);          aa = ROL(aa, 10);
        cc = C(H, HH, cc, dd, ee, aa, bb, x[i+ 6],  6);          ee = ROL(ee, 10);
        bb = C(H, HH, bb, cc, dd, ee, aa, x[i+13],  5);          dd = ROL(dd, 10);
        aa = C(H, HH, aa, bb, cc, dd, ee, x[i+11], 12);          cc = ROL(cc, 10);
        ee = C(H, HH, ee, aa, bb, cc, dd, x[i+ 5],  7);          bb = ROL(bb, 10);
        dd = C(H, HH, dd, ee, aa, bb, cc, x[i+12],  5);          aa = ROL(aa, 10);
        
        /* round 4 */
        cc = C(I, II, cc, dd, ee, aa, bb, x[i+ 1], 11);          ee = ROL(ee, 10);
        bb = C(I, II, bb, cc, dd, ee, aa, x[i+ 9], 12);          dd = ROL(dd, 10);
        aa = C(I, II, aa, bb, cc, dd, ee, x[i+11], 14);          cc = ROL(cc, 10);
        ee = C(I, II, ee, aa, bb, cc, dd, x[i+10], 15);          bb = ROL(bb, 10);
        dd = C(I, II, dd, ee, aa, bb, cc, x[i+ 0], 14);          aa = ROL(aa, 10);
        cc = C(I, II, cc, dd, ee, aa, bb, x[i+ 8], 15);          ee = ROL(ee, 10);
        bb = C(I, II, bb, cc, dd, ee, aa, x[i+12],  9);          dd = ROL(dd, 10);
        aa = C(I, II, aa, bb, cc, dd, ee, x[i+ 4],  8);          cc = ROL(cc, 10);
        ee = C(I, II, ee, aa, bb, cc, dd, x[i+13],  9);          bb = ROL(bb, 10);
        dd = C(I, II, dd, ee, aa, bb, cc, x[i+ 3], 14);          aa = ROL(aa, 10);
        cc = C(I, II, cc, dd, ee, aa, bb, x[i+ 7],  5);          ee = ROL(ee, 10);
        bb = C(I, II, bb, cc, dd, ee, aa, x[i+15],  6);          dd = ROL(dd, 10);
        aa = C(I, II, aa, bb, cc, dd, ee, x[i+14],  8);          cc = ROL(cc, 10);
        ee = C(I, II, ee, aa, bb, cc, dd, x[i+ 5],  6);          bb = ROL(bb, 10);
        dd = C(I, II, dd, ee, aa, bb, cc, x[i+ 6],  5);          aa = ROL(aa, 10);
        cc = C(I, II, cc, dd, ee, aa, bb, x[i+ 2], 12);          ee = ROL(ee, 10);
        
        /* round 5 */
        bb = C(J, JJ, bb, cc, dd, ee, aa, x[i+ 4],  9);          dd = ROL(dd, 10);
        aa = C(J, JJ, aa, bb, cc, dd, ee, x[i+ 0], 15);          cc = ROL(cc, 10);
        ee = C(J, JJ, ee, aa, bb, cc, dd, x[i+ 5],  5);          bb = ROL(bb, 10);
        dd = C(J, JJ, dd, ee, aa, bb, cc, x[i+ 9], 11);          aa = ROL(aa, 10);
        cc = C(J, JJ, cc, dd, ee, aa, bb, x[i+ 7],  6);          ee = ROL(ee, 10);
        bb = C(J, JJ, bb, cc, dd, ee, aa, x[i+12],  8);          dd = ROL(dd, 10);
        aa = C(J, JJ, aa, bb, cc, dd, ee, x[i+ 2], 13);          cc = ROL(cc, 10);
        ee = C(J, JJ, ee, aa, bb, cc, dd, x[i+10], 12);          bb = ROL(bb, 10);
        dd = C(J, JJ, dd, ee, aa, bb, cc, x[i+14],  5);          aa = ROL(aa, 10);
        cc = C(J, JJ, cc, dd, ee, aa, bb, x[i+ 1], 12);          ee = ROL(ee, 10);
        bb = C(J, JJ, bb, cc, dd, ee, aa, x[i+ 3], 13);          dd = ROL(dd, 10);
        aa = C(J, JJ, aa, bb, cc, dd, ee, x[i+ 8], 14);          cc = ROL(cc, 10);
        ee = C(J, JJ, ee, aa, bb, cc, dd, x[i+11], 11);          bb = ROL(bb, 10);
        dd = C(J, JJ, dd, ee, aa, bb, cc, x[i+ 6],  8);          aa = ROL(aa, 10);
        cc = C(J, JJ, cc, dd, ee, aa, bb, x[i+15],  5);          ee = ROL(ee, 10);
        bb = C(J, JJ, bb, cc, dd, ee, aa, x[i+13],  6);          dd = ROL(dd, 10);
        
        /* parallel round 1 */
        aaa = C(J, JJJ, aaa, bbb, ccc, ddd, eee, x[i+ 5],  8); ccc = ROL(ccc, 10);
        eee = C(J, JJJ, eee, aaa, bbb, ccc, ddd, x[i+14],  9); bbb = ROL(bbb, 10);
        ddd = C(J, JJJ, ddd, eee, aaa, bbb, ccc, x[i+ 7],  9); aaa = ROL(aaa, 10);
        ccc = C(J, JJJ, ccc, ddd, eee, aaa, bbb, x[i+ 0], 11); eee = ROL(eee, 10);
        bbb = C(J, JJJ, bbb, ccc, ddd, eee, aaa, x[i+ 9], 13); ddd = ROL(ddd, 10);
        aaa = C(J, JJJ, aaa, bbb, ccc, ddd, eee, x[i+ 2], 15); ccc = ROL(ccc, 10);
        eee = C(J, JJJ, eee, aaa, bbb, ccc, ddd, x[i+11], 15); bbb = ROL(bbb, 10);
        ddd = C(J, JJJ, ddd, eee, aaa, bbb, ccc, x[i+ 4],  5); aaa = ROL(aaa, 10);
        ccc = C(J, JJJ, ccc, ddd, eee, aaa, bbb, x[i+13],  7); eee = ROL(eee, 10);
        bbb = C(J, JJJ, bbb, ccc, ddd, eee, aaa, x[i+ 6],  7); ddd = ROL(ddd, 10);
        aaa = C(J, JJJ, aaa, bbb, ccc, ddd, eee, x[i+15],  8); ccc = ROL(ccc, 10);
        eee = C(J, JJJ, eee, aaa, bbb, ccc, ddd, x[i+ 8], 11); bbb = ROL(bbb, 10);
        ddd = C(J, JJJ, ddd, eee, aaa, bbb, ccc, x[i+ 1], 14); aaa = ROL(aaa, 10);
        ccc = C(J, JJJ, ccc, ddd, eee, aaa, bbb, x[i+10], 14); eee = ROL(eee, 10);
        bbb = C(J, JJJ, bbb, ccc, ddd, eee, aaa, x[i+ 3], 12); ddd = ROL(ddd, 10);
        aaa = C(J, JJJ, aaa, bbb, ccc, ddd, eee, x[i+12],  6); ccc = ROL(ccc, 10);
        
        /* parallel round 2 */
        eee = C(I, III, eee, aaa, bbb, ccc, ddd, x[i+ 6],  9); bbb = ROL(bbb, 10);
        ddd = C(I, III, ddd, eee, aaa, bbb, ccc, x[i+11], 13); aaa = ROL(aaa, 10);
        ccc = C(I, III, ccc, ddd, eee, aaa, bbb, x[i+ 3], 15); eee = ROL(eee, 10);
        bbb = C(I, III, bbb, ccc, ddd, eee, aaa, x[i+ 7],  7); ddd = ROL(ddd, 10);
        aaa = C(I, III, aaa, bbb, ccc, ddd, eee, x[i+ 0], 12); ccc = ROL(ccc, 10);
        eee = C(I, III, eee, aaa, bbb, ccc, ddd, x[i+13],  8); bbb = ROL(bbb, 10);
        ddd = C(I, III, ddd, eee, aaa, bbb, ccc, x[i+ 5],  9); aaa = ROL(aaa, 10);
        ccc = C(I, III, ccc, ddd, eee, aaa, bbb, x[i+10], 11); eee = ROL(eee, 10);
        bbb = C(I, III, bbb, ccc, ddd, eee, aaa, x[i+14],  7); ddd = ROL(ddd, 10);
        aaa = C(I, III, aaa, bbb, ccc, ddd, eee, x[i+15],  7); ccc = ROL(ccc, 10);
        eee = C(I, III, eee, aaa, bbb, ccc, ddd, x[i+ 8], 12); bbb = ROL(bbb, 10);
        ddd = C(I, III, ddd, eee, aaa, bbb, ccc, x[i+12],  7); aaa = ROL(aaa, 10);
        ccc = C(I, III, ccc, ddd, eee, aaa, bbb, x[i+ 4],  6); eee = ROL(eee, 10);
        bbb = C(I, III, bbb, ccc, ddd, eee, aaa, x[i+ 9], 15); ddd = ROL(ddd, 10);
        aaa = C(I, III, aaa, bbb, ccc, ddd, eee, x[i+ 1], 13); ccc = ROL(ccc, 10);
        eee = C(I, III, eee, aaa, bbb, ccc, ddd, x[i+ 2], 11); bbb = ROL(bbb, 10);
        
        /* parallel round 3 */
        ddd = C(H, HHH, ddd, eee, aaa, bbb, ccc, x[i+15],  9); aaa = ROL(aaa, 10);
        ccc = C(H, HHH, ccc, ddd, eee, aaa, bbb, x[i+ 5],  7); eee = ROL(eee, 10);
        bbb = C(H, HHH, bbb, ccc, ddd, eee, aaa, x[i+ 1], 15); ddd = ROL(ddd, 10);
        aaa = C(H, HHH, aaa, bbb, ccc, ddd, eee, x[i+ 3], 11); ccc = ROL(ccc, 10);
        eee = C(H, HHH, eee, aaa, bbb, ccc, ddd, x[i+ 7],  8); bbb = ROL(bbb, 10);
        ddd = C(H, HHH, ddd, eee, aaa, bbb, ccc, x[i+14],  6); aaa = ROL(aaa, 10);
        ccc = C(H, HHH, ccc, ddd, eee, aaa, bbb, x[i+ 6],  6); eee = ROL(eee, 10);
        bbb = C(H, HHH, bbb, ccc, ddd, eee, aaa, x[i+ 9], 14); ddd = ROL(ddd, 10);
        aaa = C(H, HHH, aaa, bbb, ccc, ddd, eee, x[i+11], 12); ccc = ROL(ccc, 10);
        eee = C(H, HHH, eee, aaa, bbb, ccc, ddd, x[i+ 8], 13); bbb = ROL(bbb, 10);
        ddd = C(H, HHH, ddd, eee, aaa, bbb, ccc, x[i+12],  5); aaa = ROL(aaa, 10);
        ccc = C(H, HHH, ccc, ddd, eee, aaa, bbb, x[i+ 2], 14); eee = ROL(eee, 10);
        bbb = C(H, HHH, bbb, ccc, ddd, eee, aaa, x[i+10], 13); ddd = ROL(ddd, 10);
        aaa = C(H, HHH, aaa, bbb, ccc, ddd, eee, x[i+ 0], 13); ccc = ROL(ccc, 10);
        eee = C(H, HHH, eee, aaa, bbb, ccc, ddd, x[i+ 4],  7); bbb = ROL(bbb, 10);
        ddd = C(H, HHH, ddd, eee, aaa, bbb, ccc, x[i+13],  5); aaa = ROL(aaa, 10);
        
        /* parallel round 4 */
        ccc = C(G, GGG, ccc, ddd, eee, aaa, bbb, x[i+ 8], 15); eee = ROL(eee, 10);
        bbb = C(G, GGG, bbb, ccc, ddd, eee, aaa, x[i+ 6],  5); ddd = ROL(ddd, 10);
        aaa = C(G, GGG, aaa, bbb, ccc, ddd, eee, x[i+ 4],  8); ccc = ROL(ccc, 10);
        eee = C(G, GGG, eee, aaa, bbb, ccc, ddd, x[i+ 1], 11); bbb = ROL(bbb, 10);
        ddd = C(G, GGG, ddd, eee, aaa, bbb, ccc, x[i+ 3], 14); aaa = ROL(aaa, 10);
        ccc = C(G, GGG, ccc, ddd, eee, aaa, bbb, x[i+11], 14); eee = ROL(eee, 10);
        bbb = C(G, GGG, bbb, ccc, ddd, eee, aaa, x[i+15],  6); ddd = ROL(ddd, 10);
        aaa = C(G, GGG, aaa, bbb, ccc, ddd, eee, x[i+ 0], 14); ccc = ROL(ccc, 10);
        eee = C(G, GGG, eee, aaa, bbb, ccc, ddd, x[i+ 5],  6); bbb = ROL(bbb, 10);
        ddd = C(G, GGG, ddd, eee, aaa, bbb, ccc, x[i+12],  9); aaa = ROL(aaa, 10);
        ccc = C(G, GGG, ccc, ddd, eee, aaa, bbb, x[i+ 2], 12); eee = ROL(eee, 10);
        bbb = C(G, GGG, bbb, ccc, ddd, eee, aaa, x[i+13],  9); ddd = ROL(ddd, 10);
        aaa = C(G, GGG, aaa, bbb, ccc, ddd, eee, x[i+ 9], 12); ccc = ROL(ccc, 10);
        eee = C(G, GGG, eee, aaa, bbb, ccc, ddd, x[i+ 7],  5); bbb = ROL(bbb, 10);
        ddd = C(G, GGG, ddd, eee, aaa, bbb, ccc, x[i+10], 15); aaa = ROL(aaa, 10);
        ccc = C(G, GGG, ccc, ddd, eee, aaa, bbb, x[i+14],  8); eee = ROL(eee, 10);
        
        /* parallel round 5 */
        bbb = C(F, FFF, bbb, ccc, ddd, eee, aaa, x[i+12],  8); ddd = ROL(ddd, 10);
        aaa = C(F, FFF, aaa, bbb, ccc, ddd, eee, x[i+15],  5); ccc = ROL(ccc, 10);
        eee = C(F, FFF, eee, aaa, bbb, ccc, ddd, x[i+10], 12); bbb = ROL(bbb, 10);
        ddd = C(F, FFF, ddd, eee, aaa, bbb, ccc, x[i+ 4],  9); aaa = ROL(aaa, 10);
        ccc = C(F, FFF, ccc, ddd, eee, aaa, bbb, x[i+ 1], 12); eee = ROL(eee, 10);
        bbb = C(F, FFF, bbb, ccc, ddd, eee, aaa, x[i+ 5],  5); ddd = ROL(ddd, 10);
        aaa = C(F, FFF, aaa, bbb, ccc, ddd, eee, x[i+ 8], 14); ccc = ROL(ccc, 10);
        eee = C(F, FFF, eee, aaa, bbb, ccc, ddd, x[i+ 7],  6); bbb = ROL(bbb, 10);
        ddd = C(F, FFF, ddd, eee, aaa, bbb, ccc, x[i+ 6],  8); aaa = ROL(aaa, 10);
        ccc = C(F, FFF, ccc, ddd, eee, aaa, bbb, x[i+ 2], 13); eee = ROL(eee, 10);
        bbb = C(F, FFF, bbb, ccc, ddd, eee, aaa, x[i+13],  6); ddd = ROL(ddd, 10);
        aaa = C(F, FFF, aaa, bbb, ccc, ddd, eee, x[i+14],  5); ccc = ROL(ccc, 10);
        eee = C(F, FFF, eee, aaa, bbb, ccc, ddd, x[i+ 0], 15); bbb = ROL(bbb, 10);
        ddd = C(F, FFF, ddd, eee, aaa, bbb, ccc, x[i+ 3], 13); aaa = ROL(aaa, 10);
        ccc = C(F, FFF, ccc, ddd, eee, aaa, bbb, x[i+ 9], 11); eee = ROL(eee, 10);
        bbb = C(F, FFF, bbb, ccc, ddd, eee, aaa, x[i+11], 11); ddd = ROL(ddd, 10);
        
        /* combine results */
        ddd     = HASH[1] + cc + ddd;
        HASH[1] = HASH[2] + dd + eee;
        HASH[2] = HASH[3] + ee + aaa;
        HASH[3] = HASH[4] + aa + bbb;
        HASH[4] = HASH[0] + bb + ccc;
        HASH[0] = ddd;
      }
      
      ////////////
      // Final
      return encode(HASH);
    }
  };
