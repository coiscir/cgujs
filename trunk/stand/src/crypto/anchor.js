/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript Library
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
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
  this.Version = '<%= serial %>';

<%= include 'crypto.core.js' %>

<%= include 2, true, 'crypto.seq.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Utils
**/
<%= include 2, true, 'crypto.utils.conv.js' %>

<%= include 2, true, 'crypto.utils.fifo.js', 'crypto.utils.filo.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Algorithms
**/
<%= include 2, true, 'hash.md4.js', 'hash.md5.js' %>

<%= include 2, true, 'hash.sha1.js', 'hash.sha224.js', 'hash.sha256.js' %>

<%= include 2, true, 'hash.ripemd128.js', 'hash.ripemd160.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Includes
**/
<%= require 2, 'type' %>

})();
