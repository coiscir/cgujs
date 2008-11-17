/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Sequence
**/
  var Sequence = function (param) {
    // enable new operator shortcut
    if (!(this instanceof Sequence)) return new Sequence(param);
    
    // enable cloning
    if (param instanceof Sequence) param = param.raw();
    
    var sequence = (function () {
      if (Type.isof(param, null, undefined)) return undefined;
      
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
      return Type.is_a(sequence, Array);
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
