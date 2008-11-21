/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON :: FROM
**/
  this.from = this.parse = function (json, options) {
    json = Type.limit(json, String) || '';
    options = (function (o) { return {
      errlen : Type.limit(o.errlen, Number)         || 20,
      relax  : Type.limit(o.relax, Boolean, Object) || false
    };})(options || {});
    
    options.errlen = options.errlen > 9 ? options.errlen : 20;
    options.relax  = (function (r) {
      var global = Type.limit(r, Boolean) || false;
      return {
        date    : Type.limit(r.date,    Boolean) || global,
        keyword : Type.limit(r.keyword, Boolean) || global,
        number  : Type.limit(r.number,  Boolean) || global,
        objkey  : Type.limit(r.objkey,  Boolean) || global,
        string  : Type.limit(r.string,  Boolean) || global
      };
    })(options.relax || false);
    
    var strict = {
      datetm : /^(?:!.)./,                                   /* match nothing */
      keywrd : /^null|true|false/,
      number : /^(-)?(0(?![x0-9])|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?/,
      objkey : /^(?:!.)./,                                   /* match nothing */
      string : /^(")(\\(\1|\\|\/|b|f|n|r|t|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    
    var relaxed = {
      datetm : /^(['"])(\d{4})-(\d{2})-(\d{2})[T\x20](\d{2}):(\d{2}):(\d{2})(?:\.(\d{3})\d*)?Z?(\1)/,
      keywrd : /^undefined|null|true|false/,
      number : /^(0([0-7]+|x[0-9a-fA-F]+))|([+-]?(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)/,
      objkey : /^([0-9]+|[A-Za-z$_][A-Za-z0-9$_]*)/,
      string : /^(['"])(\\(\1|\\|\/|b|f|n|r|t|x[0-9a-f]{1}|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };
    /** Potentials
     * regexp : /^(\/)((?:\\(?:\1|.)|(?!(?:\\|\1)).)*)(\1)([igm]*)/
    **/
    
    var reWhite  = /^\s+/;
    var reObjKey = options.relax.objkey  ? relaxed.objkey : strict.objkey;
    var reDateTm = options.relax.date    ? relaxed.datetm : strict.datetm;
    var reKeywd  = options.relax.keyword ? relaxed.keywrd : strict.keywrd;
    var reNumber = options.relax.number  ? relaxed.number : strict.number;
    var reString = options.relax.string  ? relaxed.string : strict.string;
    
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
          ': "',
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
      var str = cut(reDateTm);
      if (!(str.length > 0)) kill("Invalid Date.");
      var d = reDateTm.exec(str);
      return new Date(Time.utc(+d[2], +d[3] - 1, +d[4], +d[5], +d[6], +d[7], +d[8]));
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
