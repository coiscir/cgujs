/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript Library
 *  (c) 2008 Jonathan Lonowski
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto
 *    Cryptographic Hash and HMAC Algorithms
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * MD4 (c) 1990 R. Rivest                                             [RFC 1320]
 * MD5 (c) 1992 R. Rivest                                             [RFC 1321]
 * SHA (c) 2006 The Internet Society                                  [RFC 4634]
 * RMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
**/

var Crypto = new (function () {
  this.Version = '8.1015';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Core
**/
  var ftoi  = function (num)  { return num - (num % 1); };
  var ready = function (call) { return call.replace(/^\s+|\s+$/g, '').toLowerCase(); };
  var valid = function (call) { return (/^[\$\_a-z][\$\_a-z0-9]*$/i).test(call); };

  var Algos = {};

  this.algos = function (hmac) {
    hmac = Type.limit(hmac, 'boolean') || false;

    var list = [];
    for (var call in Algos)
      if (Algos.propertyIsEnumerable(call))
        if (!hmac || Algos[call].block > 0)
          list.push(Type.clone(call));
    return list;
  };

  this.search = function (call, hmac) {
    call = Type.limit(call, 'string')  ||    '';
    hmac = Type.limit(hmac, 'boolean') || false;

    var CALL = ready(call), a, algos = Type.clone(this.algos());
    if (!valid(CALL)) return;
    for (a = 0; a < algos.length; a += 1)
      if (algos[a] === CALL && (!hmac || Algos[call].block > 0))
        return true;
    return false;
  };

  this.methodize = function (call) {
    call = ready(Type.limit(call, 'string') || '');
    if (!this.search(call)) return;

    if (String.prototype[call] === Algos[call].method) return true;
    if (Type.isof(String.prototype[call], 'null', 'undefined')) {
      String.prototype[call] = Algos[call].method;
      return true;
    }
    return false;
  };

  this.hash = function (call, data, options) {
    call = Type.limit(call, 'string') || '';
    data = Type.limit(data, 'string');
    options = (function (o) { return {
      unicode : (Type.limit(o.unicode, 'boolean') || false),
      key     : (Type.limit(o.key,     'string'))
    };})(options || {});

    return Sequence((function () {
      call = ready(call);
      if (!valid(call) || !Type.is_a(data, 'string')) return;

      // check for call
      if (!Crypto.search(call)) return false;

      // verify ascii data
      if (options.unicode) {
        data = (function () {
          for (var out = '', i = 0; i < data.length; i += 1) {
            out += String.fromCharCode((data.charCodeAt(i) >> 8) & 0xff);
            out += String.fromCharCode((data.charCodeAt(i) >> 0) & 0xff);
          }
          return out;
        })();
      } else {
        if (data.match(/[^\x00-\xff]/)) return false;
      }

      // revise data with HMAC key
      if (Type.is_a(options.key, 'string')) {
        if (!Crypto.search(call, true)) return false;
        data = (function (data, key) {
          var block = Algos[call].block, klen = key.length;
          var akey, i, ipad = [], opad = [];

          akey = Sequence(klen > block ? Algos[call].algo(key) : key).raw();
          for (i = 0; i < block && Type.is_a(akey, 'array'); i += 1) {
            ipad[i] = (akey[i] || 0x00) ^ 0x36;
            opad[i] = (akey[i] || 0x00) ^ 0x5C;
          }

          var ihash = Algos[call].algo(Sequence(ipad).str() + data);
          return Sequence(opad).str() + Sequence(ihash).str();
        })(data, options.key);
      }

      // final hash
      return Algos[call].algo(data);
    })());
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Sequence
**/
  var Sequence = function (param) {
    // enable new operator shortcut
    if (!(this instanceof Sequence)) return new Sequence(param);

    // enable cloning
    if (param instanceof Sequence) param = param.raw();

    var sequence = (function () {
      if (Type.isof(param, 'undefined', 'null')) return undefined;

      switch (Type.get(param)) {
      case 'array':
        return (function (arr) {
          for (var i = 0; i < arr.length; i += 1) {
            if (typeof arr[i] !== 'number')  return null;
            if (arr[i] < 0 || arr[i] > 0xff) return null;
            arr[i] -= arr[i] % 1;
          }
          return [].concat(arr);
        })(param);

      case 'number':
        return (function (num) {
          var seq = [], i;
          num -= num % 1;
          if (isNaN(num)) return null;
          if (num === 0) return [0];
          while (num > 0) {
            seq.unshift(num & 0xff);
            num /= 256;
            num -= num % 1;
          }
          return seq;
        })(param);

      case 'string':
        return (function (str) {
          var seq = [], i;
          if (param.match(/[\u0100-\uffff]/)) return null;
          for (i = 0; i < str.length; i += 1) {
            seq.push(str.charCodeAt(i) & 0xff);
          }
          return seq;
        })(param);

      default: return null;
      }
    })();

    this.valid = function () {
      return Type.is_a(sequence, 'array');
    };

    this.raw = function () {
      if (!this.valid()) return sequence;

      return [].concat(sequence);
    };

    this.str = function () {
      if (!this.valid()) return sequence;

      return (function (input) {
        var output = '', i;
        for (i = 0; i < input.length; i += 1) {
          output += String.fromCharCode(input[i] & 0xff);
        }
        return output;
      })(sequence);
    };

    this.hex = function () {
      return this.base16(true);
    };
    this.base16 = function (low) {
      if (!this.valid()) return sequence;

      low = low === true ? true : false;

      return (function (input) {
        var hx = ''.concat(
          '0123456789',
          (low ? 'abcdef' : 'ABCDEF')
        ).split('');
        var output = '', i;
        for (i = 0; i < input.length; i += 1) {
          output += hx[(input[i] >> 4) & 0xf] || '?';
          output += hx[(input[i] >> 0) & 0xf] || '?';
        }
        return output;
      })(sequence);
    };

    this.base32 = function (hex) {
      if (!this.valid()) return sequence;

      hex = hex === true ? true : false;

      return (function (input) {
        var b32 = (hex ?
          '0123456789abcdefghijklmnopqrstuv' :
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
        ).split('');
        var padchar = '=';
        var padwidth = 8;
        var output = '', i, rem = null;
        for (i = 0; i < input.length; i += 1) {
          switch (i % 5) {
          case 0:
            output += b32[((input[i] >> 3) & 0x1f) | 0x0] || '?';
            rem = (input[i] & 0x07) << 2;
            break;
          case 1:
            output += b32[((input[i] >> 6) & 0x03) | rem] || '?';
            output += b32[((input[i] >> 1) & 0x1f) | 0x0] || '?';
            rem = (input[i] & 0x01) << 4;
            break;
          case 2:
            output += b32[((input[i] >> 4) & 0x0f) | rem] || '?';
            rem = (input[i] & 0x0f) << 1;
            break;
          case 3:
            output += b32[((input[i] >> 7) & 0x01) | rem] || '?';
            output += b32[((input[i] >> 2) & 0x1f) | 0x0] || '?';
            rem = (input[i] & 0x03) << 3;
            break;
          case 4:
            output += b32[((input[i] >> 5) & 0x07) | rem] || '?';
            output += b32[((input[i] >> 0) & 0x1f) | 0x0] || '?';
            rem = null;
            break;
          }
        }
        output += (rem === null ? '' : (b32[rem] || '?'));
        while (!!(output.length % padwidth)) output += padchar;
        return output;
      })(sequence);
    };
    this.base32hex = function () {
      return this.base32(true);
    };

    this.base64 = function (url) {
      if (!this.valid()) return sequence;

      url = url === true ? true : false;

      return (function (input) {
        var b64 = ''.concat(
          'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          'abcdefghijklmnopqrstuvwxyz',
          '0123456789',
          (url ? '-_' : '+/')
        ).split('');
        var padchar = '=';
        var padwidth = 4;
        var output = '', i, rem = null;
        for (i = 0; i < input.length; i += 1) {
          switch (i % 3) {
          case 0:
            output += b64[((input[i] >> 2) & 0x3f) | 0x0] || '?';
            rem = (input[i] & 0x03) << 4;
            break;
          case 1:
            output += b64[((input[i] >> 4) & 0x0f) | rem] || '?';
            rem = (input[i] & 0x0f) << 2;
            break;
          case 2:
            output += b64[((input[i] >> 6) & 0x03) | rem] || '?';
            output += b64[((input[i] >> 0) & 0x3f) | 0x0] || '?';
            rem = null;
            break;
          }
        }
        output += (rem === null ? '' : (b64[rem] || '?'));
        while (!!(output.length % padwidth)) output += padchar;
        return output;
      })(sequence);
    };
    this.base64url = function () {
      return this.base64(true);
    };

    this.valueOf  = this.raw;
    this.toString = this.hex;
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Algorithms
**/
Algos['md4']={call:'md4',block:64,method:function(options){return Crypto.hash('md4',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x067452301,0x0efcdab89,0x098badcfe,0x010325476];var S11=3;var S12=7;var S13=11;var S14=19;var S21=3;var S22=5;var S23=9;var S24=13;var S31=3;var S32=9;var S33=11;var S34=15;var ROTL=function(x,n){return((x<<n)|(x>>>(32-n)));};var F=function(x,y,z){return((x&y)|((~x)&z));};var G=function(x,y,z){return((x&y)|(x&z)|(y&z));};var H=function(x,y,z){return(x^y^z);};var FF=0x00000000;var GG=0x5a827999;var HH=0x6ed9eba1;var C=function(f,k,a,b,c,d,x,s){return ROTL((a+f(b,c,d)+x+k),s);};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j])&0xff)|((input[j+1]<<8)&0xff00)|((input[j+2]<<16)&0xff0000)|((input[j+3]<<24)&0xff000000);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>0)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>24)&0xff);}return output;};var a,b,c,d;var x=[],i;var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var count=(bitlen/Math.pow(2,32));input+=padding;input+=(Sequence(encode([bitlen,count]))).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){a=HASH[0],b=HASH[1],c=HASH[2],d=HASH[3];a=C(F,FF,a,b,c,d,x[i+0],S11);d=C(F,FF,d,a,b,c,x[i+1],S12);c=C(F,FF,c,d,a,b,x[i+2],S13);b=C(F,FF,b,c,d,a,x[i+3],S14);a=C(F,FF,a,b,c,d,x[i+4],S11);d=C(F,FF,d,a,b,c,x[i+5],S12);c=C(F,FF,c,d,a,b,x[i+6],S13);b=C(F,FF,b,c,d,a,x[i+7],S14);a=C(F,FF,a,b,c,d,x[i+8],S11);d=C(F,FF,d,a,b,c,x[i+9],S12);c=C(F,FF,c,d,a,b,x[i+10],S13);b=C(F,FF,b,c,d,a,x[i+11],S14);a=C(F,FF,a,b,c,d,x[i+12],S11);d=C(F,FF,d,a,b,c,x[i+13],S12);c=C(F,FF,c,d,a,b,x[i+14],S13);b=C(F,FF,b,c,d,a,x[i+15],S14);a=C(G,GG,a,b,c,d,x[i+0],S21);d=C(G,GG,d,a,b,c,x[i+4],S22);c=C(G,GG,c,d,a,b,x[i+8],S23);b=C(G,GG,b,c,d,a,x[i+12],S24);a=C(G,GG,a,b,c,d,x[i+1],S21);d=C(G,GG,d,a,b,c,x[i+5],S22);c=C(G,GG,c,d,a,b,x[i+9],S23);b=C(G,GG,b,c,d,a,x[i+13],S24);a=C(G,GG,a,b,c,d,x[i+2],S21);d=C(G,GG,d,a,b,c,x[i+6],S22);c=C(G,GG,c,d,a,b,x[i+10],S23);b=C(G,GG,b,c,d,a,x[i+14],S24);a=C(G,GG,a,b,c,d,x[i+3],S21);d=C(G,GG,d,a,b,c,x[i+7],S22);c=C(G,GG,c,d,a,b,x[i+11],S23);b=C(G,GG,b,c,d,a,x[i+15],S24);a=C(H,HH,a,b,c,d,x[i+0],S31);d=C(H,HH,d,a,b,c,x[i+8],S32);c=C(H,HH,c,d,a,b,x[i+4],S33);b=C(H,HH,b,c,d,a,x[i+12],S34);a=C(H,HH,a,b,c,d,x[i+2],S31);d=C(H,HH,d,a,b,c,x[i+10],S32);c=C(H,HH,c,d,a,b,x[i+6],S33);b=C(H,HH,b,c,d,a,x[i+14],S34);a=C(H,HH,a,b,c,d,x[i+1],S31);d=C(H,HH,d,a,b,c,x[i+9],S32);c=C(H,HH,c,d,a,b,x[i+5],S33);b=C(H,HH,b,c,d,a,x[i+13],S34);a=C(H,HH,a,b,c,d,x[i+3],S31);d=C(H,HH,d,a,b,c,x[i+11],S32);c=C(H,HH,c,d,a,b,x[i+7],S33);b=C(H,HH,b,c,d,a,x[i+15],S34);HASH[0]+=a;HASH[1]+=b;HASH[2]+=c;HASH[3]+=d;}return encode(HASH);}};
Algos['md5']={call:'md5',block:64,method:function(options){return Crypto.hash('md5',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x067452301,0x0efcdab89,0x098badcfe,0x010325476];var S11=7;var S12=12;var S13=17;var S14=22;var S21=5;var S22=9;var S23=14;var S24=20;var S31=4;var S32=11;var S33=16;var S34=23;var S41=6;var S42=10;var S43=15;var S44=21;var ROTL=function(x,n){return((x<<n)|(x>>>(32-n)));};var F=function(x,y,z){return((x&y)|((~x)&z));};var G=function(x,y,z){return((x&z)|(y&(~z)));};var H=function(x,y,z){return(x^y^z);};var I=function(x,y,z){return(y^(x|(~z)));};var C=function(f,a,b,c,d,x,s,ac){return ROTL((a+f(b,c,d)+x+ac),s)+b;};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j])&0xff)|((input[j+1]<<8)&0xff00)|((input[j+2]<<16)&0xff0000)|((input[j+3]<<24)&0xff000000);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>0)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>24)&0xff);}return output;};var a,b,c,d;var x=[],i;var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var count=(bitlen/Math.pow(2,32));input+=padding;input+=(Sequence(encode([bitlen,count]))).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){a=HASH[0],b=HASH[1],c=HASH[2],d=HASH[3];a=C(F,a,b,c,d,x[i+0],S11,0xd76aa478);d=C(F,d,a,b,c,x[i+1],S12,0xe8c7b756);c=C(F,c,d,a,b,x[i+2],S13,0x242070db);b=C(F,b,c,d,a,x[i+3],S14,0xc1bdceee);a=C(F,a,b,c,d,x[i+4],S11,0xf57c0faf);d=C(F,d,a,b,c,x[i+5],S12,0x4787c62a);c=C(F,c,d,a,b,x[i+6],S13,0xa8304613);b=C(F,b,c,d,a,x[i+7],S14,0xfd469501);a=C(F,a,b,c,d,x[i+8],S11,0x698098d8);d=C(F,d,a,b,c,x[i+9],S12,0x8b44f7af);c=C(F,c,d,a,b,x[i+10],S13,0xffff5bb1);b=C(F,b,c,d,a,x[i+11],S14,0x895cd7be);a=C(F,a,b,c,d,x[i+12],S11,0x6b901122);d=C(F,d,a,b,c,x[i+13],S12,0xfd987193);c=C(F,c,d,a,b,x[i+14],S13,0xa679438e);b=C(F,b,c,d,a,x[i+15],S14,0x49b40821);a=C(G,a,b,c,d,x[i+1],S21,0xf61e2562);d=C(G,d,a,b,c,x[i+6],S22,0xc040b340);c=C(G,c,d,a,b,x[i+11],S23,0x265e5a51);b=C(G,b,c,d,a,x[i+0],S24,0xe9b6c7aa);a=C(G,a,b,c,d,x[i+5],S21,0xd62f105d);d=C(G,d,a,b,c,x[i+10],S22,0x02441453);c=C(G,c,d,a,b,x[i+15],S23,0xd8a1e681);b=C(G,b,c,d,a,x[i+4],S24,0xe7d3fbc8);a=C(G,a,b,c,d,x[i+9],S21,0x21e1cde6);d=C(G,d,a,b,c,x[i+14],S22,0xc33707d6);c=C(G,c,d,a,b,x[i+3],S23,0xf4d50d87);b=C(G,b,c,d,a,x[i+8],S24,0x455a14ed);a=C(G,a,b,c,d,x[i+13],S21,0xa9e3e905);d=C(G,d,a,b,c,x[i+2],S22,0xfcefa3f8);c=C(G,c,d,a,b,x[i+7],S23,0x676f02d9);b=C(G,b,c,d,a,x[i+12],S24,0x8d2a4c8a);a=C(H,a,b,c,d,x[i+5],S31,0xfffa3942);d=C(H,d,a,b,c,x[i+8],S32,0x8771f681);c=C(H,c,d,a,b,x[i+11],S33,0x6d9d6122);b=C(H,b,c,d,a,x[i+14],S34,0xfde5380c);a=C(H,a,b,c,d,x[i+1],S31,0xa4beea44);d=C(H,d,a,b,c,x[i+4],S32,0x4bdecfa9);c=C(H,c,d,a,b,x[i+7],S33,0xf6bb4b60);b=C(H,b,c,d,a,x[i+10],S34,0xbebfbc70);a=C(H,a,b,c,d,x[i+13],S31,0x289b7ec6);d=C(H,d,a,b,c,x[i+0],S32,0xeaa127fa);c=C(H,c,d,a,b,x[i+3],S33,0xd4ef3085);b=C(H,b,c,d,a,x[i+6],S34,0x04881d05);a=C(H,a,b,c,d,x[i+9],S31,0xd9d4d039);d=C(H,d,a,b,c,x[i+12],S32,0xe6db99e5);c=C(H,c,d,a,b,x[i+15],S33,0x1fa27cf8);b=C(H,b,c,d,a,x[i+2],S34,0xc4ac5665);a=C(I,a,b,c,d,x[i+0],S41,0xf4292244);d=C(I,d,a,b,c,x[i+7],S42,0x432aff97);c=C(I,c,d,a,b,x[i+14],S43,0xab9423a7);b=C(I,b,c,d,a,x[i+5],S44,0xfc93a039);a=C(I,a,b,c,d,x[i+12],S41,0x655b59c3);d=C(I,d,a,b,c,x[i+3],S42,0x8f0ccc92);c=C(I,c,d,a,b,x[i+10],S43,0xffeff47d);b=C(I,b,c,d,a,x[i+1],S44,0x85845dd1);a=C(I,a,b,c,d,x[i+8],S41,0x6fa87e4f);d=C(I,d,a,b,c,x[i+15],S42,0xfe2ce6e0);c=C(I,c,d,a,b,x[i+6],S43,0xa3014314);b=C(I,b,c,d,a,x[i+13],S44,0x4e0811a1);a=C(I,a,b,c,d,x[i+4],S41,0xf7537e82);d=C(I,d,a,b,c,x[i+11],S42,0xbd3af235);c=C(I,c,d,a,b,x[i+2],S43,0x2ad7d2bb);b=C(I,b,c,d,a,x[i+9],S44,0xeb86d391);HASH[0]+=a;HASH[1]+=b;HASH[2]+=c;HASH[3]+=d;}return encode(HASH);}};

Algos['sha1']={call:'sha1',block:64,method:function(options){return Crypto.hash('sha1',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0];var ROTL=function(x,n){return((x<<n)|(x>>>(32-n)));};var F=function(t,b,c,d){if(t<20)return(b&c)|((~b)&d);if(t<40)return(b^c^d);if(t<60)return(b&c)|(b&d)|(c&d);if(t<80)return(b^c^d);};var K=function(t){if(t<20)return 0x5a827999;if(t<40)return 0x6ed9eba1;if(t<60)return 0x8f1bbcdc;if(t<80)return 0xca62c1d6;};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j+0]&0xff)<<24)|((input[j+1]&0xff)<<16)|((input[j+2]&0xff)<<8)|((input[j+3]&0xff)<<0);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>24)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>0)&0xff);}return output;};var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var a,b,c,d,e,tmp;var x=[],w=[],i,t;var count=(bitlen/Math.pow(2,32));input+=padding;input+=Sequence(encode([(count&0xffffff)])).str();input+=Sequence(encode([(bitlen&0xffffff)])).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){a=HASH[0];b=HASH[1];c=HASH[2];d=HASH[3];e=HASH[4];for(t=0;t<80;t+=1){if(t<16){w[t]=x[i+t];}else{w[t]=ROTL((w[t-3]^w[t-8]^w[t-14]^w[t-16]),1);}tmp=(ROTL(a,5)+F(t,b,c,d)+e+w[t]+K(t));e=d;d=c;c=ROTL(b,30);b=a;a=tmp;}HASH[0]+=a;HASH[1]+=b;HASH[2]+=c;HASH[3]+=d;HASH[4]+=e;}return encode(HASH);}};
Algos['sha224']={call:'sha224',block:64,method:function(options){return Crypto.hash('sha224',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4];var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];var SHR=function(x,n){return x>>>n;};var ROTL=function(x,n){return((x<<n)|(x>>>(32-n)));};var ROTR=function(x,n){return((x>>>n)|(x<<(32-n)));};var BSIG0=function(x){return ROTR(x,2)^ROTR(x,13)^ROTR(x,22);};var BSIG1=function(x){return ROTR(x,6)^ROTR(x,11)^ROTR(x,25);};var SSIG0=function(x){return ROTR(x,7)^ROTR(x,18)^SHR(x,3);};var SSIG1=function(x){return ROTR(x,17)^ROTR(x,19)^SHR(x,10);};var CH=function(x,y,z){return(x&y)^((~x)&z);};var MAJ=function(x,y,z){return(x&y)^(x&z)^(y&z);};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j+0]&0xff)<<24)|((input[j+1]&0xff)<<16)|((input[j+2]&0xff)<<8)|((input[j+3]&0xff)<<0);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>24)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>0)&0xff);}return output;};var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var a,b,c,d,e,f,g,h,tmp1,tmp2;var x=[],w=[],i,t;var count=(bitlen/Math.pow(2,32));input+=padding;input+=(Sequence(encode([count&0xffffffff]))).str();input+=(Sequence(encode([bitlen&0xffffffff]))).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){a=0xffffffff&HASH[0];b=0xffffffff&HASH[1];c=0xffffffff&HASH[2];d=0xffffffff&HASH[3];e=0xffffffff&HASH[4];f=0xffffffff&HASH[5];g=0xffffffff&HASH[6];h=0xffffffff&HASH[7];for(t=0;t<64;t+=1){if(t<16){w[t]=x[i+t]&0xffffffff;}else{w[t]=SSIG1(w[t-2])+w[t-7]+SSIG0(w[t-15])+w[t-16];}tmp1=0xffffffff&(h+BSIG1(e)+CH(e,f,g)+K[t]+w[t]);tmp2=0xffffffff&(BSIG0(a)+MAJ(a,b,c));h=0xffffffff&(g);g=0xffffffff&(f);f=0xffffffff&(e);e=0xffffffff&(d+tmp1);d=0xffffffff&(c);c=0xffffffff&(b);b=0xffffffff&(a);a=0xffffffff&(tmp1+tmp2);}HASH[0]+=0xffffffff&a;HASH[1]+=0xffffffff&b;HASH[2]+=0xffffffff&c;HASH[3]+=0xffffffff&d;HASH[4]+=0xffffffff&e;HASH[5]+=0xffffffff&f;HASH[6]+=0xffffffff&g;HASH[7]+=0xffffffff&h;}return encode(HASH.slice(0,7));}};
Algos['sha256']={call:'sha256',block:64,method:function(options){return Crypto.hash('sha256',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];var SHR=function(x,n){return x>>>n;};var ROTL=function(x,n){return((x<<n)|(x>>>(32-n)));};var ROTR=function(x,n){return((x>>>n)|(x<<(32-n)));};var BSIG0=function(x){return ROTR(x,2)^ROTR(x,13)^ROTR(x,22);};var BSIG1=function(x){return ROTR(x,6)^ROTR(x,11)^ROTR(x,25);};var SSIG0=function(x){return ROTR(x,7)^ROTR(x,18)^SHR(x,3);};var SSIG1=function(x){return ROTR(x,17)^ROTR(x,19)^SHR(x,10);};var CH=function(x,y,z){return(x&y)^((~x)&z);};var MAJ=function(x,y,z){return(x&y)^(x&z)^(y&z);};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j+0]&0xff)<<24)|((input[j+1]&0xff)<<16)|((input[j+2]&0xff)<<8)|((input[j+3]&0xff)<<0);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>24)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>0)&0xff);}return output;};var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var a,b,c,d,e,f,g,h,tmp1,tmp2;var x=[],w=[],i,t;var count=(bitlen/Math.pow(2,32));input+=padding;input+=(Sequence(encode([count&0xffffffff]))).str();input+=(Sequence(encode([bitlen&0xffffffff]))).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){a=0xffffffff&HASH[0];b=0xffffffff&HASH[1];c=0xffffffff&HASH[2];d=0xffffffff&HASH[3];e=0xffffffff&HASH[4];f=0xffffffff&HASH[5];g=0xffffffff&HASH[6];h=0xffffffff&HASH[7];for(t=0;t<64;t+=1){if(t<16){w[t]=x[i+t]&0xffffffff;}else{w[t]=SSIG1(w[t-2])+w[t-7]+SSIG0(w[t-15])+w[t-16];}tmp1=0xffffffff&(h+BSIG1(e)+CH(e,f,g)+K[t]+w[t]);tmp2=0xffffffff&(BSIG0(a)+MAJ(a,b,c));h=0xffffffff&(g);g=0xffffffff&(f);f=0xffffffff&(e);e=0xffffffff&(d+tmp1);d=0xffffffff&(c);c=0xffffffff&(b);b=0xffffffff&(a);a=0xffffffff&(tmp1+tmp2);}HASH[0]+=0xffffffff&a;HASH[1]+=0xffffffff&b;HASH[2]+=0xffffffff&c;HASH[3]+=0xffffffff&d;HASH[4]+=0xffffffff&e;HASH[5]+=0xffffffff&f;HASH[6]+=0xffffffff&g;HASH[7]+=0xffffffff&h;}return encode(HASH);}};

Algos['ripemd128']={call:'ripemd128',block:64,method:function(options){return Crypto.hash('ripemd128',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x67452301,0xefcdab89,0x98badcfe,0x10325476];var ROL=function(x,n){return((x<<n)|(x>>>(32-n)));};var F=function(x,y,z){return(x^y^z);};var G=function(x,y,z){return((x&y)|((~x)&z));};var H=function(x,y,z){return((x|(~y))^z);};var I=function(x,y,z){return((x&z)|(y&(~z)));};var FF=0x00000000;var GG=0x5a827999;var HH=0x6ed9eba1;var II=0x8f1bbcdc;var III=0x50a28be6;var HHH=0x5c4dd124;var GGG=0x6d703ef3;var FFF=0x00000000;var C=function(f,k,a,b,c,d,x,s){return ROL((a+f(b,c,d)+x+k),s);};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j])&0xff)|((input[j+1]<<8)&0xff00)|((input[j+2]<<16)&0xff0000)|((input[j+3]<<24)&0xff000000);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>0)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>24)&0xff);}return output;};var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var aa,bb,cc,dd,aaa,bbb,ccc,ddd;var x=[],i;var count=(bitlen/Math.pow(2,32));input+=padding;input+=Sequence(encode([bitlen,count])).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){aa=aaa=HASH[0];bb=bbb=HASH[1];cc=ccc=HASH[2];dd=ddd=HASH[3];aa=C(F,FF,aa,bb,cc,dd,x[i+0],11);dd=C(F,FF,dd,aa,bb,cc,x[i+1],14);cc=C(F,FF,cc,dd,aa,bb,x[i+2],15);bb=C(F,FF,bb,cc,dd,aa,x[i+3],12);aa=C(F,FF,aa,bb,cc,dd,x[i+4],5);dd=C(F,FF,dd,aa,bb,cc,x[i+5],8);cc=C(F,FF,cc,dd,aa,bb,x[i+6],7);bb=C(F,FF,bb,cc,dd,aa,x[i+7],9);aa=C(F,FF,aa,bb,cc,dd,x[i+8],11);dd=C(F,FF,dd,aa,bb,cc,x[i+9],13);cc=C(F,FF,cc,dd,aa,bb,x[i+10],14);bb=C(F,FF,bb,cc,dd,aa,x[i+11],15);aa=C(F,FF,aa,bb,cc,dd,x[i+12],6);dd=C(F,FF,dd,aa,bb,cc,x[i+13],7);cc=C(F,FF,cc,dd,aa,bb,x[i+14],9);bb=C(F,FF,bb,cc,dd,aa,x[i+15],8);aa=C(G,GG,aa,bb,cc,dd,x[i+7],7);dd=C(G,GG,dd,aa,bb,cc,x[i+4],6);cc=C(G,GG,cc,dd,aa,bb,x[i+13],8);bb=C(G,GG,bb,cc,dd,aa,x[i+1],13);aa=C(G,GG,aa,bb,cc,dd,x[i+10],11);dd=C(G,GG,dd,aa,bb,cc,x[i+6],9);cc=C(G,GG,cc,dd,aa,bb,x[i+15],7);bb=C(G,GG,bb,cc,dd,aa,x[i+3],15);aa=C(G,GG,aa,bb,cc,dd,x[i+12],7);dd=C(G,GG,dd,aa,bb,cc,x[i+0],12);cc=C(G,GG,cc,dd,aa,bb,x[i+9],15);bb=C(G,GG,bb,cc,dd,aa,x[i+5],9);aa=C(G,GG,aa,bb,cc,dd,x[i+2],11);dd=C(G,GG,dd,aa,bb,cc,x[i+14],7);cc=C(G,GG,cc,dd,aa,bb,x[i+11],13);bb=C(G,GG,bb,cc,dd,aa,x[i+8],12);aa=C(H,HH,aa,bb,cc,dd,x[i+3],11);dd=C(H,HH,dd,aa,bb,cc,x[i+10],13);cc=C(H,HH,cc,dd,aa,bb,x[i+14],6);bb=C(H,HH,bb,cc,dd,aa,x[i+4],7);aa=C(H,HH,aa,bb,cc,dd,x[i+9],14);dd=C(H,HH,dd,aa,bb,cc,x[i+15],9);cc=C(H,HH,cc,dd,aa,bb,x[i+8],13);bb=C(H,HH,bb,cc,dd,aa,x[i+1],15);aa=C(H,HH,aa,bb,cc,dd,x[i+2],14);dd=C(H,HH,dd,aa,bb,cc,x[i+7],8);cc=C(H,HH,cc,dd,aa,bb,x[i+0],13);bb=C(H,HH,bb,cc,dd,aa,x[i+6],6);aa=C(H,HH,aa,bb,cc,dd,x[i+13],5);dd=C(H,HH,dd,aa,bb,cc,x[i+11],12);cc=C(H,HH,cc,dd,aa,bb,x[i+5],7);bb=C(H,HH,bb,cc,dd,aa,x[i+12],5);aa=C(I,II,aa,bb,cc,dd,x[i+1],11);dd=C(I,II,dd,aa,bb,cc,x[i+9],12);cc=C(I,II,cc,dd,aa,bb,x[i+11],14);bb=C(I,II,bb,cc,dd,aa,x[i+10],15);aa=C(I,II,aa,bb,cc,dd,x[i+0],14);dd=C(I,II,dd,aa,bb,cc,x[i+8],15);cc=C(I,II,cc,dd,aa,bb,x[i+12],9);bb=C(I,II,bb,cc,dd,aa,x[i+4],8);aa=C(I,II,aa,bb,cc,dd,x[i+13],9);dd=C(I,II,dd,aa,bb,cc,x[i+3],14);cc=C(I,II,cc,dd,aa,bb,x[i+7],5);bb=C(I,II,bb,cc,dd,aa,x[i+15],6);aa=C(I,II,aa,bb,cc,dd,x[i+14],8);dd=C(I,II,dd,aa,bb,cc,x[i+5],6);cc=C(I,II,cc,dd,aa,bb,x[i+6],5);bb=C(I,II,bb,cc,dd,aa,x[i+2],12);aaa=C(I,III,aaa,bbb,ccc,ddd,x[i+5],8);ddd=C(I,III,ddd,aaa,bbb,ccc,x[i+14],9);ccc=C(I,III,ccc,ddd,aaa,bbb,x[i+7],9);bbb=C(I,III,bbb,ccc,ddd,aaa,x[i+0],11);aaa=C(I,III,aaa,bbb,ccc,ddd,x[i+9],13);ddd=C(I,III,ddd,aaa,bbb,ccc,x[i+2],15);ccc=C(I,III,ccc,ddd,aaa,bbb,x[i+11],15);bbb=C(I,III,bbb,ccc,ddd,aaa,x[i+4],5);aaa=C(I,III,aaa,bbb,ccc,ddd,x[i+13],7);ddd=C(I,III,ddd,aaa,bbb,ccc,x[i+6],7);ccc=C(I,III,ccc,ddd,aaa,bbb,x[i+15],8);bbb=C(I,III,bbb,ccc,ddd,aaa,x[i+8],11);aaa=C(I,III,aaa,bbb,ccc,ddd,x[i+1],14);ddd=C(I,III,ddd,aaa,bbb,ccc,x[i+10],14);ccc=C(I,III,ccc,ddd,aaa,bbb,x[i+3],12);bbb=C(I,III,bbb,ccc,ddd,aaa,x[i+12],6);aaa=C(H,HHH,aaa,bbb,ccc,ddd,x[i+6],9);ddd=C(H,HHH,ddd,aaa,bbb,ccc,x[i+11],13);ccc=C(H,HHH,ccc,ddd,aaa,bbb,x[i+3],15);bbb=C(H,HHH,bbb,ccc,ddd,aaa,x[i+7],7);aaa=C(H,HHH,aaa,bbb,ccc,ddd,x[i+0],12);ddd=C(H,HHH,ddd,aaa,bbb,ccc,x[i+13],8);ccc=C(H,HHH,ccc,ddd,aaa,bbb,x[i+5],9);bbb=C(H,HHH,bbb,ccc,ddd,aaa,x[i+10],11);aaa=C(H,HHH,aaa,bbb,ccc,ddd,x[i+14],7);ddd=C(H,HHH,ddd,aaa,bbb,ccc,x[i+15],7);ccc=C(H,HHH,ccc,ddd,aaa,bbb,x[i+8],12);bbb=C(H,HHH,bbb,ccc,ddd,aaa,x[i+12],7);aaa=C(H,HHH,aaa,bbb,ccc,ddd,x[i+4],6);ddd=C(H,HHH,ddd,aaa,bbb,ccc,x[i+9],15);ccc=C(H,HHH,ccc,ddd,aaa,bbb,x[i+1],13);bbb=C(H,HHH,bbb,ccc,ddd,aaa,x[i+2],11);aaa=C(G,GGG,aaa,bbb,ccc,ddd,x[i+15],9);ddd=C(G,GGG,ddd,aaa,bbb,ccc,x[i+5],7);ccc=C(G,GGG,ccc,ddd,aaa,bbb,x[i+1],15);bbb=C(G,GGG,bbb,ccc,ddd,aaa,x[i+3],11);aaa=C(G,GGG,aaa,bbb,ccc,ddd,x[i+7],8);ddd=C(G,GGG,ddd,aaa,bbb,ccc,x[i+14],6);ccc=C(G,GGG,ccc,ddd,aaa,bbb,x[i+6],6);bbb=C(G,GGG,bbb,ccc,ddd,aaa,x[i+9],14);aaa=C(G,GGG,aaa,bbb,ccc,ddd,x[i+11],12);ddd=C(G,GGG,ddd,aaa,bbb,ccc,x[i+8],13);ccc=C(G,GGG,ccc,ddd,aaa,bbb,x[i+12],5);bbb=C(G,GGG,bbb,ccc,ddd,aaa,x[i+2],14);aaa=C(G,GGG,aaa,bbb,ccc,ddd,x[i+10],13);ddd=C(G,GGG,ddd,aaa,bbb,ccc,x[i+0],13);ccc=C(G,GGG,ccc,ddd,aaa,bbb,x[i+4],7);bbb=C(G,GGG,bbb,ccc,ddd,aaa,x[i+13],5);aaa=C(F,FFF,aaa,bbb,ccc,ddd,x[i+8],15);ddd=C(F,FFF,ddd,aaa,bbb,ccc,x[i+6],5);ccc=C(F,FFF,ccc,ddd,aaa,bbb,x[i+4],8);bbb=C(F,FFF,bbb,ccc,ddd,aaa,x[i+1],11);aaa=C(F,FFF,aaa,bbb,ccc,ddd,x[i+3],14);ddd=C(F,FFF,ddd,aaa,bbb,ccc,x[i+11],14);ccc=C(F,FFF,ccc,ddd,aaa,bbb,x[i+15],6);bbb=C(F,FFF,bbb,ccc,ddd,aaa,x[i+0],14);aaa=C(F,FFF,aaa,bbb,ccc,ddd,x[i+5],6);ddd=C(F,FFF,ddd,aaa,bbb,ccc,x[i+12],9);ccc=C(F,FFF,ccc,ddd,aaa,bbb,x[i+2],12);bbb=C(F,FFF,bbb,ccc,ddd,aaa,x[i+13],9);aaa=C(F,FFF,aaa,bbb,ccc,ddd,x[i+9],12);ddd=C(F,FFF,ddd,aaa,bbb,ccc,x[i+7],5);ccc=C(F,FFF,ccc,ddd,aaa,bbb,x[i+10],15);bbb=C(F,FFF,bbb,ccc,ddd,aaa,x[i+14],8);ddd=HASH[1]+cc+ddd;HASH[1]=HASH[2]+dd+aaa;HASH[2]=HASH[3]+aa+bbb;HASH[3]=HASH[0]+bb+ccc;HASH[0]=ddd;}return encode(HASH);}};
Algos['ripemd160']={call:'ripemd160',block:64,method:function(options){return Crypto.hash('ripemd160',Type.clone(this),options);},algo:function(input){if(!Type.is_a(input,'string'))return;var HASH=[0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0];var ROL=function(x,n){return((x<<n)|(x>>>(32-n)));};var F=function(x,y,z){return(x^y^z);};var G=function(x,y,z){return((x&y)|((~x)&z));};var H=function(x,y,z){return((x|(~y))^z);};var I=function(x,y,z){return((x&z)|(y&(~z)));};var J=function(x,y,z){return(x^(y|(~z)));};var FF=0x00000000;var GG=0x5a827999;var HH=0x6ed9eba1;var II=0x8f1bbcdc;var JJ=0xa953fd4e;var JJJ=0x50a28be6;var III=0x5c4dd124;var HHH=0x6d703ef3;var GGG=0x7a6d76e9;var FFF=0x00000000;var C=function(f,k,a,b,c,d,e,x,s){return ROL((a+f(b,c,d)+x+k),s)+e;};var decode=function(input){var i,j,output=[];for(i=0,j=0;j<input.length;i+=1,j=(i*4)){output[i]=((input[j])&0xff)|((input[j+1]<<8)&0xff00)|((input[j+2]<<16)&0xff0000)|((input[j+3]<<24)&0xff000000);}return output;};var encode=function(input){var i,output=[];for(i=0;i<input.length;i+=1){output.push((input[i]>>0)&0xff);output.push((input[i]>>8)&0xff);output.push((input[i]>>16)&0xff);output.push((input[i]>>24)&0xff);}return output;};var length=input.length;var bitlen=length*8;var padding='\x80';var padlen=(((length%64)<56?56:120)-(length%64));while(padding.length<padlen)padding+='\x00';var aa,bb,cc,dd,ee,aaa,bbb,ccc,ddd,eee;var x=[],i;var count=(bitlen/Math.pow(2,32));input+=padding;input+=Sequence(encode([bitlen,count])).str();x=decode((Sequence(input)).raw());for(i=0;i<x.length;i+=16){aa=aaa=HASH[0];bb=bbb=HASH[1];cc=ccc=HASH[2];dd=ddd=HASH[3];ee=eee=HASH[4];aa=C(F,FF,aa,bb,cc,dd,ee,x[i+0],11);cc=ROL(cc,10);ee=C(F,FF,ee,aa,bb,cc,dd,x[i+1],14);bb=ROL(bb,10);dd=C(F,FF,dd,ee,aa,bb,cc,x[i+2],15);aa=ROL(aa,10);cc=C(F,FF,cc,dd,ee,aa,bb,x[i+3],12);ee=ROL(ee,10);bb=C(F,FF,bb,cc,dd,ee,aa,x[i+4],5);dd=ROL(dd,10);aa=C(F,FF,aa,bb,cc,dd,ee,x[i+5],8);cc=ROL(cc,10);ee=C(F,FF,ee,aa,bb,cc,dd,x[i+6],7);bb=ROL(bb,10);dd=C(F,FF,dd,ee,aa,bb,cc,x[i+7],9);aa=ROL(aa,10);cc=C(F,FF,cc,dd,ee,aa,bb,x[i+8],11);ee=ROL(ee,10);bb=C(F,FF,bb,cc,dd,ee,aa,x[i+9],13);dd=ROL(dd,10);aa=C(F,FF,aa,bb,cc,dd,ee,x[i+10],14);cc=ROL(cc,10);ee=C(F,FF,ee,aa,bb,cc,dd,x[i+11],15);bb=ROL(bb,10);dd=C(F,FF,dd,ee,aa,bb,cc,x[i+12],6);aa=ROL(aa,10);cc=C(F,FF,cc,dd,ee,aa,bb,x[i+13],7);ee=ROL(ee,10);bb=C(F,FF,bb,cc,dd,ee,aa,x[i+14],9);dd=ROL(dd,10);aa=C(F,FF,aa,bb,cc,dd,ee,x[i+15],8);cc=ROL(cc,10);ee=C(G,GG,ee,aa,bb,cc,dd,x[i+7],7);bb=ROL(bb,10);dd=C(G,GG,dd,ee,aa,bb,cc,x[i+4],6);aa=ROL(aa,10);cc=C(G,GG,cc,dd,ee,aa,bb,x[i+13],8);ee=ROL(ee,10);bb=C(G,GG,bb,cc,dd,ee,aa,x[i+1],13);dd=ROL(dd,10);aa=C(G,GG,aa,bb,cc,dd,ee,x[i+10],11);cc=ROL(cc,10);ee=C(G,GG,ee,aa,bb,cc,dd,x[i+6],9);bb=ROL(bb,10);dd=C(G,GG,dd,ee,aa,bb,cc,x[i+15],7);aa=ROL(aa,10);cc=C(G,GG,cc,dd,ee,aa,bb,x[i+3],15);ee=ROL(ee,10);bb=C(G,GG,bb,cc,dd,ee,aa,x[i+12],7);dd=ROL(dd,10);aa=C(G,GG,aa,bb,cc,dd,ee,x[i+0],12);cc=ROL(cc,10);ee=C(G,GG,ee,aa,bb,cc,dd,x[i+9],15);bb=ROL(bb,10);dd=C(G,GG,dd,ee,aa,bb,cc,x[i+5],9);aa=ROL(aa,10);cc=C(G,GG,cc,dd,ee,aa,bb,x[i+2],11);ee=ROL(ee,10);bb=C(G,GG,bb,cc,dd,ee,aa,x[i+14],7);dd=ROL(dd,10);aa=C(G,GG,aa,bb,cc,dd,ee,x[i+11],13);cc=ROL(cc,10);ee=C(G,GG,ee,aa,bb,cc,dd,x[i+8],12);bb=ROL(bb,10);dd=C(H,HH,dd,ee,aa,bb,cc,x[i+3],11);aa=ROL(aa,10);cc=C(H,HH,cc,dd,ee,aa,bb,x[i+10],13);ee=ROL(ee,10);bb=C(H,HH,bb,cc,dd,ee,aa,x[i+14],6);dd=ROL(dd,10);aa=C(H,HH,aa,bb,cc,dd,ee,x[i+4],7);cc=ROL(cc,10);ee=C(H,HH,ee,aa,bb,cc,dd,x[i+9],14);bb=ROL(bb,10);dd=C(H,HH,dd,ee,aa,bb,cc,x[i+15],9);aa=ROL(aa,10);cc=C(H,HH,cc,dd,ee,aa,bb,x[i+8],13);ee=ROL(ee,10);bb=C(H,HH,bb,cc,dd,ee,aa,x[i+1],15);dd=ROL(dd,10);aa=C(H,HH,aa,bb,cc,dd,ee,x[i+2],14);cc=ROL(cc,10);ee=C(H,HH,ee,aa,bb,cc,dd,x[i+7],8);bb=ROL(bb,10);dd=C(H,HH,dd,ee,aa,bb,cc,x[i+0],13);aa=ROL(aa,10);cc=C(H,HH,cc,dd,ee,aa,bb,x[i+6],6);ee=ROL(ee,10);bb=C(H,HH,bb,cc,dd,ee,aa,x[i+13],5);dd=ROL(dd,10);aa=C(H,HH,aa,bb,cc,dd,ee,x[i+11],12);cc=ROL(cc,10);ee=C(H,HH,ee,aa,bb,cc,dd,x[i+5],7);bb=ROL(bb,10);dd=C(H,HH,dd,ee,aa,bb,cc,x[i+12],5);aa=ROL(aa,10);cc=C(I,II,cc,dd,ee,aa,bb,x[i+1],11);ee=ROL(ee,10);bb=C(I,II,bb,cc,dd,ee,aa,x[i+9],12);dd=ROL(dd,10);aa=C(I,II,aa,bb,cc,dd,ee,x[i+11],14);cc=ROL(cc,10);ee=C(I,II,ee,aa,bb,cc,dd,x[i+10],15);bb=ROL(bb,10);dd=C(I,II,dd,ee,aa,bb,cc,x[i+0],14);aa=ROL(aa,10);cc=C(I,II,cc,dd,ee,aa,bb,x[i+8],15);ee=ROL(ee,10);bb=C(I,II,bb,cc,dd,ee,aa,x[i+12],9);dd=ROL(dd,10);aa=C(I,II,aa,bb,cc,dd,ee,x[i+4],8);cc=ROL(cc,10);ee=C(I,II,ee,aa,bb,cc,dd,x[i+13],9);bb=ROL(bb,10);dd=C(I,II,dd,ee,aa,bb,cc,x[i+3],14);aa=ROL(aa,10);cc=C(I,II,cc,dd,ee,aa,bb,x[i+7],5);ee=ROL(ee,10);bb=C(I,II,bb,cc,dd,ee,aa,x[i+15],6);dd=ROL(dd,10);aa=C(I,II,aa,bb,cc,dd,ee,x[i+14],8);cc=ROL(cc,10);ee=C(I,II,ee,aa,bb,cc,dd,x[i+5],6);bb=ROL(bb,10);dd=C(I,II,dd,ee,aa,bb,cc,x[i+6],5);aa=ROL(aa,10);cc=C(I,II,cc,dd,ee,aa,bb,x[i+2],12);ee=ROL(ee,10);bb=C(J,JJ,bb,cc,dd,ee,aa,x[i+4],9);dd=ROL(dd,10);aa=C(J,JJ,aa,bb,cc,dd,ee,x[i+0],15);cc=ROL(cc,10);ee=C(J,JJ,ee,aa,bb,cc,dd,x[i+5],5);bb=ROL(bb,10);dd=C(J,JJ,dd,ee,aa,bb,cc,x[i+9],11);aa=ROL(aa,10);cc=C(J,JJ,cc,dd,ee,aa,bb,x[i+7],6);ee=ROL(ee,10);bb=C(J,JJ,bb,cc,dd,ee,aa,x[i+12],8);dd=ROL(dd,10);aa=C(J,JJ,aa,bb,cc,dd,ee,x[i+2],13);cc=ROL(cc,10);ee=C(J,JJ,ee,aa,bb,cc,dd,x[i+10],12);bb=ROL(bb,10);dd=C(J,JJ,dd,ee,aa,bb,cc,x[i+14],5);aa=ROL(aa,10);cc=C(J,JJ,cc,dd,ee,aa,bb,x[i+1],12);ee=ROL(ee,10);bb=C(J,JJ,bb,cc,dd,ee,aa,x[i+3],13);dd=ROL(dd,10);aa=C(J,JJ,aa,bb,cc,dd,ee,x[i+8],14);cc=ROL(cc,10);ee=C(J,JJ,ee,aa,bb,cc,dd,x[i+11],11);bb=ROL(bb,10);dd=C(J,JJ,dd,ee,aa,bb,cc,x[i+6],8);aa=ROL(aa,10);cc=C(J,JJ,cc,dd,ee,aa,bb,x[i+15],5);ee=ROL(ee,10);bb=C(J,JJ,bb,cc,dd,ee,aa,x[i+13],6);dd=ROL(dd,10);aaa=C(J,JJJ,aaa,bbb,ccc,ddd,eee,x[i+5],8);ccc=ROL(ccc,10);eee=C(J,JJJ,eee,aaa,bbb,ccc,ddd,x[i+14],9);bbb=ROL(bbb,10);ddd=C(J,JJJ,ddd,eee,aaa,bbb,ccc,x[i+7],9);aaa=ROL(aaa,10);ccc=C(J,JJJ,ccc,ddd,eee,aaa,bbb,x[i+0],11);eee=ROL(eee,10);bbb=C(J,JJJ,bbb,ccc,ddd,eee,aaa,x[i+9],13);ddd=ROL(ddd,10);aaa=C(J,JJJ,aaa,bbb,ccc,ddd,eee,x[i+2],15);ccc=ROL(ccc,10);eee=C(J,JJJ,eee,aaa,bbb,ccc,ddd,x[i+11],15);bbb=ROL(bbb,10);ddd=C(J,JJJ,ddd,eee,aaa,bbb,ccc,x[i+4],5);aaa=ROL(aaa,10);ccc=C(J,JJJ,ccc,ddd,eee,aaa,bbb,x[i+13],7);eee=ROL(eee,10);bbb=C(J,JJJ,bbb,ccc,ddd,eee,aaa,x[i+6],7);ddd=ROL(ddd,10);aaa=C(J,JJJ,aaa,bbb,ccc,ddd,eee,x[i+15],8);ccc=ROL(ccc,10);eee=C(J,JJJ,eee,aaa,bbb,ccc,ddd,x[i+8],11);bbb=ROL(bbb,10);ddd=C(J,JJJ,ddd,eee,aaa,bbb,ccc,x[i+1],14);aaa=ROL(aaa,10);ccc=C(J,JJJ,ccc,ddd,eee,aaa,bbb,x[i+10],14);eee=ROL(eee,10);bbb=C(J,JJJ,bbb,ccc,ddd,eee,aaa,x[i+3],12);ddd=ROL(ddd,10);aaa=C(J,JJJ,aaa,bbb,ccc,ddd,eee,x[i+12],6);ccc=ROL(ccc,10);eee=C(I,III,eee,aaa,bbb,ccc,ddd,x[i+6],9);bbb=ROL(bbb,10);ddd=C(I,III,ddd,eee,aaa,bbb,ccc,x[i+11],13);aaa=ROL(aaa,10);ccc=C(I,III,ccc,ddd,eee,aaa,bbb,x[i+3],15);eee=ROL(eee,10);bbb=C(I,III,bbb,ccc,ddd,eee,aaa,x[i+7],7);ddd=ROL(ddd,10);aaa=C(I,III,aaa,bbb,ccc,ddd,eee,x[i+0],12);ccc=ROL(ccc,10);eee=C(I,III,eee,aaa,bbb,ccc,ddd,x[i+13],8);bbb=ROL(bbb,10);ddd=C(I,III,ddd,eee,aaa,bbb,ccc,x[i+5],9);aaa=ROL(aaa,10);ccc=C(I,III,ccc,ddd,eee,aaa,bbb,x[i+10],11);eee=ROL(eee,10);bbb=C(I,III,bbb,ccc,ddd,eee,aaa,x[i+14],7);ddd=ROL(ddd,10);aaa=C(I,III,aaa,bbb,ccc,ddd,eee,x[i+15],7);ccc=ROL(ccc,10);eee=C(I,III,eee,aaa,bbb,ccc,ddd,x[i+8],12);bbb=ROL(bbb,10);ddd=C(I,III,ddd,eee,aaa,bbb,ccc,x[i+12],7);aaa=ROL(aaa,10);ccc=C(I,III,ccc,ddd,eee,aaa,bbb,x[i+4],6);eee=ROL(eee,10);bbb=C(I,III,bbb,ccc,ddd,eee,aaa,x[i+9],15);ddd=ROL(ddd,10);aaa=C(I,III,aaa,bbb,ccc,ddd,eee,x[i+1],13);ccc=ROL(ccc,10);eee=C(I,III,eee,aaa,bbb,ccc,ddd,x[i+2],11);bbb=ROL(bbb,10);ddd=C(H,HHH,ddd,eee,aaa,bbb,ccc,x[i+15],9);aaa=ROL(aaa,10);ccc=C(H,HHH,ccc,ddd,eee,aaa,bbb,x[i+5],7);eee=ROL(eee,10);bbb=C(H,HHH,bbb,ccc,ddd,eee,aaa,x[i+1],15);ddd=ROL(ddd,10);aaa=C(H,HHH,aaa,bbb,ccc,ddd,eee,x[i+3],11);ccc=ROL(ccc,10);eee=C(H,HHH,eee,aaa,bbb,ccc,ddd,x[i+7],8);bbb=ROL(bbb,10);ddd=C(H,HHH,ddd,eee,aaa,bbb,ccc,x[i+14],6);aaa=ROL(aaa,10);ccc=C(H,HHH,ccc,ddd,eee,aaa,bbb,x[i+6],6);eee=ROL(eee,10);bbb=C(H,HHH,bbb,ccc,ddd,eee,aaa,x[i+9],14);ddd=ROL(ddd,10);aaa=C(H,HHH,aaa,bbb,ccc,ddd,eee,x[i+11],12);ccc=ROL(ccc,10);eee=C(H,HHH,eee,aaa,bbb,ccc,ddd,x[i+8],13);bbb=ROL(bbb,10);ddd=C(H,HHH,ddd,eee,aaa,bbb,ccc,x[i+12],5);aaa=ROL(aaa,10);ccc=C(H,HHH,ccc,ddd,eee,aaa,bbb,x[i+2],14);eee=ROL(eee,10);bbb=C(H,HHH,bbb,ccc,ddd,eee,aaa,x[i+10],13);ddd=ROL(ddd,10);aaa=C(H,HHH,aaa,bbb,ccc,ddd,eee,x[i+0],13);ccc=ROL(ccc,10);eee=C(H,HHH,eee,aaa,bbb,ccc,ddd,x[i+4],7);bbb=ROL(bbb,10);ddd=C(H,HHH,ddd,eee,aaa,bbb,ccc,x[i+13],5);aaa=ROL(aaa,10);ccc=C(G,GGG,ccc,ddd,eee,aaa,bbb,x[i+8],15);eee=ROL(eee,10);bbb=C(G,GGG,bbb,ccc,ddd,eee,aaa,x[i+6],5);ddd=ROL(ddd,10);aaa=C(G,GGG,aaa,bbb,ccc,ddd,eee,x[i+4],8);ccc=ROL(ccc,10);eee=C(G,GGG,eee,aaa,bbb,ccc,ddd,x[i+1],11);bbb=ROL(bbb,10);ddd=C(G,GGG,ddd,eee,aaa,bbb,ccc,x[i+3],14);aaa=ROL(aaa,10);ccc=C(G,GGG,ccc,ddd,eee,aaa,bbb,x[i+11],14);eee=ROL(eee,10);bbb=C(G,GGG,bbb,ccc,ddd,eee,aaa,x[i+15],6);ddd=ROL(ddd,10);aaa=C(G,GGG,aaa,bbb,ccc,ddd,eee,x[i+0],14);ccc=ROL(ccc,10);eee=C(G,GGG,eee,aaa,bbb,ccc,ddd,x[i+5],6);bbb=ROL(bbb,10);ddd=C(G,GGG,ddd,eee,aaa,bbb,ccc,x[i+12],9);aaa=ROL(aaa,10);ccc=C(G,GGG,ccc,ddd,eee,aaa,bbb,x[i+2],12);eee=ROL(eee,10);bbb=C(G,GGG,bbb,ccc,ddd,eee,aaa,x[i+13],9);ddd=ROL(ddd,10);aaa=C(G,GGG,aaa,bbb,ccc,ddd,eee,x[i+9],12);ccc=ROL(ccc,10);eee=C(G,GGG,eee,aaa,bbb,ccc,ddd,x[i+7],5);bbb=ROL(bbb,10);ddd=C(G,GGG,ddd,eee,aaa,bbb,ccc,x[i+10],15);aaa=ROL(aaa,10);ccc=C(G,GGG,ccc,ddd,eee,aaa,bbb,x[i+14],8);eee=ROL(eee,10);bbb=C(F,FFF,bbb,ccc,ddd,eee,aaa,x[i+12],8);ddd=ROL(ddd,10);aaa=C(F,FFF,aaa,bbb,ccc,ddd,eee,x[i+15],5);ccc=ROL(ccc,10);eee=C(F,FFF,eee,aaa,bbb,ccc,ddd,x[i+10],12);bbb=ROL(bbb,10);ddd=C(F,FFF,ddd,eee,aaa,bbb,ccc,x[i+4],9);aaa=ROL(aaa,10);ccc=C(F,FFF,ccc,ddd,eee,aaa,bbb,x[i+1],12);eee=ROL(eee,10);bbb=C(F,FFF,bbb,ccc,ddd,eee,aaa,x[i+5],5);ddd=ROL(ddd,10);aaa=C(F,FFF,aaa,bbb,ccc,ddd,eee,x[i+8],14);ccc=ROL(ccc,10);eee=C(F,FFF,eee,aaa,bbb,ccc,ddd,x[i+7],6);bbb=ROL(bbb,10);ddd=C(F,FFF,ddd,eee,aaa,bbb,ccc,x[i+6],8);aaa=ROL(aaa,10);ccc=C(F,FFF,ccc,ddd,eee,aaa,bbb,x[i+2],13);eee=ROL(eee,10);bbb=C(F,FFF,bbb,ccc,ddd,eee,aaa,x[i+13],6);ddd=ROL(ddd,10);aaa=C(F,FFF,aaa,bbb,ccc,ddd,eee,x[i+14],5);ccc=ROL(ccc,10);eee=C(F,FFF,eee,aaa,bbb,ccc,ddd,x[i+0],15);bbb=ROL(bbb,10);ddd=C(F,FFF,ddd,eee,aaa,bbb,ccc,x[i+3],13);aaa=ROL(aaa,10);ccc=C(F,FFF,ccc,ddd,eee,aaa,bbb,x[i+9],11);eee=ROL(eee,10);bbb=C(F,FFF,bbb,ccc,ddd,eee,aaa,x[i+11],11);ddd=ROL(ddd,10);ddd=HASH[1]+cc+ddd;HASH[1]=HASH[2]+dd+eee;HASH[2]=HASH[3]+ee+aaa;HASH[3]=HASH[4]+aa+bbb;HASH[4]=HASH[0]+bb+ccc;HASH[0]=ddd;}return encode(HASH);}};


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Includes
**/
var Type=new(function(){this.Version='8.1015';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){switch(this.get(object)){case NUL:return null;case ARR:case BLN:case FNC:case NUM:case OBJ:case RGX:case STR:return object.valueOf();case DTE:return new Date(object.valueOf());default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
