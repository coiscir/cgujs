(function SHA512() {
  
  Algos.sha512 = {
    block: 64,
    algo: function (input) {
      if (!CGU.is_a(input, String)) return;
      
      var HASH = [
        [0x6a09e667, 0xf3bcc908], [0xbb67ae85, 0x84caa73b],
        [0x3c6ef372, 0xfe94f82b], [0xa54ff53a, 0x5f1d36f1],
        [0x510e527f, 0xade682d1], [0x9b05688c, 0x2b3e6c1f],
        [0x1f83d9ab, 0xfb41bd6b], [0x5be0cd19, 0x137e2179]
      ];
    
      var K = [
        [0x428a2f98, 0xd728ae22], [0x71374491, 0x23ef65cd],
        [0xb5c0fbcf, 0xec4d3b2f], [0xe9b5dba5, 0x8189dbbc],
        [0x3956c25b, 0xf348b538], [0x59f111f1, 0xb605d019],
        [0x923f82a4, 0xaf194f9b], [0xab1c5ed5, 0xda6d8118],
        [0xd807aa98, 0xa3030242], [0x12835b01, 0x45706fbe],
        [0x243185be, 0x4ee4b28c], [0x550c7dc3, 0xd5ffb4e2],
        [0x72be5d74, 0xf27b896f], [0x80deb1fe, 0x3b1696b1],
        [0x9bdc06a7, 0x25c71235], [0xc19bf174, 0xcf692694],
        [0xe49b69c1, 0x9ef14ad2], [0xefbe4786, 0x384f25e3],
        [0x0fc19dc6, 0x8b8cd5b5], [0x240ca1cc, 0x77ac9c65],
        [0x2de92c6f, 0x592b0275], [0x4a7484aa, 0x6ea6e483],
        [0x5cb0a9dc, 0xbd41fbd4], [0x76f988da, 0x831153b5],
        [0x983e5152, 0xee66dfab], [0xa831c66d, 0x2db43210],
        [0xb00327c8, 0x98fb213f], [0xbf597fc7, 0xbeef0ee4],
        [0xc6e00bf3, 0x3da88fc2], [0xd5a79147, 0x930aa725],
        [0x06ca6351, 0xe003826f], [0x14292967, 0x0a0e6e70],
        [0x27b70a85, 0x46d22ffc], [0x2e1b2138, 0x5c26c926],
        [0x4d2c6dfc, 0x5ac42aed], [0x53380d13, 0x9d95b3df],
        [0x650a7354, 0x8baf63de], [0x766a0abb, 0x3c77b2a8],
        [0x81c2c92e, 0x47edaee6], [0x92722c85, 0x1482353b],
        [0xa2bfe8a1, 0x4cf10364], [0xa81a664b, 0xbc423001],
        [0xc24b8b70, 0xd0f89791], [0xc76c51a3, 0x0654be30],
        [0xd192e819, 0xd6ef5218], [0xd6990624, 0x5565a910],
        [0xf40e3585, 0x5771202a], [0x106aa070, 0x32bbd1b8],
        [0x19a4c116, 0xb8d2d0c8], [0x1e376c08, 0x5141ab53],
        [0x2748774c, 0xdf8eeb99], [0x34b0bcb5, 0xe19b48a8],
        [0x391c0cb3, 0xc5c95a63], [0x4ed8aa4a, 0xe3418acb],
        [0x5b9cca4f, 0x7763e373], [0x682e6ff3, 0xd6b2b8a3],
        [0x748f82ee, 0x5defb2fc], [0x78a5636f, 0x43172f60],
        [0x84c87814, 0xa1f0ab72], [0x8cc70208, 0x1a6439ec],
        [0x90befffa, 0x23631e28], [0xa4506ceb, 0xde82bde9],
        [0xbef9a3f7, 0xb2c67915], [0xc67178f2, 0xe372532b],
        [0xca273ece, 0xea26619c], [0xd186b8c7, 0x21c0c207],
        [0xeada7dd6, 0xcde0eb1e], [0xf57d4f7f, 0xee6ed178],
        [0x06f067aa, 0x72176fba], [0x0a637dc5, 0xa2c898a6],
        [0x113f9804, 0xbef90dae], [0x1b710b35, 0x131c471b],
        [0x28db77f5, 0x23047d84], [0x32caab7b, 0x40c72493],
        [0x3c9ebe0a, 0x15c9bebc], [0x431d67c4, 0x9c100d4c],
        [0x4cc5d4be, 0xcb3e42b6], [0x597f299c, 0xfc657e2a],
        [0x5fcb6fab, 0x3ad6faec], [0x6c44198c, 0x4a475817]
      ];
      
      var decode = BIT64.FIFO.decode;
      var encode = BIT64.FIFO.encode;
      
      var ROTL = BIT64.CONV.ROTL;
      var ROTR = BIT64.CONV.ROTR;
      var SHR  = BIT64.CONV.SHR;
      
      var ADD = BIT64.OPER.ADD;
      var AND = BIT64.OPER.AND;
      var OR  = BIT64.OPER.OR;
      var XOR = BIT64.OPER.XOR;
      var NOT = BIT64.OPER.NOT;
      
      var CH = function (x, y, z) {
        return XOR(AND(x, y), AND(NOT(x), z));
      };
      var MAJ = function (x, y, z) {
        return XOR(XOR(AND(x, y), AND(x, z)), AND(y, z));
      };
      
      var BSIG0 = function (x) {
        return XOR(XOR(ROTR(x, 28), ROTR(x, 34)), ROTR(x, 39));
      };
      var BSIG1 = function (x) {
        return XOR(XOR(ROTR(x, 14), ROTR(x, 18)), ROTR(x, 41));
      };
      var SSIG0 = function (x) {
        return XOR(XOR(ROTR(x,  1), ROTR(x,  8)), SHR(x, 7));
      };
      var SSIG1 = function (x) {
        return XOR(XOR(ROTR(x, 19), ROTR(x, 61)), SHR(x, 6));
      };
      
      ////////////
      // Init
      var length = input.length;
      var bitlen = length * 8;
      
      var padding = '\x80';
      var padlen = ((length % 128) < 112 ? 112 : 240) - (length % 128);
      while (padding.length < padlen) padding += '\x00';
      
      var a, b, c, d, e, f, g, h, t1, t2;
      var x = [], w = [], i, t;
      
      var count1 = (bitlen / Math.pow(2, 32));
      var count2 = (count1 / Math.pow(2, 32));
      var count3 = (count2 / Math.pow(2, 32));
      input += padding;
      input += Sequence(encode([[count3 & 0xffffffff, count2 & 0xffffffff]])).str();
      input += Sequence(encode([[count1 & 0xffffffff, bitlen & 0xffffffff]])).str();
      
      ////////////
      // Update
      x = decode((Sequence(input)).raw());
      
      for (i = 0; i < x.length; i += 16) {
        a = ADD(HASH[0], [0x0, 0x0]);
        b = ADD(HASH[1], [0x0, 0x0]);
        c = ADD(HASH[2], [0x0, 0x0]);
        d = ADD(HASH[3], [0x0, 0x0]);
        e = ADD(HASH[4], [0x0, 0x0]);
        f = ADD(HASH[5], [0x0, 0x0]);
        g = ADD(HASH[6], [0x0, 0x0]);
        h = ADD(HASH[7], [0x0, 0x0]);
        
        for (w = [], t = 0; t < 80; t += 1) {
          if (t < 16) {
            w[t] = ADD(x[i+t], [0x0, 0x0]);
          } else {
            w[t] = ADD(ADD(ADD(SSIG1(w[t-2]), w[t-7]), SSIG0(w[t-15])), w[t-16]);
          }
          
          t1 = ADD(ADD(ADD(ADD(h, BSIG1(e)), CH(e, f, g)), K[t]), w[t]);
          t2 = ADD(BSIG0(a), MAJ(a, b, c));
          h = ADD(g, [0x0, 0x0]);
          g = ADD(f, [0x0, 0x0]);
          f = ADD(e, [0x0, 0x0]);
          e = ADD(d, t1);
          d = ADD(c, [0x0, 0x0]);
          c = ADD(b, [0x0, 0x0]);
          b = ADD(a, [0x0, 0x0]);
          a = ADD(t1, t2);
        }
        
        HASH[0] = ADD(HASH[0], a);
        HASH[1] = ADD(HASH[1], b);
        HASH[2] = ADD(HASH[2], c);
        HASH[3] = ADD(HASH[3], d);
        HASH[4] = ADD(HASH[4], e);
        HASH[5] = ADD(HASH[5], f);
        HASH[6] = ADD(HASH[6], g);
        HASH[7] = ADD(HASH[7], h);
      }
      
      return encode(HASH);
    }
  };
  
})();
