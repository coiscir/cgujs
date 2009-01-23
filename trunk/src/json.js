/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - JSON
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function JSON() {
  
  CGU.evalJSON = function (json) {
    return eval('(' + json + ')');
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CGU :: JSON :: from
**/
  CGU.fromJSON = function (json, strict) {
    strict = strict === false ? false : true;
    if (!CGU.is_a(json, String)) return null;
    
    var standard = {
      datetm : /^(?:!.)./,                                 /* match nothing */
      keywrd : /^null|true|false/,
      number : /^(-)?(0(?![x0-9])|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/,
      objkey : /^(?:!.)./,                                 /* match nothing */
      string : /^(")(\\(\1|\\|\/|b|f|n|r|t|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var relaxed = {
      datetm : /^(['"])(\d{4}-\d{2}-\d{2}[T\x20]\d{2}:\d{2}:\d{2}(?:\.\d{3}\d*)?Z?)(\1)/,
      keywrd : /^undefined|null|true|false/,
      number : /^(0([0-7]+|x[0-9a-fA-F]+))|([+-]?(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)/,
      objkey : /^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)/,
      string : /^(['"])(\\(\1|\\|\/|b|f|n|r|t|x[0-9a-f]{1}|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var reWhite  = /^\s+/;
    var reObjKey = strict ? standard.objkey : relaxed.objkey;
    var reDateTm = strict ? standard.datetm : relaxed.datetm;
    var reKeywrd = strict ? standard.keywrd : relaxed.keywrd;
    var reNumber = strict ? standard.number : relaxed.number;
    var reString = strict ? standard.string : relaxed.string;
    
    var cuts = 0; // characters cut from json (i.e. position - 1)
    var cut = function (match) {
      var copy = json.replace(match, '');
      var diff = json.length - copy.length;
      var host = json.substr(0, diff);
      cuts += diff;
      json = copy;
      return host;
    };
    
    var errlen = 40;
    var kill = function (err) {
      var substr = json.substr(0, errlen) + (json.length > errlen ? '...' : '');
      throw new SyntaxError(''.concat(
        'JSON: ', err, ' (', (cuts + 1), ': "', substr, '")'
      ));
    };
    
    var white = function () {
      return cut(reWhite);
    };
    
    var date = function () {
      var str = cut(reDateTm);
      if (!(str.length > 0)) kill("Invalid Date.");
      return CGU.toTime(reDateTm.exec(str)[2]);
    };
    
    var array = function () {
      var host = [];
      cut(/^\[/);
      white();
      if (!(/^\]/).test(json)) {
        do {
          host.push(value());
          white();
        } while (cut(/^,/).length > 0);
      }
      if (!(cut(/^\]/).length > 0))
        kill("Unterminated Array.");
      return host;
    };
    
    var object = function () {
      var host = {};
      
      var key = function () {
        if (reString.test(json)) return eval(cut(reString));
        if (reObjKey.test(json)) return cut(reObjKey);
        kill("Invalid Object key.");
      };
      
      var pair = function () {
        var k = key();
        white();
        if (!(cut(/^\:/).length > 0)) kill("Invalid Object. Expected ':'.");
        white();
        host[k] = value();
      };
      
      cut(/^\{/);
      white();
      if (!(/^\}/).test(json)) {
        do {
          pair();
          white();
        } while (cut(/^,/).length > 0);
      }
      if (!(cut(/^\}/).length > 0)) kill("Unterminated Object.");
      return host;
    };
    
    var value = function () {
      white();
      if ((/^\{/).test(json))  return object();
      if ((/^\[/).test(json))  return array();
      if (reDateTm.test(json)) return date();
      if (reString.test(json)) return eval(cut(reString));
      if (reNumber.test(json)) return eval(cut(reNumber));
      if (reKeywrd.test(json)) return eval(cut(reKeywrd));
      kill('Invalid value');
    };
    
    var start = function () {
      if (json.length == white().length) kill('String is empty.');
      var host = value();
      if (json.length > white().length) kill('Tail data found.');
      return host;
    };
    
    return start();
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * CGU :: JSON :: to
**/
  CGU.toJSON = function (input, strict) {
    strict = strict === false ? false : true;
    
    var date = function (input) {
      return str(CGU.fromTime(input));
    };
    
    var str = function (input) {
      var result = '', enc;
      var escapes = {
        '"'  : '\\"',
        '\b' : '\\b',
        '\f' : '\\f',
        '\n' : '\\n',
        '\r' : '\\r',
        '\t' : '\\t',
        '\\' : '\\\\'
      };
      while (input.length > 0) {
        if (match = input.match(/[\\"]|[\x00-\x1f\x7f]/)) {
          enc = padnum(4, match[0].charCodeAt(0).toString(16));
          
          result += input.slice(0, match.index);
          result += escapes[match[0]] ? escapes[match[0]] : ('\\u' + enc);
          input  = input.slice(match.index + match[0].length);
        } else {
          result += input; input = '';
        }
      }
      return '"' + result + '"';
    };
    
    var arr = function (input) {
      var elems = [];
      CGU.each(input, function (v) {
        v = value(v);
        if (CGU.is_a(v, String)) elems.push(v);
      });
      return '[' + elems.join(', ') + ']';
    };
    
    var obj = function (input) {
      var key = function (k) {
        if (!strict && (/^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)$/).test(k))
          return k.toString();
        return str(k);
      };
      
      var pairs = [];
      CGU.each(CGU.properties(input).sort(), function (v, k) {
        k = key(v);
        v = value(input[v]);
        if (CGU.is_a(v, String)) pairs.push(k + ': ' + v);
      });
      return '{' + pairs.join(', ') + '}';
    };
    
    var value = function (input) {
      switch (CGU.type(input)) {
        case 'undefined': if (strict) return undefined;
        case 'null'     :
        case 'boolean'  :
        case 'number'   : return ''.concat(input);
        case 'date'     : return date(input);
        case 'string'   : return str(input);
        case 'array'    : return arr(input);
        case 'object'   : return obj(input);
        default : return undefined;
      }
    };
    
    var result = value(input);
    return result;
  };
  
})();
