/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest - Functions
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
  
  CGU.hash = function (call, data, hkey, utf8) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (utf8 !== true) utf8 = false;
    
    if (!(Algos[call] instanceof Hash) || data === null) return;
    
    if (utf8) data = CGU.utf8Encode(data);
    
    return CGU.Sequence(Algos[call].algo(data, hkey));
  };
  
  CGU.hmac = function (call, data, hkey, utf8) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (utf8 !== true) utf8 = false;
    
    if (!(Algos[call] instanceof Hash) || data === null) return;
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
