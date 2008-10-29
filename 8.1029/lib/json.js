/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON
 *    JSON Parsing and Writing
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *
 *  from -> Create an object from a JSON-formatted string.
 *
 *    Alias: JSON.parse
 *
 *    Syntax: JSON.from(json [, options])
 *
 *      json <String>: A JSON-formatted string to parse.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        errlen <Number>: Code snippet length for exceptions.
 *
 *        relax <Boolean>: Set all relax properties the same.
 *        relax <Object>: Allow extra parsing for various conditions.
 *
 *          date <Boolean>: Parse UTC date strings.
 *
 *          keyword <Boolean>: Allow the keyword undefined.
 *
 *          number <Boolean>: Allow hexideciml and octal numbers.
 *
 *          objkey <Boolean>: Allow un-quoted object keys.
 *                            Limited to alphanumeric, underscore and dollar.
 *
 *          string <Boolean>: Allow single-quoted strings and hex encoding.
 *
 *    Return: <Mixed>: Object created.
 *
 *      <SyntaxError>: Exception thrown for mal-formed strings.
 *
 *        Format: "JSON: {message} ({position}, {snippet})
 *----
 *
 *  to -> Create JSON-formatted string from an object.
 *
 *    Alias: JSON.stringify
 *
 *    Syntax: JSON.to(input [, options])
 *
 *      input <Mixed>: Object being stringified.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        allkey <Number>: Don't limit object keys to enumerables.
 *                         Otherwise: {object}.propertyIsEnumerable(property)
 *
 *        relax <Boolean>: Set all relax properties the same.
 *        relax <Object>: Allow extra parsing for various conditions.
 *
 *          date <Boolean>: Parse UTC date strings.
 *
 *          keyword <Boolean>: Allow the keyword undefined.
 *
 *        verify <Boolean>: Use JSON.from to verify string.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var JSON = new (function () {
  this.Version = '8.1029';

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
      datetm : /^(['"])(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?)Z(\1)/,
      keywrd : /^undefined|null|true|false/,
      number : /^(0([0-7]+|x[0-9a-fA-F]+))|([+-]?(0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[Ee][+-]?[0-9]+)?)/,
      objkey : /^[A-Za-z$_][A-Za-z0-9$_]*/,
      string : /^(['"])(\\(\1|\\|\/|b|f|n|r|t|x[0-9a-f]{1}|u[0-9a-f]{4})|(?!(\\|\1)).)*(\1)/
    };

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

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: JSON :: TO
**/
  var padnum = function (length, number) {
    number = String(number);
    while (number.length < length) number = '0' + number;
    return number;
  };

  this.to = this.stringify = function (input, options) {
    options = (function (o) { return {
      allkey : Type.limit(o.allkey, Boolean)         || false,
      relax  : Type.limit(o.relax,  Boolean, Object) || false,
      verify : Type.limit(o.verify, Boolean)         || false
    };})(options || {});

    options.relax = (function (r) {
      var global = Type.limit(r, Boolean) || false;
      return {
        date    : Type.limit(r.date,    Boolean) || global,
        keyword : Type.limit(r.keyword, Boolean) || global
      };
    })(options.relax || false);

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

    var date = function (input) {
      if (!options.relax.date) return undefined;
      return '"' + ''.concat(
        padnum(4, input.getUTCFullYear()), '-',
        padnum(2, input.getUTCMonth() + 1), '-',
        padnum(2, input.getUTCDate()), 'T',
        padnum(2, input.getUTCHours()), ':',
        padnum(2, input.getUTCMinutes()), ':',
        padnum(2, input.getUTCSeconds()), '.',
        padnum(3, input.getUTCMilliseconds()), 'Z'
      ) + '"';

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
          enc = padnum(2, match[0].charCodeAt(0).toString(16));

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
        case 'date'     : return date(input);
        case 'string'   : return string(input);
        case 'number'   :
        case 'boolean'  : return input.toString();
        case 'null'     : return 'null';
        case 'undefined': return options.relax.keyword ? 'undefined' : undefined;
        default : return undefined;
      }
    };

    var result = value(input);
    if (options.verify) this.from(result, {relax : options.relax});
    return result;
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Includes
**/
  var Type=new(function(){this.Version='8.1029';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',ERR='error',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,ERR,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object instanceof Error)return ERR;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){switch(this.get(object)){case NUL:return null;case ARR:case BLN:case ERR:case FNC:case NUM:case OBJ:case RGX:case STR:return object.valueOf();case DTE:return new Date(object.valueOf());default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
