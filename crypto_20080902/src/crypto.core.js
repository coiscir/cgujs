/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Core
**/
var Crypto = new (function () {
  this.Version = '1.0.0';
  this.Release = '2008-08-05';
  this.Serials = [1.0, 8.0805];
  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Release serial (index-1) is: 'YYyy-MM-DD' => 'yy.MMDD'
   *
   *  Version serial (index-0) is: 'V.v.R.r Ss' => V.vvRRrrSss
   *    Where: S => Stage, s => Stage Number
   *    And Stage is of:
   *      A {-9} (Alpha)
   *      B {-8} (Beta)
   *      R {-1} (Release Candidate)
   *      S {-0} (Stable) [implied]
   *    E.g.: 0.9999991 (1.0.0a), 1.0 (1.0.0)
  **/
  
  var ftoi  = function (num)  { return num - (num % 1); };
  var ready = function (call) { return call.replace(/^\s+|\s+$/g, '').toLowerCase(); };
  var valid = function (call) { return (/^[\$\_a-z][\$\_a-z0-9]*$/i).test(call); };
  
  var Algos = {};
  
  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *  Crypto.register (Function) (developer-only; not in html docs)
   *    Registers a new algorithm.
   *
   *  | Crypto.register(options)
   *
   *  Return boolean representing success or null if an argument is invalid.
   *
   *  Arguments
   *
   *    options (Object) {
   *      call (String)
   *        name of the algorithm
   *        must be unique; duplicates, including redefining, will be fail
   *        limited to: $ _ a-z 0-9
   *          w/ first: $ _ a-z
   *
   *      algo (Function)
   *        function to be called by Crypto.hash
   *        Arguments
   *          [input] (String) (only 0x00-0xff)
   *        Returns:  Array, Number, String, Crypto.Sequence
   *          used to create a new or cloned Crypto.Sequence
   *
   *      block (Number)
   *        specifies the block character length for HMAC
   *        This is the number of characters in each cycle of a hash function
   *        e.g.: MD5 and SHA-1 are both 64 (512 bits)
   *    }
  **/
  this.register = function (options) {
    options = (function (o) { return {
      call  : (Crypto.Type.limit(o.call,  'string')   ||   ''),
      algo  : (Crypto.Type.limit(o.algo,  'function') || null),
      block : (Crypto.Type.limit(o.block, 'number')   ||    0)
    };})(options || {});
    
    if (valid(ready(options.call)) && options.algo) {
      options.block = options.block < 0 ? 0 : ftoi(options.block);
      
      try {
        var test = Crypto.Sequence(options.algo(''));
        if (!test.valid()) return;
        if (options.block > 0 && test.raw().length > options.block)
          options.block = 0;
      } catch (e) {}
      
      var CALL = ready(options.call), METHOD = function (options) {
        return Crypto.hash(CALL, Crypto.Type.clone(this), options);
      };
      
      if (Crypto.Type.isof(Algos[options.call], 'undefined')) {
        Algos[CALL] = {
          call   : CALL,
          algo   : options.algo,
          block  : options.block,
          method : METHOD
        };
        return true;
      }
      return false;
    };
  };
  
  this.algos = function (hmac) {
    hmac = Crypto.Type.limit(hmac, 'boolean') || false;
    
    var list = [];
    for (var call in Algos)
      if (Algos.propertyIsEnumerable(call))
        if (!hmac || Algos[call].block > 0)
          list.push(Crypto.Type.clone(call));
    return list;
  };
  
  this.search = function (call, hmac) {
    call = Crypto.Type.limit(call, 'string')  ||    '';
    hmac = Crypto.Type.limit(hmac, 'boolean') || false;
    
    var CALL = ready(call), a, algos = Crypto.Type.clone(this.algos());
    if (!valid(CALL)) return;
    for (a = 0; a < algos.length; a += 1)
      if (algos[a] === CALL && (!hmac || Algos[call].block > 0))
        return true;
    return false;
  };
  
  this.methodize = function (call) {
    call = ready(Crypto.Type.limit(call, 'string') || '');
    if (!this.search(call)) return;
    
    if (String.prototype[call] === Algos[call].method) return true;
    if (Crypto.Type.isof(String.prototype[call], 'null', 'undefined')) {
      String.prototype[call] = Algos[call].method;
      return true;
    }
    return false;
  };
  
  this.hash = function (call, data, options) {
    call = Crypto.Type.limit(call, 'string') || '';
    data = Crypto.Type.limit(data, 'string');
    options = (function (o) { return {
      unicode : (Crypto.Type.limit(o.unicode, 'boolean') || false),
      key     : (Crypto.Type.limit(o.key,     'string'))
    };})(options || {});
    
    return Crypto.Sequence((function () {
      call = ready(call);
      if (!valid(call) || !Crypto.Type.isof(data, 'string')) return;
      
      // check for call
      if (!Crypto.search(call)) return false;
      
      // verify ascii data
      if (options.unicode) {
        data = (function () {
          for (var out = '', i = 0; i < data.length; i += 1) {
            out += String.fromCharCode((data.charCodeAt(i) >> 8) & 0xff);
            out += String.fromCharCode((data.charCodeAt(i) >> 0) & 0xff);
          }
          return out;
        })();
      } else {
        if (data.match(/[^\x00-\xff]/)) return false;
      }
      
      // revise data with HMAC key
      if (Crypto.Type.isof(options.key, 'string')) {
        if (!Crypto.search(call, true)) return false;
        data = (function (data, key) {
          var block = Algos[call].block, klen = key.length;
          var akey, i, ipad = [], opad = [];
          
          akey = Crypto.Sequence(klen > block ? Algos[call].algo(key) : key).raw();
          for (i = 0; i < block && Crypto.Type.isof(akey, 'array'); i += 1) {
            ipad[i] = (akey[i] || 0x00) ^ 0x36;
            opad[i] = (akey[i] || 0x00) ^ 0x5C;
          }
          
          var ihash = Algos[call].algo(Crypto.Sequence(ipad).str() + data);
          return Crypto.Sequence(opad).str() + Crypto.Sequence(ihash).str();
        })(data, options.key);
      }
      
      // final hash
      return Algos[call].algo(data);
    })());
  };
})();
