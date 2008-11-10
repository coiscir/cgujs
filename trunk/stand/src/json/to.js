/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON :: TO
**/
  this.to = this.stringify = function (input, options) {
    options = (function (o) { return {
      allkey : Type.limit(o.allkey, Boolean)         || false,
      ascii  : Type.limit(o.ascii,  Boolean)         || false,
      relax  : Type.limit(o.relax,  Boolean, Object) || false,
      verify : Type.limit(o.verify, Boolean)         || false
    };})(options || {});
    
    options.relax = (function (r) {
      var global = Type.limit(r, Boolean) || false;
      return {
        date    : Type.limit(r.date,    Boolean) || global,
        keyword : Type.limit(r.keyword, Boolean) || global,
        objkey  : Type.limit(r.objkey,  Boolean) || global
      };
    })(options.relax || false);
    
    var string = function (input) {
      var result = '', enc;
      var against = options.ascii ? /[\\"]|[^\x20-\x7e]/ : /[\x00-\x1f\\"\x7f]/;
      var specials = {
        '"'  : '\\"',
        '\b' : '\\b',
        '\f' : '\\f',
        '\n' : '\\n',
        '\r' : '\\r',
        '\t' : '\\t',
        '\\' : '\\\\'
      };
      while (input.length > 0) {
        if (match = input.match(against)) {
          enc = padnum(4, match[0].charCodeAt(0).toString(16));
          
          result += input.slice(0, match.index);
          result += specials[match[0]] ? specials[match[0]] : ('\\u' + enc);
          input  = input.slice(match.index + match[0].length);
        } else {
          result += input; input = '';
        }
      }
      return '"' + result + '"';
    };
    
    var date = function (input) {
      if (!options.relax.date) return undefined;
      return string(Time.strfutc("%FT%T.%NZ", input));
    };
    
    var array = function (input) {
      var elems = [], v;
      for (var i = 0; i < input.length; i += 1) {
        v = value(input[i]);
        if (Type.is_a(v, String)) elems.push(v);
      }
      return '[' + elems.join(', ') + ']';
    };
    
    var object = function (input) {
      var key = function (k) {
        if (options.relax.objkey)
          if ((/^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)$/).test(k))
            return k.toString();
        return string(k);
      };
      
      var pairs = [], k, v;
      for (var prop in input) {
        if (options.allkey || input.propertyIsEnumerable(prop)) {
          k = key(prop);
          v = value(input[prop]);
          if (Type.is_a(v, String)) pairs.push(k + ': ' + v);
        }
      }
      return '{' + pairs.join(', ') + '}';
    };
    
    var value = function (input) {
      switch (Type.get(input)) {
        case 'object'   : return object(input);
        case 'array'    : return array(input);
        case 'date'     : return date(input);
        case 'string'   : return string(input);
        case 'number'   :
        case 'boolean'  : return input.toString();
        case 'null'     : return 'null';
        case 'undefined': if (options.relax.keyword) return 'undefined';
        default : return undefined;
      }
    };
    
    var result = value(input);
    if (options.verify) this.from(result, {relax : options.relax});
    return result;
  };
