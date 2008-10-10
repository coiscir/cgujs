/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript Library
 *  (c) 2008 Jonathan Lonowski
 *  
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto
 *    Cryptographic Hash and HMAC Alorithms
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * MD4 (c) 1990 R. Rivest                                             [RFC 1320]
 * MD5 (c) 1992 R. Rivest                                             [RFC 1321]
 * SHA (c) 2006 The Internet Society                                  [RFC 4634]
 * RMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
**/

var Crypto = new (function () {
  this.Version = <%= serial(TIME) %>;

<%= include 'crypto.core.js', 'crypto.seq.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Algorithms
**/
<%= jsmin 'hash.md4.js', 'hash.md5.js' %>

<%= jsmin 'hash.sha1.js', 'hash.sha224.js', 'hash.sha256.js' %>

<%= jsmin 'hash.ripemd128.js', 'hash.ripemd160.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Includes
**/
<%= jsmin 'inc.type.js' %>

})();

