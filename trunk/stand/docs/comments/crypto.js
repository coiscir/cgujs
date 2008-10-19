/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Algorithms
 *
 *----
 *    MD4
 *    MD5
 *    SHA-1
 *    SHA-224
 *    SHA-256
 *    RIPEMD-128
 *    RIPEMD-160
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Sequence Objects
 *
 *    Sequences are objects that enable multiple output formats of a hash.
 *
 *----
 *    Formats (methods)
 *
 *      base16 / hex <String>
 *
 *        {0..9 a..f}: hex
 *        {0..9 A..F}: base16
 *
 *      base32 / base32hex <String>
 *
 *        {A..Z 2..7}: base32
 *        {0..9 a..v}: base32hex
 *
 *      base64 / base64url <String>
 *
 *        {A..Z a..z 0..9 + /}: base64
 *        {A..Z a..z 0..9 - _}: base64url
 *
 *      raw <Array>
 *
 *        Get the hash in a byte array.
 *
 *      str <String>
 *
 *        Get the hash in a String of 8-bit characters.
 *
 *----
 *    Methods
 *
 *      valid <Boolean>
 *
 *        Verifies the Sequence was created properly.
 *
 *----
 *    Overwritten Methods
 *
 *      valueOf: same as raw
 *
 *      toString: same as hex
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Properties
 *
 *----
 *    Version
 *
 *      Formatting is based on the date built: Y.MMDD
 *      Where `Y` is the number of years since 2000.
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Methods
 *
 *----
 *    algos
 *
 *      Description: Get a list of all available algorithm calls.
 *
 *      Return: <Array>
 *
 *      Syntax: Crypto.algos(hmac)
 *
 *        hmac <Boolean>: Limit the list to only algorithms with HMAC support.
 *
 *----
 *    hash
 *
 *      Description: Generate a hash from given input.
 *
 *      Return: <<Sequence>>
 *
 *      Syntax: Crypto.hash(call, data [, options])
 *
 *        call <String>: Name of the algorithm to use.
 *
 *        data <String>: The data being hashed.
 *
 *        options <Object>: (Optional)
 *
 *          key <String>: Specify an HMAC key.
 *
 *            Leave this unset to hash without HMAC.
 *
 *          unicode <Boolean>: Convert UTF-16 to UTF-8.
 *
 *----
 *    methodize
 *
 *      Description: Add a String Prototype method for a specific algorithm.
 *
 *      Return: <Boolean>
 *
 *      Syntax: Crypto.methodize(call)
 *
 *        call <String>: The algorithm name to methodize.
 *
 *      Method:
 *
 *        Return: <<Sequence>>
 *
 *        Syntax: String::CALL([options])
 *
 *          options <Object>: (Optional)
 *
 *            Same as for Crypto.hash.
 *
 *----
 *    search
 *
 *      Description: Verify an algorithm is available
 *
 *      Return: <Boolean>
 *
 *      Syntax: Crypto.search(call [, hmac])
 *
 *        call <String>: The algorithm name to search for.
 *
 *        hmac <Boolean>: Limit the search to only algorithms with HMAC support.
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
