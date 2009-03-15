/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Crypto
 *  (c) 2008-2009 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
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
  
  CGU = typeof(CGU) == 'undefined' ? {Version: '<%= version %>'} : CGU;
  CGU.Crypto = CGU.Crypto || {};
  
  // host & mask
  var Algos = {};
  var Algo = function (block, keyed, algo) {
    this.algo = algo;
    this.block = block;
    this.keyed = keyed;
  };

<%= inc 2, true, 'cgu.crypto.functions.js' %>
<%= inc 2, true, 'cgu.crypto.sequence.js' %>
<%= inc 2, true, 'cgu.crypto.oper.{32,64}bit.js' %>
<%= inc 2, true, 'cgu.crypto.hash.{md,sha,ripemd}*.js' %>
})();
