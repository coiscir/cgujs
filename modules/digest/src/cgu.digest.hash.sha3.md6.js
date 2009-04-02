/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - MD6
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function MD6() {
    Algos["md6-224"] = new Hash(64, true, function (input, key) {
      return md6(224, input, key);
    });
    
    Algos["md6-256"] = new Hash(64, true, function (input, key) {
      return md6(256, input, key);
    });
    
    Algos["md6-384"] = new Hash(64, true, function (input, key) {
      return md6(384, input, key);
    });
    
    Algos["md6-512"] = new Hash(64, true, function (input, key) {
      return md6(512, input, key);
    });
    
    var md6 = function (digest, message, key) {
      var decode = BIT64.MSD.decode;
      var encode = BIT64.MSD.encode;
      
      var ROTL = BIT64.ROTL;
      var ROTR = BIT64.ROTR;
      var SHR  = BIT64.SHR;
      var SHL  = BIT64.SHL;
      
      var NEW = BIT64.NEW;
      var ADD = BIT64.ADD;
      var AND = BIT64.AND;
      var OR  = BIT64.OR;
      var XOR = BIT64.XOR;
      var NOT = BIT64.NOT;
      
      // block sizes in bytes
      var b = 512; // (64 * 64 / 8) input block
      var c = 128; // (16 * 64 / 8) compressed block
      
      // word sizes
      var n = 89;
      
      // required arguments
      var d = 0 + digest;
      var M = CGU.Sequence(message).raw();
      
      // prepare key and key length
      var K = key ? key.substr(0, 64) : '';
      var k = K.length;
      while (K.length < 64) K += '\x00'; // should not affect `k`
      K = decode(CGU.Sequence(K).raw());
      
      // calculate default rounds, min 80 with key
      var r = Math.max((k ? 80 : 0), (40 + (d / 4)));
      
      // levels, PAR max and "current"
      var L = 64, ell = 0;
      
      // round constants
      var S0 = [0x01234567, 0x89abcdef];
      var Sm = [0x7311c281, 0x2425cfa0];
      
      // 15 word constant
      var Q = [
        [0x7311c281, 0x2425cfa0], [0x64322864, 0x34aac8e7], [0xb60450e9, 0xef68b7c1],
        [0xe8fb2390, 0x8d9f06f1], [0xdd2e76cb, 0xa691e5bf], [0x0cd0d63b, 0x2c30bc41],
        [0x1f8ccf68, 0x23058f8a], [0x54e5ed5b, 0x88e3775d], [0x4ad12aae, 0x0a6d6031],
        [0x3e7f16bb, 0x88222e0d], [0x8af8671d, 0x3fb50c2c], [0x995ad117, 0x8bd25c31],
        [0xc878c1dd, 0x04c4b633], [0x3b72066c, 0x7a1552ac], [0x0d6f3522, 0x631effcb]
      ];
      
      var f = function (N) {
        var A = [].concat(N);
        var x, S = NEW(S0);
        var i, j, step;
        var t = [17, 18, 21, 31, 67, 89];
        
        var rs = [10,  5, 13, 10, 11, 12,  2,  7, 14, 15,  7, 13, 11, 7, 6, 12];
        var ls = [11, 24,  9, 16, 15,  9, 27, 15,  6,  2, 29,  8, 15, 5, 31, 9];
        
        for (j = 0, i = n; j < r; j += 1) {
          for (step = 0; step < 16; step += 1) {
            x = NEW(S);
            x = XOR(x, A[i + step - t[5]]);
            x = XOR(x, A[i + step - t[0]]);
            x = XOR(x, AND(A[i + step - t[1]], A[i + step - t[2]]));
            x = XOR(x, AND(A[i + step - t[3]], A[i + step - t[4]]));
            x = XOR(x, SHR(x, rs[step]));
            A[i + step] = XOR(x, SHL(x, ls[step]));
          }
          
          S = XOR(XOR(SHL(S, 1), SHR(S, (64-1))), AND(S, Sm));
          i += 16;
        }
        
        return A.slice(A.length - 16);
      };
      
      var PAR = function (M) {
        var B = [], C = [];
        var z = M.length > b ? 0 : 1;
        
        while (M.length > 0) {
          B.push(M.slice(0, b));
          M = M.slice(b);
        }
        
        for (var i = 0, p = 0, N, U, V; i < B.length; i += 1, p = 0) {
          N = [].concat(Q).concat(K);
          
          while (B[i].length < b) {
            B[i].push(0x00);
            p += 8;
          }
          
          //= lllllllliiiiiiiiiiiiiiiiiiiiiiii iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
          U = NEW([
            (
              ((ell & 0xff) << 24) |
              ((i / Math.pow(2, 32)) & 0xffffff)
            ),
            (i & 0xffffffff)
          ]);
          
          //= 0000rrrrrrrrrrrrLLLLLLLLzzzzpppp ppppppppppppkkkkkkkkdddddddddddd
          V = NEW([
            (
              ((r & 0xfff) << 16) |
              ((L & 0xff) << 8) |
              ((z & 0xf) << 4) |
              ((p & 0xf000) >> 12)
            ), (
              ((p & 0xfff) << 20) |
              ((k & 0xff) << 12) |
              (d & 0xfff)
            )
          ]);
          
          C = C.concat(f(N.concat([U,V]).concat(decode(B[i]))));
        }
        
        return encode(C);
      };
      
      //var SEQ = function (M) {};
      
      // level-by-level loop
      do {
        ell += 1;
        M = PAR(M);
        //M = [].concat(ell > L ? SEQ(M) : PAR(M));
      } while (M.length != c);
      
      return M.slice(M.length - (d / 8));
    };
  })();
