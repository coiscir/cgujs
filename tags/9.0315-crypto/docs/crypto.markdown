### CGU Crypto 9.0315 ###

`CGU.Crypto.algos([keyed])` - List available algorithms.

> `keyed` - Boolean - List all (`null`/`undefined`), keyed (`true`), or HMAC (`false`) algorithms.

`CGU.Crypto.hash(algo, data [, key [, bytes]])` - Generate a hash of data.

> `algo` - String - Name of the algorithm to use.

> `data` - String - Input to be hashed.

> `key` - String - Specify a key for keyed algorithms. (For future support)

> `bytes` - Boolean - Option to use to8bit on data before hashing (`true`).

`CGU.Crypto.hmac(algo, data, key, bytes)`

> _Same arguments as hash. `key` specifies an HMAC key, instead._

`CGU.Crypto.to8bit(string)` - Prepare an 16-bit String for hashing.
