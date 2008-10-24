/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON :: TO
**/
  this.to = this.stringify = function (input, options) {
    options = (function (o) { return {
      allkey : Type.limit(o.allkey, Boolean) || false,
      relax  : Type.limit(o.relax,  Boolean) || false,
      verify : Type.limit(o.verify, Boolean) || false
    };})(options || {});
    
    var object = function (input) {
      var pairs = [], k, v;
      for (var prop in input) {
        if (options.allkey || input.propertyIsEnumerable(prop)) {
          k = string(prop);
          v = value(input[prop]);
          if (Type.is_a(v, String)) pairs.push(k + ' : ' + v);
        }
      }
      return '{' + pairs.join(', ') + '}';
    };
    
    var array = function (input) {
      var elems = [], v;
      for (var i = 0; i < input.length; i += 1) {
        v = value(input[i]);
        if (Type.is_a(v, String)) elems.push(v);
      }
      return '[' + elems.join(', ') + ']';
    };
    
    var string = function (input) {
      var result = '', enc;
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
        if (match = input.match(/[\x00-\x1f\\"]/)) {
          enc = match[0].charCodeAt(0).toString(16); while (enc.length < 2) enc = '0' + enc;
          
          result += input.slice(0, match.index);
          result += specials[match[0]] ? specials[match[0]] : ('\\u00' + enc);
          input  = input.slice(match.index + match[0].length);
        } else {
          result += input; input = '';
        }
      }
      return '"' + result + '"';
    };
    
    var value = function (input) {
      switch (Type.get(input)) {
        case 'object'   : return object(input);
        case 'array'    : return array(input);
        case 'string'   : return string(input);
        case 'number'   :
        case 'boolean'  : return input.toString();
        case 'null'     : return 'null';
        case 'undefined': return options.relax ? 'undefined' : undefined;
        default : return undefined;
      }
    };
    
    var result = value(input);
    if (options.verify) this.from(result, {relax : options.relax});
    return result;
  };
