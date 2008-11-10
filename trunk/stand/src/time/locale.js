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
      c: '%www, %dd %mmm %yyyy %HHHH:%MM:%SS %z',
      x: '%yyyy-%mm-%dd',
      X: '%HHHH:%MM:%SS'
    }
  };
  
  // find locale formatting for local dates
  (function () {
    // build lists for searching
    var month_abbr  = [];
    var month_full  = [];
    var week_abbr   = [];
    var week_full   = [];
    var meridiem = [];
    var ordinal  = [];
    
    for (var l in _lang) {
      if (_lang.propertyIsEnumerable(l)) {
        if (_lang[l].month_abbr) month_abbr = (month_abbr).concat([(_lang[l].month_abbr)[11]]);
        if (_lang[l].month_full) month_full = (month_full).concat([(_lang[l].month_full)[11]]);
        if (_lang[l].week_abbr ) week_abbr  = (week_abbr ).concat([(_lang[l].week_abbr )[00]]);
        if (_lang[l].week_full ) week_full  = (week_full ).concat([(_lang[l].week_full )[00]]);
        if (_lang[l].meridiem  ) meridiem   = (meridiem  ).concat(_lang[l].meridiem);
        if (_lang[l].ordinal   ) ordinal    = (ordinal   ).concat(_lang[l].ordinal );
      }
    }
    
    var re_month_abbr = new RegExp((month_abbr ).join('|'), 'gi');
    var re_month_full = new RegExp((month_full ).join('|'), 'gi');
    var re_week_abbr  = new RegExp((week_abbr  ).join('|'), 'gi');
    var re_week_full  = new RegExp((week_full  ).join('|'), 'gi');
    var re_meridiem   = new RegExp((meridiem).join('|'), 'gi');
    var re_ordinal    = new RegExp((ordinal ).join('|'), 'gi');
    
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
        replace(re_month_full, '%mmmm').
        replace(re_month_abbr, '%mmm').
        replace(re_week_full, '%wwww').
        replace(re_week_abbr, '%www').
        replace(re_ordinal, '%o').
        replace(re_meridiem, '%p').
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
