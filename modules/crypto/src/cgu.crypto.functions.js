/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto - Functions
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
  
  // listable
  CGU.hashes = function (keyed) {
    keyed = keyed === !!keyed ? keyed : null; // true, false, or null
    
    var calls = [];
    for (var call in Algos)
      if (Algos[call] instanceof Algo)
        if (keyed === null || Algos[call].keyed == keyed)
          calls.push(call);
    return calls;
  };
  
  // conversion
  CGU.hashable = function (str) {
    for (var out = '', i = 0; i < str.length; i += 1) {
      out += String.fromCharCode((str.charCodeAt(i) >> 8) & 0xff);
      out += String.fromCharCode((str.charCodeAt(i) >> 0) & 0xff);
    }
    return out;
  };
  
  // core functions
  CGU.hash = function (call, data, hkey, bytes) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (bytes !== true) bytes = false;
    
    if (!(Algos[call] instanceof Algo) || data === null) return;
    if (Algos[call].keyed && hkey === null) return null;
    
    if (bytes) data = CGU.hashable(data);
    
    return CGU.Sequence(Algos[call].algo(data, hkey));
  };
  
  CGU.hmac = function (call, data, hkey, bytes) {
    if (typeof(call) != 'string') call = null;
    if (typeof(data) != 'string') data = null;
    if (typeof(hkey) != 'string') hkey = null;
    if (bytes !== true) bytes = false;
    
    if (!(Algos[call] instanceof Algo) || data === null) return;
    if (Algos[call].keyed || hkey === null) return null;
    
    if (bytes) data = CGU.hashable(data);
    
    var akey, ihash, ipad = [], opad = [];
    var block = Algos[call].block, klen = hkey.length;
    
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
