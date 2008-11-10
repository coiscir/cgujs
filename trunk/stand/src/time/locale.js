/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Language
**/
// private
  var defaultLanguage = 'en';
  
  var $lang = defaultLanguage; // language used
  var _lang = {                // language list
    $$ : { // language non-specific
    },
    
    en : {
      month_f  : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      month_s  : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      week_f   : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      week_s   : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      meridien : ['AM', 'PM', 'am', 'pm'],
      ordinal  : ['th', 'st', 'nd', 'rd']
    }
  };
  
// public
  this.lang = function () {
    return Type.clone($lang) || '';
  };
  
  this.langList = function () {
    var langs = [];
    for (var l in _lang)
      if (_lang.propertyIsEnumerable(l))
        if ((/[a-z]{2}/).test(l))
          langs.push(l);
    return langs.sort();
  };
  
  this.langSet = function (lang) {
    if (!_lang[lang]) return false;
    if (!(/[a-z]{2}/).test(lang)) return false;
    $lang = lang;
    return true;
  };
  
  this.langReset = function () {
    return this.langSet(defaultLanguage);
  };
  
  this.langDetect = function () {
    return (
      navigator.language ||
      navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage ||
      document.getElementById('html')[0].lang
    ).substr(0, 2);
  };
  
  this.langSetDetect = function () {
    return this.langSet(this.langDetect());
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Locale
**/

  /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   *~~~ KEY
   *
   *    %C    = Century (Cyy <=> yyyy)
   *    %dd   = 2-digit day, with padding
   *    %d    = 2-digit day, without padding
   *    %HHHH = 2-digit hour, 24-hour clock, with padding
   *    %HHH  = 2-digit hour, 24-hour clock, without padding
   *    %HH   = 2-digit hour, 12-hour clock, with padding
   *    %H    = 2-digit hour, 12-hour clock, without padding
   *    %MM   = 2-digit minute, with padding
   *    %M    = 2-digit minute, without padding
   *    %mmmm = Full month name
   *    %mmm  = Short month name
   *    %mm   = 2-digit month, with padding
   *    %m    = 2-digit month, without padding
   *    %o    = ordinal (st, nd, rd, th)
   *    %p    = AM/PM
   *    %SSSS = Unix epoch seconds
   *    %SSS  = Millisecond
   *    %SS   = 2-digit second, with padding
   *    %S    = 2-digit second, without padding
   *    %WWW  = ISO-8601 week number
   *    %WW   = Calendar week number, with week starting Sunday
   *    %W    = Calendar week number, with week starting Monday
   *    %wwww = Full weekday name
   *    %www  = Short weekday name
   *    %ww   = Weekday, as 1 - 7 (Mon - Sun)
   *    %w    = Weekday, as 0 - 6 (Sun - Sat)
   *    %yyyy = 4-digit year
   *    %yyy  = ISO-8601 year
   *    %yy   = 2-digit year
   *    %zz   = Timezone offset, as '+HH:MM'
   *    %z    = Timezone offset, as '+HHMM'
   *
   *
   *  Planned
   *
   *    %ZZZZ = Zoneinfo name
   *    %ZZZ  = Military timezone
   *    %ZZ   = Full Timezone name
   *    %Z    = Abbreviated Timezone name
  **/

  var _locale = {
    local : {},
    utc : {
      c: '%www, %dd %mmm %yyyy %HHHH:%MM:%SS %Z',
      x: '%yyyy-%mm-%dd',
      X: '%HHHH:%MM:%SS'
    }
  };
  
  // find locale formatting for local dates
  (function () {
    // build lists for searching
    var month_f  = [];
    var month_s  = [];
    var week_f   = [];
    var week_s   = [];
    var meridien = [];
    var ordinal  = [];
    
    for (var l in _lang) {
      if (_lang.propertyIsEnumerable(l)) {
        if (_lang[l].month_f ) month_f  = (month_f ).concat([(_lang[l].month_f)[11]]);
        if (_lang[l].month_s ) month_s  = (month_s ).concat([(_lang[l].month_s)[11]]);
        if (_lang[l].week_f  ) week_f   = (week_f  ).concat([(_lang[l].week_f )[00]]);
        if (_lang[l].week_s  ) week_s   = (week_s  ).concat([(_lang[l].week_s )[00]]);
        if (_lang[l].meridien) meridien = (meridien).concat(_lang[l].meridien);
        if (_lang[l].ordinal ) ordinal  = (ordinal ).concat(_lang[l].ordinal );
      }
    }
    
    var re_month_f  = new RegExp((month_f ).join('|'), 'gi');
    var re_month_s  = new RegExp((month_s ).join('|'), 'gi');
    var re_week_f   = new RegExp((week_f  ).join('|'), 'gi');
    var re_week_s   = new RegExp((week_s  ).join('|'), 'gi');
    var re_meridien = new RegExp((meridien).join('|'), 'gi');
    var re_ordinal  = new RegExp((ordinal ).join('|'), 'gi');
    
    var conv = function (stage) {
      var f;
      switch (stage) {
        case 'c' : f = 'toLocaleString';     break;
        case 'x' : f = 'toLocaleDateString'; break;
        case 'X' : f = 'toLocaleTimeString'; break;
        default  : f = 'toString';           break;
      }
      
      // 0 or space padding
      var mnZr = (/09/).test(new Date(_abs(0, 8))[f]());
      var dyZr = (/09/).test(new Date(_abs(0, 0, 9))[f]());
      var hrZr = (/09/).test(new Date(_abs(0, 0, 0, 9))[f]());
      var miZr = (/09/).test(new Date(_abs(0, 0, 0, 0, 9))[f]());
      var scZr = (/09/).test(new Date(_abs(0, 0, 0, 0, 0, 9))[f]());
      
      return new Date(_abs(2000, 11, 31, 23, 30, 59, 999))[f]().
      // character replacements
        replace(/%/g, '%%').
      // grouping replacements
        replace(/2000-12-31/g, '%yyyy-%mm-%dd').
        replace(/2000-W52-0/gi, '%yyy-W%WWW-%w').
        replace(/[+-]\d{2}:(00|15|30|45)/g, '%zz').
        replace(/[+-]\d{2}(00|15|30|45)/g, '%z').
      // word replacements
        replace(re_month_s, '%mmm').
        replace(re_month_f, '%mmmm').
        replace(re_week_s, '%www').
        replace(re_week_f, '%wwww').
        replace(re_ordinal, '%o').
        replace(re_meridien, '%p').
      // numeric replacements
        replace(/820\d{4}59/g, '%SSSS').
        replace(/\d+/g, function ($1) {
          switch ($1) {
            case '20'   : return '%C';
            case '31'   : return dyZr ? '%dd' : '%d';
            case '11'   : return hrZr ? '%HH' : '%H';
            case '23'   : return hrZr ? '%HHHH' : '%HHH';
            case '12'   : return mnZr ? '%mm' : '%m';
            case '30'   : return miZr ? '%MM' : '%M';
            case '59'   : return scZr ? '%SS' : '%S';
            case '999'  : return '%SSS';
            case '0'    : return '%w';
            case '7'    : return '%ww';
            case '52'   : return '%W';
            case '53'   : return '%WW';
            case '00'   : return '%yy';
            case '2000' : return '%yyyy';
            default : $1;
          }
        });
    };
    
    _locale.local.c = conv('c') || '';
    _locale.local.x = conv('x') || '';
    _locale.local.X = conv('X') || '';
    
    // for testing timezone encoding
    //_locale.local.$ = conv() || '';
  })();
  
  //document.writeln('<pre>', _locale.local.$, '</pre>');
