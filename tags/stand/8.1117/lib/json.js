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
  this.Version = '8.1117';

  var padnum = function (l, n) { n=String(n); while(n.length<l) n='0'+n; return n; };

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


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Requires
**/
  var Time=new(function(){this.Version='8.1117';var _abs=this.abs=function(yr,mn,dy,hr,mi,sc,ms){var date=new Date(0);date.setFullYear(0,0,1);date.setHours(0,0,0,0);if(Number(yr))date.setFullYear(yr);if(Number(mn))date.setMonth(mn);if(Number(dy))date.setDate(dy);if(Number(hr))date.setHours(hr);if(Number(mi))date.setMinutes(mi);if(Number(sc))date.setSeconds(sc);if(Number(ms))date.setMilliseconds(ms);return date.getTime();};var _utc=this.utc=function(yr,mn,dy,hr,mi,sc,ms){var date=new Date(0);date.setUTCFullYear(0,0,1);date.setUTCHours(0,0,0,0);if(Number(yr))date.setUTCFullYear(yr);if(Number(mn))date.setUTCMonth(mn);if(Number(dy))date.setUTCDate(dy);if(Number(hr))date.setUTCHours(hr);if(Number(mi))date.setUTCMinutes(mi);if(Number(sc))date.setUTCSeconds(sc);if(Number(ms))date.setUTCMilliseconds(ms);return date.getTime();};var phpf=function(format,base){format=Type.clone(format).split('');var lang=_lang.en;var month_c=[31,(base.l?29:28),31,30,31,30,31,31,30,31,30,31];var buffer='',rfc_colon=true;for(var i=0;i<format.length;i+=1){rfc_colon=true;switch(format[i]){case'd':buffer+=padnum(2,base.d);break;case'D':buffer+=lang.week_full[base.w].substr(0,3);break;case'j':buffer+=base.d;break;case'l':buffer+=lang.week_full[base.w];break;case'N':buffer+=tumblesh(base.w,7);break;case'S':buffer+=lang.ordinal[between(base.d,10,19)?0:(base.d%10)]||ordinal[0]||'';break;case'w':buffer+=base.w;break;case'z':buffer+=ftoi((base.$$-base.jc)/day);break;case'W':buffer+=padnum(2,(ftoi((ftoi(base.$$/day)-tumble(base.w,7)-ftoi((base.$$>base.an?base.an:base.ac)/day))/7)+1));break;case'F':buffer+=lang.month_full[base.m];break;case'm':buffer+=padnum(2,base.n);break;case'M':buffer+=lang.month_full[base.m].substr(0,3);break;case'n':buffer+=base.n;break;case't':buffer+=month_c[base.m];break;case'L':buffer+=base.l?1:0;break;case'o':buffer+=padnum(4,((base.$$<base.ac?(base.y-1):(base.$$>=base.an?(base.y+1):base.y))));break;case'Y':buffer+=padnum(4,base.y);break;case'y':buffer+=padnum(2,(base.y%100));break;case'a':buffer+=lang.meridiem[base.h<12?2:3];break;case'A':buffer+=lang.meridiem[base.h<12?0:1];break;case'a':buffer+=base.h<12?'am':'pm';break;case'A':buffer+=base.h<12?'AM':'PM';break;case'B':buffer+=padnum(3,(((ftoi(((base.h*3600)+(base.i*60)+base.s+((base.o+60)*60))/swb))+1000)%1000));break;case'g':buffer+=tumblesh((base.h%12),12);break;case'G':buffer+=base.h;break;case'h':buffer+=padnum(2,tumblesh((base.h%12),12));break;case'H':buffer+=padnum(2,base.h);break;case'i':buffer+=padnum(2,base.i);break;case's':buffer+=padnum(2,base.s);break;case'u':buffer+=padnum(6,base.$u);break;case'e':break;case'I':buffer+=base.t?1:0;break;case'O':rfc_colon=false;case'P':buffer+=''.concat((base.z<0?'-':'+'),(padnum(2,Math.abs(ftoi(base.z/60)))),(rfc_colon?':':''),(padnum(2,Math.abs(base.z%60))));break;case'T':break;case'Z':buffer+=base.z*60;break;case'c':buffer+=phpf('Y-m-d\\TH:i:sP',base);break;case'r':buffer+=phpf('D, d M Y H:i:s O',base);break;case'U':buffer+=base.$t;break;case'\\':i+=1;default:buffer+=(format[i]||'');break;}}return buffer;};this.phpdate=function(format,time){format=Type.limit(format,String)||'';time=new Date(Type.limit(time,Date,Number,String)||new Date().getTime());if(time!=0&&!time)return;if(!inrange(time,false))return null;return phpf(format,setbase(time,false));};this.phputc=function(format,time){format=Type.limit(format,String)||'';time=new Date(Type.limit(time,Date,Number,String)||new Date().getTime());if(time!=0&&!time)return;if(!inrange(time,true))return null;return phpf(format,setbase(time,true));};var strflocale=function(utc){var swap=function(c){return(_locale[utc?'utc':'local'][c]||'').replace(/%%|%([A-Za-z])\1*/g,function($1){switch($1){case'%%':return'%%';case'%C':return'%C';case'%d':return'%e';case'%dd':return'%d';case'%H':return'%l';case'%HH':return'%I';case'%HHH':return'%k';case'%HHHH':return'%H';case'%M':return'%M';case'%MM':return'%M';case'%m':return'%m';case'%mm':return'%m';case'%mmm':return'%b';case'%mmmm':return'%B';case'%o':return'';case'%p':return'%p';case'%S':return'%S';case'%SS':return'%S';case'%SSS':return'';case'%SSSS':return'%s';case'%W':return'%W';case'%WW':return'%U';case'%WWW':return'%V';case'%w':return'%w';case'%ww':return'%u';case'%www':return'%a';case'%wwww':return'%A';case'%yy':return'%y';case'%yyy':return'%G';case'%yyyy':return'%Y';case'%Z':return'%Z';case'%ZZ':return'%Z';case'%ZZZ':return'%Z';case'%ZZZZ':return'%Z';case'%z':return'%z';case'%zz':return'%z';default:return'';}});};return{c:swap('c'),x:swap('x'),X:swap('X')};};var strf=function(format,base,locale){format=Type.clone(format).split('');var lang=_lang[$lang]||_lang[defaultLanguage];var buffer='';for(var i=0;i<format.length;i+=1){if(format[i]=='%'){switch(format[(i+=1)]){case'a':buffer+=lang.week_abbr[base.w]||lang.week_full[base.w].substr(0,3);break;case'A':buffer+=lang.week_full[base.w];break;case'b':buffer+=lang.month_abbr[base.m]||lang.month_full[base.w].substr(0,3);break;case'B':buffer+=lang.month_full[base.m];break;case'c':buffer+=strf(locale.c,base);break;case'C':buffer+=padnum(2,ftoi(base.y/100));break;case'd':buffer+=padnum(2,base.d);break;case'D':buffer+=strf('%m/%d/%y',base);break;case'e':buffer+=padspc(2,base.d);break;case'E':break;case'F':buffer+=strf('%Y-%m-%d',base);break;case'g':buffer+=padnum(2,strf('%G',base)%100);break;case'G':buffer+=padnum(4,((base.$$<base.ac?(base.y-1):(base.$$>=base.an?(base.y+1):base.y))));break;case'h':buffer+=strf('%b',base);break;case'H':buffer+=padnum(2,base.h);break;case'I':buffer+=padnum(2,tumblesh((base.h%12),12));break;case'j':buffer+=padnum(3,ftoi((base.$$-base.jc)/day)+1);break;case'k':buffer+=padspc(2,base.h);break;case'l':buffer+=padspc(2,tumblesh((base.h%12),12));break;case'm':buffer+=padnum(2,base.n);break;case'M':buffer+=padnum(2,base.i);break;case'n':buffer+='\n';break;case'N':buffer+=padnum(3,base.$u/1000);break;case'O':break;case'p':buffer+=lang.meridiem[(base.h<12?0:1)]||'';break;case'P':buffer+=lang.meridiem[(base.h<12?2:3)]||'';break;case'r':buffer+=strf('%I:%M:%S %p',base);break;case'R':buffer+=strf('%H:%M',base);break;case's':buffer+=base.$t;break;case'S':buffer+=padnum(2,base.s);break;case't':buffer+='\t';break;case'T':buffer+=strf('%H:%M:%S',base);break;case'u':buffer+=tumblesh(base.w,7);break;case'U':buffer+=padnum(2,ftoi((base.$$-base.fs)/(7*day)));break;case'v':buffer+=strf('%e-%b-%Y',base);break;case'V':buffer+=padnum(2,(ftoi((ftoi(base.$$/day)-tumble(base.w,7)-ftoi((base.$$>base.an?base.an:base.ac)/day))/7)+1));break;case'w':buffer+=base.w;break;case'W':buffer+=padnum(2,ftoi((base.$$-base.fm)/(7*day)));break;case'x':buffer+=strf(locale.x,base);break;case'X':buffer+=strf(locale.X,base);break;case'y':buffer+=padnum(2,(base.y%100));break;case'Y':buffer+=padnum(4,base.y);break;case'z':buffer+=''.concat((base.z<0?'-':'+'),(padnum(2,Math.abs(ftoi(base.z/60)))),(padnum(2,Math.abs(base.z%60))));break;case'Z':break;case'%':buffer+='%';break;}}else{buffer+=format[i];}}return buffer;};this.strftime=function(format,time){format=Type.limit(format,String)||'';time=new Date(Type.limit(time,Date,Number,String)||new Date().getTime());if(time!=0&&!time)return;if(!inrange(time,false))return null;return strf(format,setbase(time,false),strflocale(false));};this.strfutc=function(format,time){format=Type.limit(format,String)||'';time=new Date(Type.limit(time,Date,Number,String)||new Date().getTime());if(time!=0&&!time)return;if(!inrange(time,true))return null;return strf(format,setbase(time,true),strflocale(true));};var $$lang='en';var $lang=$$lang;var _lang={};_lang.de={month_abbr:[],month_full:["Januar","Februar","M\u00E4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],week_abbr:[],week_full:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],meridiem:['AM','PM','am','pm']};_lang.en={month_abbr:['Jan','Febr','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],month_full:['January','February','March','April','May','June','July','August','September','October','November','December'],week_abbr:['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],week_full:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],meridiem:['AM','PM','am','pm'],ordinal:['th','st','nd','rd']};_lang.es={month_abbr:[],month_full:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],week_abbr:[],week_full:["Domingo","Lunes","Martes","Mi\u00E9rcoles","Jueves","Viernes","S\u00E1bado"],meridiem:['AM','PM','am','pm']};this.lang=function(){return Type.clone($lang)||'';};this.langList=function(){var langs=[];for(var l in _lang)if(_lang.propertyIsEnumerable(l))if((/[a-z]{2}/).test(l))langs.push(l);return langs.sort();};this.langSet=function(lang){if(!_lang[lang])return false;if(!(/[a-z]{2}/).test(lang))return false;$lang=lang;return true;};this.langReset=function(){return this.langSet($$lang);};this.langDetect=function(){return(navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||document.getElementById('html')[0].lang).substr(0,2);};this.langSetDetect=function(){return this.langSet(this.langDetect());};var _locale={local:{},utc:{c:'%www, %dd %mmm %yyyy %HHHH:%MM:%SS %z',x:'%yyyy-%mm-%dd',X:'%HHHH:%MM:%SS'}};(function(){var seg=function(name){var segs=[];for(var i=(name.length-1);i>=3;i-=1)segs.push(name.substr(0,i));return segs;};var month_abbr=[];var month_full=[];var week_abbr=[];var week_full=[];var meridiem=[];var ordinal=[];for(var l in _lang){if(_lang.propertyIsEnumerable(l)){if(_lang[l].month_full)month_abbr=(month_abbr).concat(seg((_lang[l].month_full)[11]));if(_lang[l].month_full)month_full=(month_full).concat([(_lang[l].month_full)[11]]);if(_lang[l].week_full)week_abbr=(week_abbr).concat(seg((_lang[l].week_full)[00]));if(_lang[l].week_full)week_full=(week_full).concat([(_lang[l].week_full)[00]]);if(_lang[l].meridiem)meridiem=(meridiem).concat(_lang[l].meridiem);if(_lang[l].ordinal)ordinal=(ordinal).concat(_lang[l].ordinal);}}var re_month_abbr=new RegExp((month_abbr).join('|'),'gi');var re_month_full=new RegExp((month_full).join('|'),'gi');var re_week_abbr=new RegExp((week_abbr).join('|'),'gi');var re_week_full=new RegExp((week_full).join('|'),'gi');var re_meridiem=new RegExp((meridiem).join('|'),'gi');var re_ordinal=new RegExp((ordinal).join('|'),'gi');var conv=function(stage){var f;switch(stage){case'c':f='toLocaleString';break;case'x':f='toLocaleDateString';break;case'X':f='toLocaleTimeString';break;default:f='toString';break;}var mnZr=(/09/).test(new Date(_abs(0,8))[f]());var dyZr=(/09/).test(new Date(_abs(0,0,9))[f]());var hrZr=(/09/).test(new Date(_abs(0,0,0,9))[f]());var miZr=(/09/).test(new Date(_abs(0,0,0,0,9))[f]());var scZr=(/09/).test(new Date(_abs(0,0,0,0,0,9))[f]());return new Date(_abs(2000,11,31,23,30,59,999))[f]().replace(/%/g,'%%').replace(/2000-12-31/g,'%yyyy-%mm-%dd').replace(/2000-W52-0/gi,'%yyy-W%WWW-%w').replace(/[+-]\d{2}:(00|15|30|45)/g,'%zz').replace(/[+-]\d{2}(00|15|30|45)/g,'%z').replace(re_month_full,'%mmmm').replace(re_month_abbr,'%mmm').replace(re_week_full,'%wwww').replace(re_week_abbr,'%www').replace(re_ordinal,'%o').replace(re_meridiem,'%p').replace(/820\d{4}59/g,'%SSSS').replace(/\d+/g,function($1){switch($1){case'20':return'%C';case'31':return dyZr?'%dd':'%d';case'11':return hrZr?'%HH':'%H';case'23':return hrZr?'%HHHH':'%HHH';case'12':return mnZr?'%mm':'%m';case'30':return miZr?'%MM':'%M';case'59':return scZr?'%SS':'%S';case'999':return'%SSS';case'0':return'%w';case'7':return'%ww';case'52':return'%W';case'53':return'%WW';case'00':return'%yy';case'2000':return'%yyyy';default:$1;}});};_locale.local.c=conv('c')||'';_locale.local.x=conv('x')||'';_locale.local.X=conv('X')||'';})();var day=24*60*60*1000;var swb=24*60*60/1000;var between=function(x,m,n){return m<=x&&x<=n;};var ftoi=function(x){return x-(x%1);};var tumble=function(x,n){x=ftoi(x);n=ftoi(n||0);return(x+n-1)%n;};var tumblesh=function(x,n){return tumble(x,n)+1;};var padspc=function(l,n){n=String(n);while(n.length<l)n=' '+n;return n;};var padnum=function(l,n){n=String(n);while(n.length<l)n='0'+n;return n;};var inrange=function(time,utc){if(utc){return between(time,Time.utc(0,0,1,0,0,0,0),Time.utc(9999,11,31,23,59,59,999));}else{return between(time,Time.abs(0,0,1,0,0,0,0),Time.abs(9999,11,31,23,59,59,999));};};var setbase=function(time,utc){var jc=new Date(utc?Time.utc(time.getUTCFullYear()+0):Time.abs(time.getFullYear()+0));var jn=new Date(utc?Time.utc(time.getUTCFullYear()+1):Time.abs(time.getFullYear()+1));var dfs=utc?jc.getUTCDay():jc.getDay();var dfm=tumble(dfs,7);var fs=jc.getTime()-(day*dfs);var fm=jc.getTime()-(day*dfm);var dac=tumble((utc?jc.getUTCDay():jc.getDay()),7);var dan=tumble((utc?jn.getUTCDay():jn.getDay()),7);var ac=jc.getTime()-(day*(dac-(dac>=4?7:0)));var an=jn.getTime()-(day*(dan-(dan>=4?7:0)));var base={};base.$$=time.getTime();base.$t=ftoi(base.$$/1000);base.$u=(base.$$%1000)*1000;base.ac=ac;base.an=an;base.fs=fs;base.fm=fm;base.jc=jc.getTime();base.jn=jn.getTime();base.d=time[utc?'getUTCDate':'getDate']();base.n=time[utc?'getUTCMonth':'getMonth']()+1;base.m=time[utc?'getUTCMonth':'getMonth']();base.y=time[utc?'getUTCFullYear':'getFullYear']();base.h=time[utc?'getUTCHours':'getHours']();base.i=time[utc?'getUTCMinutes':'getMinutes']();base.s=time[utc?'getUTCSeconds':'getSeconds']();base.w=time[utc?'getUTCDay':'getDay']();base.o=utc?0:time.getTimezoneOffset();base.t=utc?false:base.o!==jc.getTimezoneOffset();base.z=-1*base.o;base.l=!(base.y%4)&&!!(base.y%100)||!(base.y%400);return base;};})();
  var Type=new(function(){this.Version='8.1117';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',ERR='error',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,ERR,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object instanceof Error)return ERR;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){var $object=function(object){var obj={};for(var prop in object)obj[prop]=object[prop];return obj;};switch(this.get(object)){case NUL:return null;case ARR:return[].concat(object.valueOf());case BLN:return!!object.valueOf();case DTE:return new Date(object.valueOf());case ERR:case FNC:return object.valueOf();case NUM:return 0+object.valueOf();case OBJ:return $object(object.valueOf());case RGX:return new RegExp(object.valueOf());case STR:return''+object.valueOf();default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
