/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto
 *    Cryptographic Hash and HMAC Algorithms
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * MD4 (c) 1990 R. Rivest                                             [RFC 1320]
 * MD5 (c) 1992 R. Rivest                                             [RFC 1321]
 * SHA (c) 2006 The Internet Society                                  [RFC 4634]
 * RMD (c) 1996 Hans Dobbertin, Antoon Bosselaers, and Bart Preneel
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Algorithms
 *
 *  MD4
 *  MD5
 *
 *  SHA-1
 *  SHA-224
 *  SHA-256
 *
 *  RIPEMD-128
 *  RIPEMD-160
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *
 *  algos -> Get a list of all available algorithm calls.
 *
 *    Syntax: Crypto.algos([hmac])
 *
 *      hmax <Boolean>: Limit the list to only algmorithms supporting HMAC.
 *
 *    Return: <Array>
 *----
 *
 *  hash -> Generate the cryptographic hash of the data.
 *
 *    Syntax: Crypto.hash(call, data [, options])
 *
 *      call <String>: Name of the algorithm to use.
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
 *----
 *
 *  methodize -> Create a String prototype method for an algorithm.
 *
 *    Syntax: Crypto.methodize(call)
 *
 *      call <String>: Name of the algorithm to methodize.
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <undefined>: call was not specified.
 *
 *    Method:
 *
 *      Syntax: (<String>).{CALL}([options])
 *
 *        {CALL}: Name of the algorithm that was methodized.
 *
 *        options: (Same as Crypto.hash)
 *----
 *
 *  search -> Verify an algorithm is available.
 *
 *    Syntax: Crypto.search(call [, hmac])
 *
 *      call <String>: Name of the algorithm to search for.
 *
 *      hmac <Boolean>: Limit the search to only algorithms suppoorting HMAC.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Sequence
 *
 *    An object that enables various output types for a hash.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *  base16 / hex
 *
 *    Return: <String>
 *
 *      base16: {0..9 A..F}
 *      hex:    {0..9 a..f}
 *
 *  base32 / base32hex
 *
 *    Return: <String>
 *
 *      base32:    {A..Z 2..7}
 *      base32hex: {0..9 a..v}
 *
 *  base64 / base64url
 *
 *    Return: <String>
 *
 *      base64:    {A..Z a..z 0..9 + /}
 *      base64url: {A..Z a..z 0..9 - _}
 *
 *  raw -> Get the hash in a byte array.
 *
 *    Return: <Array>
 *
 *  str -> Get the hash in a String
 *
 *    Return: <String>
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Overwritten Methods
 *
 *  valueOf -> same as `raw`
 *
 *  toString -> same as `hex`
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Crypto = CGUS.Crypto = new (function () {

<%= inc 'crypto.core.js' %>

<%= inc 2, true, 'crypto.seq.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Utils
**/
<%= inc 2, true, 'crypto.utils.conv.js' %>

<%= inc 2, true, 'crypto.utils.fifo.js', 'crypto.utils.filo.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Algorithms
**/
<%= inc 2, true, 'hash.md4.js', 'hash.md5.js' %>

<%= inc 2, true, 'hash.sha1.js', 'hash.sha224.js', 'hash.sha256.js' %>

<%= inc 2, true, 'hash.ripemd128.js', 'hash.ripemd160.js' %>

})();
