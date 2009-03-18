/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - Functions
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
  
  // listable
  CGU.Crypto.algos = function (keyed) {
    keyed = keyed === !!keyed ? keyed : null; // true, false, or null
    
    var calls = [];
    for (var call in Algos)
      if (Algos[call] instanceof Algo)
        if (keyed === null || Algos[call].keyed == keyed)
          calls.push(call);
    return calls;
  };
  
  // core functions
  CGU.Crypto.hash = function (call, data, hkey, bytes) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (bytes !== true) bytes = false;
    
    if (!(Algos[call] instanceof Algo) || data === null) return;
    if (Algos[call].keyed && hkey === null) return null;
    
    if (bytes) data = CGU.Crypto.to8bit(data);
    
    return CGU.Crypto.Sequence(Algos[call].algo(data, hkey));
  };
  
  CGU.Crypto.hmac = function (call, data, hkey, bytes) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (bytes !== true) bytes = false;
    
    if (!(Algos[call] instanceof Algo) || data === null) return;
    if (Algos[call].keyed || hkey === null) return null;
    
    if (bytes) data = CGU.Crypto.to8bit(data);
    
    var akey, ihash, ipad = [], opad = [];
    var block = Algos[call].block, klen = hkey.length;
    
    akey = CGU.Crypto.Sequence(klen > block ? Algos[call].algo(hkey) : hkey).raw();
    for (var i = 0; i < block; i += 1) {
      ipad[i] = (akey[i] || 0x00) ^ 0x36;
      opad[i] = (akey[i] || 0x00) ^ 0x5c;
    }
    
    ipad = CGU.Crypto.Sequence(ipad).str();
    opad = CGU.Crypto.Sequence(opad).str();
    
    ihash = CGU.Crypto.Sequence(Algos[call].algo(ipad + data)).str();
    return CGU.Crypto.Sequence(Algos[call].algo(opad + ihash));
  };
  
  // conversion
  CGU.Crypto.to8bit = function (str) {
    for (var out = '', i = 0; i < str.length; i += 1) {
      out += String.fromCharCode((str.charCodeAt(i) >> 8) & 0xff);
      out += String.fromCharCode((str.charCodeAt(i) >> 0) & 0xff);
    }
    return out;
  };
