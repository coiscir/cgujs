/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Crypto
 *    Cryptographic Hash and HMAC Algorithms
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * MD4 (c) 1990 R. Rivest                                           [RFC 1320]
 * MD5 (c) 1992 R. Rivest                                           [RFC 1321]
 * SHA (c) 2006 The Internet Society                                [RFC 4634]
 * RMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Algorithms
 *----
 *
 *  MD4
 *  MD5
 *
 *  SHA-1
 *  SHA-224
 *  SHA-256
 *  SHA-384
 *  SHA-512
 *
 *  RIPEMD-128
 *  RIPEMD-160
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  hash -> Generate a cryptographic hash of given data.
 *
 *    Syntax: CGU.hash(algo, data [, options])
 *
 *      algo <String>: Name of the algorithm to use.
 *
 *      data <String>: The data to be hashed.
 *
 *      options <Object>: Specify hash settings. (optional)
 *
 *        hmac <String>: Specify an HMAC key. HMAC is not used when key is unset.
 *
 *        unicode <Boolean>: Convert data from 16-bit to 8-bit.
 *
 *    Return: <<Sequence>>
 *----
 *
 *  hashes -> Get a list of all available algorithms.
 *
 *    Syntax: Crypto.hashables()
 *
 *    Return: <Array>
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Crypto :: Sequence
 *    An object that enables various encodings for a hash.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  base16 / hex
 *
 *    Syntax: <<Sequence>>.base16([low])
 *    Syntax: <<Sequence>>.hex()
 *
 *      low <Boolean>: If true, same as hex()
 *
 *    Return: <String>
 *
 *      base16: {0..9 A..F}
 *      hex:    {0..9 a..f}
 *----
 *
 *  base32 / base32hex
 *
 *    Syntax: <<Sequence>>.base32([hex])
 *    Syntax: <<Sequence>>.base32hex()
 *
 *      hex <Boolean>: If true, same as base32hex()
 *
 *    Return: <String>
 *
 *      base32:    {A..Z 2..7}
 *      base32hex: {0..9 a..v}
 *----
 *
 *  base64 / base64url
 *
 *    Syntax: <<Sequence>>.base64([url])
 *    Syntax: <<Sequence>>.base64url()
 *
 *      url <Boolean>: If true, same as base64url()
 *
 *    Return: <String>
 *
 *      base64:    {A..Z a..z 0..9 + /}
 *      base64url: {A..Z a..z 0..9 - _}
 *----
 *
 *  raw -> Get the hash in a byte array.
 *
 *    Return: <Array>
 *----
 *
 *  str -> Get the hash in a String
 *
 *    Return: <String>
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Overwritten Methods
 *----
 *
 *  valueOf -> same as `raw`
 *----
 *
 *  toString -> same as `hex`
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Crypto() { // enable private members
  
  CGU.hash = function (algo, data, options) {
    algo = CGU.limit(algo, String);
    data = CGU.limit(data, String);
    options = (function (o) { return {
      hmac    : CGU.limit(o.hmac,    String),
      unicode : CGU.limit(o.unicode, Boolean) || false
    };})(options || {});
    
    if (CGU.is_a(algo, undefined) || CGU.is_a(data, undefined)) return;
    
    algo = ready(algo);
    if (!valid(algo) || CGU.isof(Algos[algo], null, undefined)) return null;
    
    if (!options.unicode && data.match(/[^\x00-\xff]/)) return false;
    
    return Sequence((function () {
      // verify ascii data
      if (options.unicode) {
        data = (function () {
          for (var out = '', i = 0; i < data.length; i += 1) {
            out += String.fromCharCode((data.charCodeAt(i) >> 8) & 0xff);
            out += String.fromCharCode((data.charCodeAt(i) >> 0) & 0xff);
          }
          return out;
        })();
      }
      
      // revise data with HMAC key
      if (CGU.is_a(options.hmac, String)) {
        data = (function (key) {
          var block = Algos[algo].block, klen = key.length;
          var akey, i, ipad = [], opad = [];
          
          akey = Sequence(klen > block ? Algos[algo].algo(key) : key).raw();
          for (i = 0; i < block && CGU.is_a(akey, 'array'); i += 1) {
            ipad[i] = (akey[i] || 0x00) ^ 0x36;
            opad[i] = (akey[i] || 0x00) ^ 0x5C;
          }
          
          var ihash = Algos[algo].algo(Sequence(ipad).str() + data);
          return Sequence(opad).str() + Sequence(ihash).str();
        })(options.hmac);
      }
      
      return Algos[algo].algo(data);
    })());
  };
  
  CGU.hashes = function () {
    var list = [];
    for (var algo in Algos)
      if (Algos.propertyIsEnumerable(algo))
        list.push(algo);
    return CGU.clone(list);
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var Algos = {};
  
  var ready = function (algo) { return algo.replace(/^\s+|\s+$/g, '').toLowerCase(); };
  var valid = function (algo) { return (/^[\$\_a-z][\$\_a-z0-9]*$/i).test(algo); };
  
<%= inc 'crypto/util.*.js', 'crypto/hash.*.js' %>
  
})();
