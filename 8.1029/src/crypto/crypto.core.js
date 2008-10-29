/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Crypto :: Core
**/
  var ftoi  = function (num)  { return num - (num % 1); };
  var ready = function (call) { return call.replace(/^\s+|\s+$/g, '').toLowerCase(); };
  var valid = function (call) { return (/^[\$\_a-z][\$\_a-z0-9]*$/i).test(call); };
  
  var Algos = {};
  
  this.algos = function (hmac) {
    hmac = Type.limit(hmac, Boolean) || false;
    
    var list = [];
    for (var call in Algos)
      if (Algos.propertyIsEnumerable(call))
        if (!hmac || Algos[call].block > 0)
          list.push(Type.clone(call));
    return list;
  };
  
  this.search = function (call, hmac) {
    call = Type.limit(call, String)  ||    '';
    hmac = Type.limit(hmac, Boolean) || false;
    
    var CALL = ready(call), a, algos = Type.clone(this.algos());
    if (!valid(CALL)) return;
    for (a = 0; a < algos.length; a += 1)
      if (algos[a] === CALL && (!hmac || Algos[call].block > 0))
        return true;
    return false;
  };
  
  this.methodize = function (call) {
    call = ready(Type.limit(call, String) || '');
    if (!this.search(call)) return;
    
    if (String.prototype[call] === Algos[call].method) return true;
    if (Type.isof(String.prototype[call], null, undefined)) {
      String.prototype[call] = Algos[call].method;
      return true;
    }
    return false;
  };
  
  this.hash = function (call, data, options) {
    call = Type.limit(call, String) || '';
    data = Type.limit(data, String);
    options = (function (o) { return {
      unicode : Type.limit(o.unicode, Boolean) || false,
      key     : Type.limit(o.key,     String)
    };})(options || {});
    
    return Sequence((function () {
      call = ready(call);
      if (!valid(call) || !Type.is_a(data, String)) return;
      
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
      if (Type.is_a(options.key, 'string')) {
        if (!Crypto.search(call, true)) return false;
        data = (function (data, key) {
          var block = Algos[call].block, klen = key.length;
          var akey, i, ipad = [], opad = [];
          
          akey = Sequence(klen > block ? Algos[call].algo(key) : key).raw();
          for (i = 0; i < block && Type.is_a(akey, 'array'); i += 1) {
            ipad[i] = (akey[i] || 0x00) ^ 0x36;
            opad[i] = (akey[i] || 0x00) ^ 0x5C;
          }
          
          var ihash = Algos[call].algo(Sequence(ipad).str() + data);
          return Sequence(opad).str() + Sequence(ihash).str();
        })(data, options.key);
      }
      
      // final hash
      return Algos[call].algo(data);
    })());
  };
