/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest
 *  (c) 2008-2009 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD4 (c) 1990 Ronald L. Rivest                                   [RFC 1320]
 *  MD5 (c) 1992 Ronald L. Rivest                                   [RFC 1321]
 *  SHA (c) 2006 The Internet Society                               [RFC 4634]
 *  RIPEMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD6 (c) 2008 Ronald L. Rivest
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Digest() {

  // host & mask
  var Algos = {}, Hash = function (block, keyed, algo) {
    this.algo = algo; this.block = block; this.keyed = keyed;
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - Functions
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  CGU.hash = function (call, data, hkey, utf8) {
    if (!CGU.is_a(call, String)) call = null;
    if (!CGU.is_a(data, String)) data = null;
    if (!CGU.is_a(hkey, String)) hkey = null;
    if (utf8 !== true) utf8 = false;

    if (!(CGU.is_a(Algos[call], Hash) || data === null) return;

    if (utf8) data = CGU.utf8Encode(data);

    return CGU.Sequence(Algos[call].algo(data, hkey));
  };

  CGU.hmac = function (call, data, hkey, utf8) {
    if (!CGU.is_a(call, String)) call = null;
    if (!CGU.is_a(data, String)) data = null;
    if (!CGU.is_a(hkey, String)) hkey = null;
    if (utf8 !== true) utf8 = false;

    if (!(CGU.is_a(Algos[call], Hash) || data === null) return;
    if (Algos[call].keyed || hkey === null) return null;

    if (utf8) data = CGU.utf8Encode(data);

    var akey, ihash, ipad = [], opad = [];
    var block = Algos[call].block, klen = hkey.length;
    if (!(block > 0)) return false;

    akey = CGU.Sequence(klen > block ? Algos[call].algo(hkey) : hkey).raw();
    for (var i = 0; i < block; i += 1) {
      ipad[i] = (akey[i] || 0x00) ^ 0x36;
      opad[i] = (akey[i] || 0x00) ^ 0x5c;
    }

    ipad = CGU.Sequence(ipad).str();
    opad = CGU.Sequence(opad).str();

    ihash = CGU.Sequence(Algos[call].algo(ipad + data)).str();
    return CGU.Sequence(Algos[call].algo(opad + ihash));
  };

  CGU.hashes = function (keyed) {
    keyed = keyed === !!keyed ? keyed : null; // true, false, or null

    var calls = [];
    for (var call in Algos)
      if (Algos[call] instanceof Hash)
        if (keyed === null || Algos[call].keyed == keyed)
          calls.push(call);
    return calls;
  };

  CGU.utf8Encode = function (string) {
    if (typeof(string) !== 'string') return;
    for (var res = '', c, i = 0; i < string.length; i += 1) {
      c = string.charCodeAt(i);
      if (c <= 127) {
        res += String.fromCharCode(c);
      } else if (c <= 2047) {
        res += String.fromCharCode(192 + ((c >> 6) & 0x1f));
        res += String.fromCharCode(128 + ((c >> 0) & 0x3f));
      } else {
        res += String.fromCharCode(224 + ((c >> 12) & 0xf));
        res += String.fromCharCode(128 + ((c >> 6) & 0x3f));
        res += String.fromCharCode(128 + ((c >> 0) & 0x3f));
      }
    }
    return res;
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU JS - Digest - Sequence
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  CGU.Sequence = function (param) {
    // enable new operator shortcut
    if (!(this instanceof CGU.Sequence))
      return new CGU.Sequence(param);

    // enable cloning
    if (param instanceof CGU.Sequence)
      param = param.raw();

    // prepare
    var seq = [];

    if (param instanceof Array)
      (function () {
        for (var i = 0; i < param.length; i += 1)
          seq.push((param[i] & 0xff) || 0x0);
      })();

    if (typeof(param) == 'string')
      (function () {
        for (var i = 0; i < param.length; i += 1)
          seq.push(param.charCodeAt(i) & 0xff);
      })();

    // encodings
    this.raw = function () {
      return [].concat(seq);
    };

    this.str = function () {
      var i, out = '';
      for (i = 0; i < seq.length; i += 1)
        out += String.fromCharCode(seq[i]);
      return out;
    };

    this.hex = function () {
      return this.base16(true);
    };
    this.base16 = function (low) {
      low = low === true ? true : false;

      var hx = ('0123456789' + (low ? 'abcdef' : 'ABCDEF')).split('');
      var i, out = '';
      for (i = 0; i < seq.length; i += 1) {
        out += hx[(seq[i] >> 4) & 0xf] || '?';
        out += hx[(seq[i] >> 0) & 0xf] || '?';
      }
      return out;
    };

    this.base32hex = function () {
      return this.base32(true);
    };
    this.base32 = function (hex) {
      hex = hex === true ? true : false;

      var padl = 8, padc = '=';
      var b32 = (hex ?
        '0123456789abcdefghijklmnopqrstuv' :
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
      ).split('');
      var i, out = '', rem = null;
      for (i = 0; i < seq.length; i += 1) {
      // 0/5
        out += b32[((seq[i] >> 3) & 0x1f) | 0x0] || '?';
        rem = (seq[i] & 0x07) << 2;
        if (!(++i < seq.length)) break;
      // 1/5
        out += b32[((seq[i] >> 6) & 0x03) | rem] || '?';
        out += b32[((seq[i] >> 1) & 0x1f) | 0x0] || '?';
        rem = (seq[i] & 0x01) << 4;
        if (!(++i < seq.length)) break;
      // 2/5
        out += b32[((seq[i] >> 4) & 0x0f) | rem] || '?';
        rem = (seq[i] & 0x0f) << 1;
        if (!(++i < seq.length)) break;
      // 3/5
        out += b32[((seq[i] >> 7) & 0x01) | rem] || '?';
        out += b32[((seq[i] >> 2) & 0x1f) | 0x0] || '?';
        rem (seq[i] & 0x03) << 3;
        if (!(++i < seq.length)) break;
      // 4/5
        out += b32[((seq[i] >> 5) & 0x07) | rem] || '?';
        out += b32[((seq[i] >> 0) & 0x1f) | 0x0] || '?';
        rem = null;
      }
      out += (rem === null) ? '' : (b32[rem] || '?');
      while (padl > 0 && !!(out.length % padl)) out += padc;
      return out;
    };

    this.base64url = function () {
      return this.base64(true);
    };
    this.base64 = function (url) {
      url = url === true ? true : false;

      var padl = 4, padc = '=';
      var b64 = (
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789' +
        (url ? '-_' : '+/')
      ).split('');
      var i, out = '', rem = null;
      for (i = 0; i < seq.length; i += 1) {
      // 0/3
        out += b64[((seq[i] >> 2) & 0x3f) | 0x0] || '?';
        rem = (seq[i] & 0x03) << 4;
        if (!(++i < seq.length)) break;
      // 1/3
        out += b64[((seq[i] >> 4) & 0x0f) | rem] || '?';
        rem = (seq[i] & 0x0f) << 2;
        if (!(++i < seq.length)) break;
      // 2/3
        out += b64[((seq[i] >> 6) & 0x03) | rem] || '?';
        out += b64[((seq[i] >> 0) & 0x3f) | 0x0] || '?';
        rem = null;
      }
      out += (rem === null) ? '' : (b64[rem] || '?');
      while (padl > 0 && !!(out.length % padl)) out += padc;
      return out;
    };

    // override
    this.toString = this.hex;
    this.valueOf = this.raw;
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - 32-Bit Operations
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  var BIT32 = {

    GT : function (a, b) {
      for (var c, d, i = 0; i < 32; i += 1) {
        c = (a >> (31 - i)) & 0x1;
        d = (b >> (31 - i)) & 0x1;
        if (c == d) continue;
        if (c > d) return true;
        if (c < d) break;
      }
      return false;
    },

    LT : function (a, b) {
      for (var c, d, i = 0; i < 32; i += 1) {
        c = (a >> (31 - i)) & 0x1;
        d = (b >> (31 - i)) & 0x1;
        if (c == d) continue;
        if (c < d) return true;
        if (c > d) break;
      }
      return false;
    },

    ROTL : function (x, n) {
      return ((x << n) | (x >>> (32 - n)));
    },

    ROTR : function (x, n) {
      return ((x >>> n) | (x << (32 - n)));
    },

    SHL : function (x, n) {
      return x << n;
    },

    SHR : function (x, n) {
      return x >>> n;
    },

    MSD : {
      decode : function (input) {
        var i, j, output = [];
        for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
          output[i] =
            ((input[j + 0] & 0xff) << 24) |
            ((input[j + 1] & 0xff) << 16) |
            ((input[j + 2] & 0xff) << 8 ) |
            ((input[j + 3] & 0xff) << 0 );
        }
        return output;
      },

      encode : function (input) {
        var i, output = [];
        for (i = 0; i < input.length; i += 1) {
          output.push((input[i] >> 24) & 0xff);
          output.push((input[i] >> 16) & 0xff);
          output.push((input[i] >> 8 ) & 0xff);
          output.push((input[i] >> 0 ) & 0xff);
        }
        return output;
      },

      padded : function (input) {
        var length = input.length;
        var bitlen = length * 8;

        var padding = '\x80';
        var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
        while (padding.length < padlen) padding += '\x00';

        var count = (bitlen / Math.pow(2, 32));
        input += padding;
        input += CGU.Sequence(BIT32.MSD.encode([(count  & 0xffffffff)])).str();
        input += CGU.Sequence(BIT32.MSD.encode([(bitlen & 0xffffffff)])).str();

        return input;
      }
    },

    LSD : {
      decode : function (input) {
        var i, j, output = [];
        for (i = 0, j = 0; j < input.length; i += 1, j = (i * 4)) {
          output[i] = ((input[j]) & 0xff) |
            ((input[j + 1] << 8 ) & 0xff00) |
            ((input[j + 2] << 16) & 0xff0000) |
            ((input[j + 3] << 24) & 0xff000000);
        }
        return output;
      },

      encode : function (input) {
        var i, output = [];
        for (i = 0; i < input.length; i += 1) {
          output.push((input[i] >> 0 ) & 0xff);
          output.push((input[i] >> 8 ) & 0xff);
          output.push((input[i] >> 16) & 0xff);
          output.push((input[i] >> 24) & 0xff);
        }
        return output;
      },

      padded : function (input) {
        var length = input.length;
        var bitlen = length * 8;

        var padding = '\x80';
        var padlen = (((length % 64) < 56 ? 56 : 120) - (length % 64));
        while (padding.length < padlen) padding += '\x00';

        var count = (bitlen / Math.pow(2, 32));
        input += padding;
        input += (CGU.Sequence(BIT32.LSD.encode([bitlen, count]))).str();

        return input;
      }
    }
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - 64-Bit Operations
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  var BIT64 = {

    NEW : function (x) {
      return [x[0] & 0xffffffff, x[1] & 0xffffffff];
    },

    ADD : function (x, y) {
      x = BIT64.NEW(x); y = BIT64.NEW(y);
      var b = x[1] + y[1];
      var a = x[0] + y[0] + (BIT32.LT(b, x[1]) ? 0x1 : 0x0);
      return BIT64.NEW([a, b]);
    },

    MULT : function (x, y) {
      var $ = BIT64.NEW([0x00000000, 0x00000000]);

      for (var i = 0; i < 64; i += 1) {
        if (BIT64.SHR(y, i)[1] & 0x1) {
          $ = BIT64.ADD($, BIT64.SHL(x, i));
        }
      }

      return BIT64.NEW($);
    },

    SUBT : function (x, y) {
      x = BIT64.NEW(x); y = BIT64.NEW(y);
      var b = x[1] - y[1];
      var a = x[0] - y[0] - (BIT32.GT(b, x[1]) ? 0x1 : 0x0);
      return BIT64.NEW([a, b]);
    },

    AND : function (x, y) {
      return BIT64.NEW([x[0] & y[0], x[1] & y[1]]);
    },

    OR : function (x, y) {
      return BIT64.NEW([x[0] | y[0], x[1] | y[1]]);
    },

    XOR : function (x, y) {
      return BIT64.NEW([x[0] ^ y[0], x[1] ^ y[1]]);
    },

    NOT : function (x) {
      return BIT64.NEW([~x[0], ~x[1]]);
    },

    ROTL : function (x, n) {
      return BIT64.OR(BIT64.SHR(x, (64 - n)), BIT64.SHL(x, n));
    },

    ROTR : function (x, n) {
      return BIT64.OR(BIT64.SHR(x, n), BIT64.SHL(x, (64 - n)));
    },

    SHL : function (x, n) {
      var a = x[0];
      var b = x[1];
      var c = n >= 32 ? (b << (n - 32)) :
              n == 0 ? a : ((a << n) | (b >>> (32 - n)));
      var d = n >= 32 ? 0x00000000 : (b << n);
      return BIT64.NEW([c, d]);
    },

    SHR : function (x, n) {
      var a = x[0], b = x[1];
      var c = n >= 32 ? 0x00000000 : (a >>> n);
      var d = n >= 32 ? (a >>> (n - 32)) :
              n == 0 ? b : ((a << (32 - n)) | (b >>> n));
      return BIT64.NEW([c, d]);
    },

    MSD : {
      decode : function (input) {
        var i, j, output = [];
        for (i = 0, j = 0; j < input.length; i += 1, j = (i * 8)) {
          output[i] = [
            ((input[j + 0] & 0xff) << 24) |
            ((input[j + 1] & 0xff) << 16) |
            ((input[j + 2] & 0xff) << 8 ) |
            ((input[j + 3] & 0xff) << 0 ),
            ((input[j + 4] & 0xff) << 24) |
            ((input[j + 5] & 0xff) << 16) |
            ((input[j + 6] & 0xff) << 8 ) |
            ((input[j + 7] & 0xff) << 0 )
          ];
        }
        return output;
      },

      encode : function (input) {
        var i, output = [];
        for (i = 0; i < input.length; i += 1) {
          output.push((input[i][0] >> 24) & 0xff);
          output.push((input[i][0] >> 16) & 0xff);
          output.push((input[i][0] >> 8 ) & 0xff);
          output.push((input[i][0] >> 0 ) & 0xff);
          output.push((input[i][1] >> 24) & 0xff);
          output.push((input[i][1] >> 16) & 0xff);
          output.push((input[i][1] >> 8 ) & 0xff);
          output.push((input[i][1] >> 0 ) & 0xff);
        }
        return output;
      },

      padded : function (input) {
        var length = input.length;
        var bitlen = length * 8;

        var padding = '\x80';
        var padlen = ((length % 128) < 112 ? 112 : 240) - (length % 128);
        while (padding.length < padlen) padding += '\x00';

        var count1 = (bitlen / Math.pow(2, 32));
        var count2 = (count1 / Math.pow(2, 32));
        var count3 = (count2 / Math.pow(2, 32));
        input += padding;
        input += CGU.Sequence(BIT64.MSD.encode([
          [count3 & 0xffffffff, count2 & 0xffffffff],
          [count1 & 0xffffffff, bitlen & 0xffffffff]
        ])).str();

        return input;
      }
    }
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - MD4
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function MD4() {
    Algos.md4 = new Hash(64, false, function (input) {
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

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
      var x = decode(CGU.Sequence(padded(input)).raw());

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

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - MD5
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function MD5() {
    Algos.md5 = new Hash(64, false, function (input) {
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

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

      var decode = BIT32.LSD.decode;
      var encode = BIT32.LSD.encode;
      var padded = BIT32.LSD.padded;

      var ROTL = BIT32.ROTL;

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

      var C = function (t, a, b, c, d, x, ac) {
        return ROTL((a + F(t, b, c, d) + x + ac), S(t)) + b;
      };

      var a, b, c, d, i, t, tmp;
      var x = decode(CGU.Sequence(padded(input)).raw());

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

      return encode(HASH);
    });
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - SHA-1
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function SHA1() {
    Algos.sha1 = new Hash(64, false, function (input) {
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

      var decode = BIT32.MSD.decode;
      var encode = BIT32.MSD.encode;
      var padded = BIT32.MSD.padded;

      var ROTL = BIT32.ROTL;

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

      ////////////
      // Init
      var a, b, c, d, e, tmp;
      var x = [], w = [], i, t;

      ////////////
      // Update
      x = decode((CGU.Sequence(padded(input))).raw());

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
    });
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - SHA-2 (32-Bit) [224, 256]
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function SHA2_32() {
    Algos.sha224 = new Hash(64, false, function (input) {
      var HASH = [
        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
      ];

      return sha2_32(input, HASH, 7);
    });

    Algos.sha256 = new Hash(64, false, function (input) {
      var HASH = [
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
      ];

      return sha2_32(input, HASH, 8);
    });

    var sha2_32 = function (input, HASH, slice) {
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

      var decode = BIT32.MSD.decode;
      var encode = BIT32.MSD.encode;
      var padded = BIT32.MSD.padded;

      var ROTL = BIT32.ROTL;
      var ROTR = BIT32.ROTR;
      var SHR  = BIT32.SHR;

      var BSIG0 = function (x) { return ROTR(x,  2) ^ ROTR(x, 13) ^ ROTR(x, 22); };
      var BSIG1 = function (x) { return ROTR(x,  6) ^ ROTR(x, 11) ^ ROTR(x, 25); };
      var SSIG0 = function (x) { return ROTR(x,  7) ^ ROTR(x, 18) ^ SHR( x,  3); };
      var SSIG1 = function (x) { return ROTR(x, 17) ^ ROTR(x, 19) ^ SHR( x, 10); };

      var CH  = function (x, y, z) { return (x & y) ^ ((~x) & z);        };
      var MAJ = function (x, y, z) { return (x & y) ^ (x & z) ^ (y & z); };

      var a, b, c, d, e, f, g, h, tmp1, tmp2, i, t;
      var w = [], x = decode(CGU.Sequence(padded(input)).raw());

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

      return encode(HASH.slice(0, slice));
    };
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - SHA-2 (64-Bit) [384, 512]
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function SHA2_64() {
    Algos.sha384 = new Hash(128, false, function (input) {
      var HASH = [
        [0xcbbb9d5d, 0xc1059ed8], [0x629a292a, 0x367cd507],
        [0x9159015a, 0x3070dd17], [0x152fecd8, 0xf70e5939],
        [0x67332667, 0xffc00b31], [0x8eb44a87, 0x68581511],
        [0xdb0c2e0d, 0x64f98fa7], [0x47b5481d, 0xbefa4fa4]
      ];

      return sha2_64(input, HASH, 6);
    });

    Algos.sha512 = new Hash(128, false, function (input) {
      var HASH = [
        [0x6a09e667, 0xf3bcc908], [0xbb67ae85, 0x84caa73b],
        [0x3c6ef372, 0xfe94f82b], [0xa54ff53a, 0x5f1d36f1],
        [0x510e527f, 0xade682d1], [0x9b05688c, 0x2b3e6c1f],
        [0x1f83d9ab, 0xfb41bd6b], [0x5be0cd19, 0x137e2179]
      ];

      return sha2_64(input, HASH, 8);
    });

    var sha2_64 = function (input, HASH, slice) {
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

      var decode = BIT64.MSD.decode;
      var encode = BIT64.MSD.encode;
      var padded = BIT64.MSD.padded;

      var ROTL = BIT64.ROTL;
      var ROTR = BIT64.ROTR;
      var SHR  = BIT64.SHR;

      var NEW = BIT64.NEW;
      var ADD = BIT64.ADD;
      var AND = BIT64.AND;
      var OR  = BIT64.OR;
      var XOR = BIT64.XOR;
      var NOT = BIT64.NOT;

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

      var a, b, c, d, e, f, g, h, t1, t2, i, t;
      var w = [], x = decode((CGU.Sequence(padded(input))).raw());

      for (i = 0; i < x.length; i += 16) {
        a = NEW(HASH[0]);
        b = NEW(HASH[1]);
        c = NEW(HASH[2]);
        d = NEW(HASH[3]);
        e = NEW(HASH[4]);
        f = NEW(HASH[5]);
        g = NEW(HASH[6]);
        h = NEW(HASH[7]);

        for (w = [], t = 0; t < 80; t += 1) {
          if (t < 16) {
            w[t] = ADD(x[i+t], [0x0, 0x0]);
          } else {
            w[t] = ADD(ADD(SSIG1(w[t-2]), w[t-7]), ADD(SSIG0(w[t-15]), w[t-16]));
          }

          t1 = ADD(ADD(ADD(h, BSIG1(e)), CH(e, f, g)), ADD(K[t], w[t]));
          t2 = ADD(BSIG0(a), MAJ(a, b, c));
          h = NEW(g);
          g = NEW(f);
          f = NEW(e);
          e = ADD(d, t1);
          d = NEW(c);
          c = NEW(b);
          b = NEW(a);
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

      return encode(HASH.slice(0, slice));
    };
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - RIPEMD-128
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function RIPEMD128() {
    Algos.ripemd128 = new Hash(64, false, function (input) {
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

      var S = [
        11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8, // round 1
         7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12, // round 2
        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5, // round 3
        11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12, // round 4
         8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6, // parallel round 1
         9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11, // parallel round 2
         9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5, // parallel round 3
        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8  // parallel round 4
      ];

      var X = [
         0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, // round 1
         7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8, // round 2
         3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12, // round 3
         1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2, // round 4
         5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12, // parallel round 1
         6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2, // parallel round 2
        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13, // parallel round 3
         8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14  // parallel round 4
      ];

      var decode = BIT32.LSD.decode;
      var encode = BIT32.LSD.encode;
      var padded = BIT32.LSD.padded;

      var ROL = BIT32.ROTL;

      var F = function (t, x, y, z) {
        t = t < 64 ? t : 64 - (t % 64) - 1;
        if (t < 16) return (x ^ y ^ z);
        if (t < 32) return ((x & y) | ((~x) & z));
        if (t < 48) return ((x | (~y)) ^ z);
        if (t < 64) return ((x & z) | (y & (~z)));
      };

      var K = function (t) {
        if (t <  16) return 0x00000000; // FF
        if (t <  32) return 0x5a827999; // GG
        if (t <  48) return 0x6ed9eba1; // HH
        if (t <  64) return 0x8f1bbcdc; // II
        if (t <  80) return 0x50a28be6; // III
        if (t <  96) return 0x5c4dd124; // HHH
        if (t < 112) return 0x6d703ef3; // GGG
        if (t < 128) return 0x00000000; // FFF
      };

      var C = function (t, a, b, c, d, x) {
        return ROL((a + F(t, b, c, d) + x + K(t)), S[t]);
      };

      var aa, bb, cc, dd, aaa, bbb, ccc, ddd, i, t, tmp;
      var x = decode((CGU.Sequence(padded(input))).raw());

      for (i = 0, t = 0; i < x.length; i += 16, t = 0) {
        aa = aaa = HASH[0];
        bb = bbb = HASH[1];
        cc = ccc = HASH[2];
        dd = ddd = HASH[3];

        /* left */
        for (; t < 64; t += 1) {
          aa = C(t, aa, bb, cc, dd, x[i+X[t]]);

          tmp = dd;
          dd = cc;
          cc = bb;
          bb = aa;
          aa = tmp;
        }

        /* right */
        for (; t < 128; t += 1) {
          aaa = C(t, aaa, bbb, ccc, ddd, x[i+X[t]]);

          tmp = ddd;
          ddd = ccc;
          ccc = bbb;
          bbb = aaa;
          aaa = tmp;
        }

        /* combine results */
        ddd     = HASH[1] + cc + ddd;
        HASH[1] = HASH[2] + dd + aaa;
        HASH[2] = HASH[3] + aa + bbb;
        HASH[3] = HASH[0] + bb + ccc;
        HASH[0] = ddd;
      }

      return encode(HASH);
    });
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - RIPEMD-160
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function RIPEMD160() {
    Algos.ripemd160 = new Hash(64, false, function (input) {
      var HASH = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

      var S = [
        11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8, // round 1
         7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12, // round 2
        11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5, // round 3
        11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12, // round 4
         9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6, // round 5
         8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6, // parallel round 1
         9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11, // parallel round 2
         9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5, // parallel round 3
        15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8, // parallel round 4
         8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11  // parallel round 5
      ];

      var X = [
         0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, // round 1
         7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8, // round 2
         3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12, // round 3
         1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2, // round 4
         4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13, // round 5
         5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12, // parallel round 1
         6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2, // parallel round 2
        15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13, // parallel round 3
         8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14, // parallel round 4
        12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11  // parallel round 5
      ];

      var decode = BIT32.LSD.decode;
      var encode = BIT32.LSD.encode;
      var padded = BIT32.LSD.padded;

      var ROL = BIT32.ROTL;

      var F = function (t, x, y, z) {
        t = t < 80 ? t : 80 - (t % 80) - 1;
        if (t <  16) return (x ^ y ^ z);
        if (t <  32) return (x & y) | ((~x) & z);
        if (t <  48) return ((x | (~y)) ^ z);
        if (t <  64) return (x & z) | (y & (~z));
        if (t <  80) return (x ^ (y | (~z)));
      };

      var K = function (t) {
        if (t <  16) return 0x00000000; // FF
        if (t <  32) return 0x5a827999; // GG
        if (t <  48) return 0x6ed9eba1; // HH
        if (t <  64) return 0x8f1bbcdc; // II
        if (t <  80) return 0xa953fd4e; // JJ
        if (t <  96) return 0x50a28be6; // JJJ
        if (t < 112) return 0x5c4dd124; // III
        if (t < 128) return 0x6d703ef3; // HHH
        if (t < 144) return 0x7a6d76e9; // GGG
        if (t < 160) return 0x00000000; // FFF
      };

      var C = function (t, a, b, c, d, e, x) {
        return ROL((a + F(t, b, c, d) + x + K(t)), S[t]) + e;
      };

      var aa, bb, cc, dd, ee, aaa, bbb, ccc, ddd, eee, i, t, tmp;
      var x = decode((CGU.Sequence(padded(input))).raw());

      for (i = 0, t = 0; i < x.length; i += 16, t = 0) {
        aa = aaa = HASH[0];
        bb = bbb = HASH[1];
        cc = ccc = HASH[2];
        dd = ddd = HASH[3];
        ee = eee = HASH[4];

        /* left */
        for (; t < 80; t += 1) {
          aa = C(t, aa, bb, cc, dd, ee, x[i+X[t]]);

          tmp = ee;
          ee = dd;
          dd = ROL(cc, 10);
          cc = bb;
          bb = aa;
          aa = tmp;
        }

        /* right */
        for (; t < 160; t += 1) {
          aaa = C(t, aaa, bbb, ccc, ddd, eee, x[i+X[t]]);

          tmp = eee;
          eee = ddd;
          ddd = ROL(ccc, 10);
          ccc = bbb;
          bbb = aaa;
          aaa = tmp;
        }

        /* combine results */
        ddd     = HASH[1] + cc + ddd;
        HASH[1] = HASH[2] + dd + eee;
        HASH[2] = HASH[3] + ee + aaa;
        HASH[3] = HASH[4] + aa + bbb;
        HASH[4] = HASH[0] + bb + ccc;
        HASH[0] = ddd;
      }

      return encode(HASH);
    });
  })();

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - MD6
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  (function MD6() {
    Algos["md6-224"] = new Hash(0, true, function (input, key) {
      return md6(224, input, key);
    });

    Algos["md6-256"] = new Hash(0, true, function (input, key) {
      return md6(256, input, key);
    });

    Algos["md6-384"] = new Hash(0, true, function (input, key) {
      return md6(384, input, key);
    });

    Algos["md6-512"] = new Hash(0, true, function (input, key) {
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

})();
