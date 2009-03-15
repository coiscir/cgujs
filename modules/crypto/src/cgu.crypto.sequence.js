/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU JS - Crypto - Sequence
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

  CGU.Crypto.Sequence = function (param) {
    // enable new operator shortcut
    if (!(this instanceof CGU.Crypto.Sequence))
      return new CGU.Crypto.Sequence(param);
    
    // enable cloning
    if (param instanceof CGU.Crypto.Sequence)
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
    this.toString = this.valueOf = this.hex;
  };
