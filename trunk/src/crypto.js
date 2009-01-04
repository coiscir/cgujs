/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD4 (c) 1990 R. Rivest                                          [RFC 1320]
 *  MD5 (c) 1992 R. Rivest                                          [RFC 1321]
 *  SHA (c) 2006 The Internet Society                               [RFC 4634]
 *  RIPEMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Crypto() {
  
  CGU.hash = function (algo, data, options) {
    algo = CGU.limit(algo, String);
    data = CGU.limit(data, String);
    options = (function (o) { return {
      hmac    : CGU.limit(o.hmac,    String),
      unicode : CGU.limit(o.unicode, Boolean) || false
    };})(options || {});
    
    if (CGU.is_a(algo, undefined) || CGU.is_a(data, undefined)) return;
    
    algo = ready(algo);
    if (!valid(algo) || CGU.isNil(Algos[algo])) return null;
    
    if (options.unicode) data = c16t8(data);
    
    if (CGU.is_a(options.hmac, String)) {
      data = hmac(algo, data, options.hmac);
      if (CGU.isNil(data)) return;
    }
    
    return Sequence(call(algo, data));
  };
  
  CGU.hashes = function () {
    return CGU.keys(Algos, true);
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var Algos = {};
  
  var ready = function (algo) { return algo.replace(/^\s+|\s+$/g, '').toLowerCase(); };
  var valid = function (algo) { return (/^[\$\_a-z][\$\_a-z0-9]*(,[0-9]+)?$/i).test(algo); };
  
  var call = function (algo, data) {
    return Algos[algo].algo(data);
  };
  
  var c16t8 = function (str) { // convert 16-bit string to 8-bit
    for (var out = '', i = 0; i < str.length; i += 1) {
      out += String.fromCharCode((str.charCodeAt(i) >> 8) & 0xff);
      out += String.fromCharCode((str.charCodeAt(i) >> 0) & 0xff);
    }
    return out;
  };
  
  var hmac = function (algo, data, key) {
    var block = Algos[algo].block, klen = key.length;
    var akey, i, ipad = [], opad = [];
    
    akey = Sequence(klen > block ? call(algo, key) : key).raw();
    if (!CGU.is_a(akey, 'array')) return;
    for (i = 0; i < block && CGU.is_a(akey, 'array'); i += 1) {
      ipad[i] = (akey[i] || 0x00) ^ 0x36;
      opad[i] = (akey[i] || 0x00) ^ 0x5c;
    }
    
    var ihash = call(algo, (Sequence(ipad).str() + data));
    return Sequence(opad).str() + Sequence(ihash).str();
  };
  
<%= inc 'crypto/util.*.js', true %>
<%= inc 'crypto/hash.md*.js', true %>
<%= inc 'crypto/hash.sha*.js', true %>
<%= inc 'crypto/hash.ripemd*.js', true %>
  
})();
