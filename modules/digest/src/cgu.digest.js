/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Digest
 *  (c) 2008-2009 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD4 (c) 1990 Ronald L. Rivest                                   [RFC 1320]
 *  MD5 (c) 1992 Ronald L. Rivest                                   [RFC 1321]
 *  SHA (c) 2006 The Internet Society                               [RFC 4634]
 *  RIPEMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  MD6 (c) 2008 Ronald L. Rivest
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Digest() { <%= opt('', $/) %>
  CGU = typeof(CGU) !== 'undefined' ? CGU : { Version: '<%= version %>' };
  
  // host & mask
  var Algos = {}, Hash = function (block, keyed, algo) {
    this.algo = algo; this.block = block; this.keyed = keyed;
  };

<%= inc opt(2, 0), opt(true, false),
  'cgu.digest.functions.js',
  'cgu.digest.sequence.js',
  'cgu.digest.oper.{32,64}bit.js',
  'cgu.digest.hash.md{4,5}.js',
  'cgu.digest.hash.sha{1,2}*.js',
  'cgu.digest.hash.ripemd{128,160}.js',
  'cgu.digest.hash.sha3.md6.js'
%>
})();
