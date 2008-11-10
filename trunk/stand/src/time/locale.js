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
  this.setLanguage = function (lang) {
    if (!_lang[lang]) return false;
    if (!(/[a-z]{2}/).test(lang)) return false;
    $lang = lang;
    return true;
  };
  
  this.detectLanguage = function () {
    return this.setLanguage((navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage).substr(0, 2));
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
   *    %ZZ   = Full Timezone name
   *    %Z    = Abbreviated Timezone name
   *    %zz   = Timezone offset, as '+HH:MM'
   *    %z    = Timezone offset, as '+HHMM'
   *
   *
   *  Planned
   *
   *    %ZZZZ = Zoneinfo name
   *    %ZZZ  = Military timezone
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
        case 'x': f = 'toLocaleDateString'; break;
        case 'X': f = 'toLocaleTimeString'; break;
        default : f = 'toLocaleString';     break;
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
      // distinct combinations
        replace(/2000-12-31/g, '%yyyy-%mm-%dd').
        replace(/2000-W52-0/gi, '%yyy-W%WWW-%w').
      // distinct replacements
        replace(/[+-]\d{2}:(00|15|30|45)/g, '%zz').
        replace(/[+-]\d{2}(00|15|30|45)/g, '%z').
        replace(/2000/g, '%yyyy').
        replace(/00/g, '%yy').
        replace(/20/g, '%C').
        replace(/53/g, '%WW').
        replace(/52/g, '%W').
        replace(re_week_f, '%wwww').
        replace(re_week_s, '%www').
        replace(/820\d{4}59/g, '%SSSS').
        replace(/999\d*/g, '%SSS').
        replace(/59/g, (scZr ? '%SS' : '%S')).
        replace(re_meridien, '%p').
        replace(re_month_f, '%mmmm').
        replace(re_month_s, '%mmm').
        replace(/12/g, (mnZr ? '%mm' : '%m')).
        replace(/30/g, (miZr ? '%MM' : '%M')).
        replace(/23/g, (hrZr ? '%HHHH' : '%HHH')).
        replace(/11/g, (hrZr ? '%HH' : '%H')).
        replace(/31/g, (dyZr ? '%dd' : '%d')).
      // mixable replacements
        replace(re_ordinal, '%o').
        replace(/7/g, '%u').
        replace(/0/g, '%w');
    };
    
    _locale.local.c = conv();
    _locale.local.x = conv('x');
    _locale.local.X = conv('X');
  })();
