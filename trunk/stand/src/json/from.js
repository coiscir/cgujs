/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON :: FROM
**/
  this.from = this.parse = function (json, options) {
    json = Type.limit(json, String) || '';
    options = (function (o) { return {
      dates  : Type.limit(o.dates,  Boolean) || false,
      errlen : Type.limit(o.errlen, Number)  || 20,
      relax  : Type.limit(o.relax,  Boolean) || false
    };})(options || {});
    
    options.errlen = options.errlen > 9 ? options.errlen : 20;
    
    var strict = {
      datetm : /^(")(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?Z(\1)/,
      keywrd : /^null|true|false/,
      number : /^[+-]?(0(?![x0-9])|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/,
      string : /^(")(\\(\1|\\|\/|b|f|n|r|t|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var relaxed = {
      datetm : /^(['"])(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)Z(\1)/,
      keywrd : /^undefined|null|true|false/,
      number : /^(0([0-7]+|x[0-9a-fA-F]+))|([+-]?(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)/,
      string : /^(['"])(\\(\1|\\|\/|b|f|n|r|t|x[0-9a-f]{1}|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var reWhite  = /^\s+/;
    var reObjKey = /^[A-Za-z$_][A-Za-z0-9$_]*/;
    var reDateTm = options.relax ? relaxed.datetm : strict.datetm;
    var reKeywd  = options.relax ? relaxed.keywrd : strict.keywrd;
    var reNumber = options.relax ? relaxed.number : strict.number;
    var reString = options.relax ? relaxed.string : strict.string;
    
    var cuts = 0; // characters cut from json (i.e. position - 1)
    var cut = function (match) {
      var copy = json.replace(match, '');
      var diff = json.length - copy.length;
      var host = json.substr(0, diff);
      cuts += diff;
      json = copy;
      return host;
    };
    
    var kill = function (err) {
      var msg = [
        'JSON:', err,
        [
          '(',
          (cuts + 1),
          ', "',
          json.substr(0, options.errlen),
          (json.length > options.errlen ? '...' : ''),
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
      if (!options.dates) return string();
      var str = cut(reDateTm);
      if (!(str.length > 0)) kill("Invalid Date.");
      var d = reDateTm.exec(str);
      return new Date(Date.UTC(+d[2], +d[3] - 1, +d[4], +d[5], +d[6], +d[7], +d[8] || 0));
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
        if (options.relax) {
          if (reObjKey.test(json)) return cut(reObjKey);
        }
        kill("Invalid Object key.");
      };
      
      var pair = function () {
        white();
        var k = key();
        white();
        if (!(cut(/^\:/).length > 0)) kill("Missing Object value.");
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
      if (!(cut(/^\}/).length > 0))
        kill("Unterminated Object.");
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
      //if (json.length > white().length) kill('Tail data found.');
      return host;
    };
    
    return start();
  };
