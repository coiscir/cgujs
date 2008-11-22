/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Crypto
 *    Cryptographic Hash and HMAC Algorithms
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * MD4 (c) 1990 R. Rivest                                           [RFC 1320]
 * MD5 (c) 1992 R. Rivest                                           [RFC 1321]
 * SHA (c) 2006 The Internet Society                                [RFC 4634]
 * RMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  hash -> Generate the cryptographic hash of the data.
 *
 *    Syntax: CGU.hash(algo, data [, options])
 *
 *      algo <String>: Name of the algorithm to use.
 *
 *      data <String>: The data to be hashed.
 *
 *      options <Object>: Specify hash settings. (optional)
 *
 *        key <String>: Specify an HMAC key. HMAC is not used when key is unset.
 *
 *        unicode <Boolean>: Convert data from 16-bit to 8-bit.
 *
 *    Return: <<Sequence>>
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Crypto() { // enable private members
  
  CGU.hash = function (algo, data, options) {
    algo = CGU.limit(algo, String);
    data = CGU.limit(data, String);
    options = (function (o) { return {
      key     : CGU.limit(o.key,     String),
      unicode : CGU.limit(o.unicode, Boolean) || false
    };})(options || {});
    
    return Sequence((function () {
      if (CGU.is_a(algo, undefined) || CGU.is_a(data, undefined)) return;
      
      algo = ready(algo);
      if (!valid(algo) || CGU.isof(Algos[algo], null, undefined)) return null;
      
      // verify ascii data
      if (options.unicode)
        data = (function () {
          for (var out = '', i = 0; i < data.length; i += 1) {
            out += String.fromCharCode((data.charCodeAt(i) >> 8) & 0xff);
            out += String.fromCharCode((data.charCodeAt(i) >> 0) & 0xff);
          }
          return out;
        })();
      else
        if (data.match(/[^\x00-\xff]/)) return false;
      
      // revise data with HMAC key
      if (CGU.is_a(options.key, String)) {
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
        })(options.key);
      }
      
      return Algos[algo].algo(data);
    })());
  };
  
  CGU.hash.algos = function () {
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
