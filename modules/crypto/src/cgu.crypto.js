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
<% if @stand %>
  CGU = typeof(CGU) !== 'undefined' ? CGU : {Version: '<%=version%>'};
<% end %>
  
  // host & mask
  var Algos = {};
  var Algo = function (block, keyed, algo) {
    this.algo = algo;
    this.block = block;
    this.keyed = keyed;
  };

<%= inc opt(2, 0), opt(true, false), 'cgu.crypto.functions.js' %><%=opt($/,'')%>
<%= inc opt(2, 0), opt(true, false), 'cgu.crypto.sequence.js' %><%=opt($/,'')%>
<%= inc opt(2, 0), opt(true, false), 'cgu.crypto.oper.{32,64}bit.js' %><%=opt($/,'')%>
<%= inc opt(2, 0), opt(true, false), 'cgu.crypto.hash.{md,sha,ripemd}*.js' %><%=$/%>
})();
