/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: JSON
 *    JSON Parsing and Writing
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function JSON() { // enable private members
  
  CGU.fromJSON = function (json, strict) {
    strict = CGU.limit(strict, Boolean) || false;
    
    if (CGU.is_a(json, String)) return null;
    
    var standard = {
      datetm : /^(?:!.)./,                                 /* match nothing */
      keywrd : /^null|true|false/,
      number : /^(-)?(0(?![x0-9])|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/,
      objkey : /^(?:!.)./,                                 /* match nothing */
      string : /^(")(\\(\1|\\|\/|b|f|n|r|t|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var relaxed = {
      datetm : /^(['"])(\d{4})-(\d{2})-(\d{2})[T\x20](\d{2}):(\d{2}):(\d{2})(?:\.(\d{3})\d*)?Z?(\1)/,
      keywrd : /^undefined|null|true|false/,
      number : /^(0([0-7]+|x[0-9a-fA-F]+))|([+-]?(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)/,
      objkey : /^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)/,
      string : /^(['"])(\\(\1|\\|\/|b|f|n|r|t|x[0-9a-f]{1}|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var reWhite  = /^\s+/;
    var reObjKey = strict ? standard.objkey : relaxed.objkey;
    var reDateTm = strict ? standard.datetm : relaxed.datetm;
    var reKeywd  = strict ? standard.keywrd : relaxed.keywrd;
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
      var msg = [
        'JSON:', err,
        [
          '(',
          (cuts + 1),
          ': "',
          json.substr(0, errlen),
          (json.length > errlen ? '...' : ''),
          '")'
        ].join('')
      ].join(' ');
      throw new SyntaxError(msg);
    };
    
    var white = function () {
      return cut(reWhite);
    };
    
    var keyword = function () {
      var word = cut(reKeywd);
      if (!(word.length > 0)) kill("Invalid keyword.");
      return eval(word);
    };
    
    var number = function () {
      var num = cut(reNumber);
      if (!(num.length > 0)) kill("Invalid Number.");
      return eval(num);
    };
    
    var string = function () {
      var str = cut(reString);
      if (!(str.length > 0)) kill("Invalid String.");
      return eval(str);
    };
    
    var date = function () {
      var str = cut(reDateTm);
      if (!(str.length > 0)) kill("Invalid Date.");
      var d = reDateTm.exec(str);
      return new Date(CGU.utc(+d[2], +d[3] - 1, +d[4], +d[5], +d[6], +d[7], +d[8]));
    };
    
    var array = function () {
      var host = [];
      cut(/^\[/);
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
        if (reString.test(json)) return string();
        if (reObjKey.test(json)) return cut(reObjKey);
        kill("Invalid Object key.");
      };
      
      var pair = function () {
        white();
        var k = key();
        white();
        if (!(cut(/^\:/).length > 0)) kill("Invalid Object. Expected ':'.");
        white();
        var v = value();
        host[k] = v;
      };
      
      cut(/^\{/);
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
      if (reString.test(json)) return string();
      if (reNumber.test(json)) return number();
      if (reKeywd.test(json))  return keyword();
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
  
  CGU.toJSON = function (input, options) {
    options = (function (o) { return {
      allkey : CGU.limit(o.allkey, Boolean)         || false,
      ascii  : CGU.limit(o.ascii,  Boolean)         || false,
      relax  : CGU.limit(o.relax,  Boolean, Object) || false,
      verify : CGU.limit(o.verify, Boolean)         || false
    };})(options || {});
    
    var string = function (input) {
      var result = '', enc;
      var against = options.ascii ? /[\\"]|[^\x20-\x7e]/ : /[\\"]|[\x00-\x1f\x7f]/;
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
      if (!options.relax) return undefined;
      return string(CGU.strfutc("%FT%T.%NZ", input));
    };
    
    var array = function (input) {
      var elems = [], v;
      for (var i = 0; i < input.length; i += 1) {
        v = value(input[i]);
        if (CGU.is_a(v, String)) elems.push(v);
      }
      return '[' + elems.join(', ') + ']';
    };
    
    var object = function (input) {
      var key = function (k) {
        if (options.relax)
          if ((/^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)$/).test(k))
            return k.toString();
        return string(k);
      };
      
      var pairs = [], k, v;
      for (var prop in input) {
        if (options.allkey || input.propertyIsEnumerable(prop)) {
          k = key(prop);
          v = value(input[prop]);
          if (CGU.is_a(v, String)) pairs.push(k + ': ' + v);
        }
      }
      return '{' + pairs.join(', ') + '}';
    };
    
    var value = function (input) {
      switch (CGU.type(input)) {
        case 'object'   : return object(input);
        case 'array'    : return array(input);
        case 'date'     : return date(input);
        case 'string'   : return string(input);
        case 'number'   :
        case 'boolean'  : return input.toString();
        case 'null'     : return 'null';
        case 'undefined': if (options.relax) return 'undefined';
        default : return undefined;
      }
    };
    
    var result = value(input);
    if (options.verify) this.from(result, {relax : options.relax});
    return result;
  };
  
})();
