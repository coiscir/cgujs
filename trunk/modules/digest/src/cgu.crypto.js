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

(function Crypto() { <%= opt('', $/) %>
  CGU = typeof(CGU) !== 'undefined' ? CGU : {
    Version: '<%= version %>'
  };
  
  // host & mask
  var Algos = {};
  var Hash = function (block, keyed, algo) {
    this.algo = algo;
    this.block = block;
    this.keyed = keyed;
  };

<%= inc opt(2, 0), opt(true, false),
  'cgu.crypto.functions.js',
  'cgu.crypto.sequence.js',
  'cgu.crypto.oper.{32,64}bit.js',
  'cgu.crypto.hash.md{4,5}.js',
  'cgu.crypto.hash.sha{1,2}*.js',
  'cgu.crypto.hash.ripemd{128,160}.js',
  'cgu.crypto.hash.sha3.md6.js'
%>
})();
