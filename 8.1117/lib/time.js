/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time
 *    Date/Time Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, it can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *  abs | utc -> Absolute Date creation.
 *
 *    Syntax: Time.abs([yr [, mn [, dy [, hr [, mi [, sc [, ms]]]]]]])
 *
 *      (All parameters are optional. Default is '0000-00-01 00:00:00'.)
 *
 *    Return: <Number>: Epoch timestamp.
 *----
 *  lang -> Get current language in-use.
 *
 *    Syntax: Time.lang()
 *
 *    Return: <String>
 *
 *  langDetect -> Get user, browser, or system language.
 *
 *    Syntax: Time.langDetect()
 *
 *    Return: <String>
 *
 *  langList -> List supported languages.
 *
 *    Syntax: Type.langList()
 *
 *    Return: <Array>
 *
 *  langReset -> Reset in-use language to configured default.
 *
 *    Syntax: Type.langReset()
 *
 *    Return: <Boolean>: Success.
 *
 *  langSet -> Set in-use language.
 *
 *    Syntax: Type.langSet(lang)
 *
 *      lang <String>: Language to use.
 *
 *    Return: <Boolean>: Success.
 *
 *  langSetDetect -> Set in-use language to detected language.
 *
 *    Syntax: Type.langSetDetect()
 *
 *    Return: <Boolean>: Success.
 *
 *----
 *
 *  phpdate | phputc -> PHP date() formatting.
 *
 *    Note: phpdate and phputc are English-only.
 *
 *    Syntax: Time.phpdate(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *        d - Day of the month, 2 digits with leading zeros (01 - 31)
 *        D - A textual representation of a day, three letters (Mon - Sun)
 *        j - Day of the month without leading zeros (1 - 31)
 *        l - A full textual representation of the day of week (Sunday - Saturday)
 *        N - ISO-8601 numeric representation of the day of the week (1 - 7)
 *        S - English ordinal suffix for the day of the month (st, nd, rd, th)
 *        w - Numeric representation of the day of the week (0 - 6)
 *        z - The day of the year (0 - 365)
 *
 *        W - ISO-8601 week number of year, weeks starting on Monday (00 - 53)
 *
 *        F - A full textual representation of a month. (January - December)
 *        m - Numeric representation of a month, with leading zeros. (01 - 12)
 *        M - A short textual representation of a month. (Jan - Dec)
 *        n - Numeric representation of a month, without leading zeros. (1 - 12)
 *        t - Number of days in the given month. (28 - 31)
 *
 *        L - Whether it's a leap year. (0 or 1)
 *        O - ISO-8601 year number.
 *        y - A full numeric representation of a year, 4 digits.
 *        Y - A two digit representation of a year.
 *
 *        a - Lowercase meridiem. (am or pm)
 *        A - Uppercase meridiem. (AM or PM)
 *        B - Swatch Internet Time. (000 - 999)
 *        g - 12-hour without leading zeros. (1 - 12)
 *        G - 24-hour without leading zeros. (0 - 23)
 *        h - 12-hour with leading zeros. (01 - 12)
 *        H - 24-hour with leading zeros. (00 - 23)
 *        i - Minutes with leading zeros. (00 - 59)
 *        s - Seconds with leading zeros. (00 - 59)
 *        u - Microseconds
 *
 *        e - [unsupported] Timezone identifier.
 *        I - Whether daylight savings time. (0 or 1)
 *        O - Difference to Greenwich time. (e.g. +0200)
 *        P - Difference to Greenwich time. (e.g. +02:00)
 *        T - [unsupported] Timezone abbreviation.
 *        Z - Timezone offset is seconds. (-43200 - 50400)
 *
 *        c - ISO-8601 date. (e.g. 2004-02-12T15:19:21+00:00)
 *        r - RFC 2822 date. (e.g. Thu, 21 Dec 2000 16:01:07 +0200)
 *        U - Seconds since Unix Epoch.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *----
 *
 *  strftime | strfutc -> POSIX date formatting. (Work-in-progress)
 *
 *    Syntax: Time.strftime(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *        %a - Abbreviated week. (Sun - Sat)
 *        %A - Full week. (Sunday - Saturday)
 *        %b - Abbreviated month. (Jan - Dec)
 *        %B - Full month. (January - December)
 *        %c - Locale date and time. (based on Date#toLocaleString)
 *        %C - Century. (year / 100)
 *        %d - Day of the month with leading zeros.
 *        %D - Equivalent to "%m/%d/%y".
 *        %e - Day of the month with leading spaces.
 *        %E - [unsupported] POSIX locale extensions.
 *        %F - Equivalent to "%Y-%m-%d".
 *        %g - 2-digit year containing majority of the Monday-start week.
 *        %G - 4-digit year containing majority of the Monday-start week.
 *        %h - %b
 *        %H - Hour of 24-hour clock with leading zeros.
 *        %I - Hour of 12-hour clock with leading zeros.
 *        %j - Day of the year with leading zeros. (000 - 366)
 *        %k - Hour of 24-hour clock with leading spaces.
 *        %l - Hour of 12-hour clock with leading spaces.
 *        %m - Numeric month with leading zeros.
 *        %M - Minutes with leading spaces.
 *        %n - newline.
 *        %N - Milliseconds with leading zeros.
 *        %O - [unsupported] POSIX locale extensions.
 *        %p - Uppercase ante meridiem or post meridiem.
 *        %P - Lowercase ante meridiem or post meridiem.
 *        %r - Equivalent to "%I:%M:%S %p".
 *        %R - Equivalent to "%H:%M".
 *        %s - Seconds since Unix Epoch.
 *        %S - Seconds with leading zeros.
 *        %t - tab.
 *        %T - Equivalent to "%H:%M:%S".
 *        %u - Day of the week. (1 - 7 <=> Mon - Sun)
 *        %U - Week number of the year, Sunday-start, with leading zeros.
 *        %v - Equivalent to "%e-%b-%Y".
 *        %V - Week number of %G year, Monday-start, with leading zeros.
 *        %w - Day of the week. (0 - 6 <=> Sun - Sat)
 *        %W - Week number of the year, Monday-start, with leading zeros.
 *        %x - Locale date. (based on Date#toLocaleDateString)
 *        %X - Locale time. (based on Date#toLocaleTimeString)
 *        %y - 2-digit year.
 *        %Y - 4-digit year.
 *        %z - Offset from UTC. (e.g. -0600)
 *        %Z - [unsupported] Timezone name.
 *        %% - Percent sign.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Time = new (function () {
  this.Version = '8.1117';

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Shared
**/
  var _abs = this.abs = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date(0);
    date.setFullYear(0, 0, 1);
    date.setHours(0, 0, 0, 0);

    if (Number(yr)) date.setFullYear(yr);
    if (Number(mn)) date.setMonth(mn);
    if (Number(dy)) date.setDate(dy);
    if (Number(hr)) date.setHours(hr);
    if (Number(mi)) date.setMinutes(mi);
    if (Number(sc)) date.setSeconds(sc);
    if (Number(ms)) date.setMilliseconds(ms);

    return date.getTime();
  };

  var _utc = this.utc = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date(0);
    date.setUTCFullYear(0, 0, 1);
    date.setUTCHours(0, 0, 0, 0);

    if (Number(yr)) date.setUTCFullYear(yr);
    if (Number(mn)) date.setUTCMonth(mn);
    if (Number(dy)) date.setUTCDate(dy);
    if (Number(hr)) date.setUTCHours(hr);
    if (Number(mi)) date.setUTCMinutes(mi);
    if (Number(sc)) date.setUTCSeconds(sc);
    if (Number(ms)) date.setUTCMilliseconds(ms);

    return date.getTime();
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: PHP
**/
// private
  var phpf = function (format, base) {
    format = Type.clone(format).split('');

    var lang = _lang.en;
    var month_c = [31, (base.l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var buffer = '', rfc_colon = true;
    for (var i = 0; i < format.length; i += 1) {
      rfc_colon = true;
      switch (format[i]) {
      // day
        case 'd': buffer += padnum(2, base.d); break;
        case 'D': buffer += lang.week_full[base.w].substr(0, 3); break;
        case 'j': buffer += base.d; break;
        case 'l': buffer += lang.week_full[base.w]; break;
        case 'N': buffer += tumblesh(base.w, 7); break;
        case 'S': buffer += lang.ordinal[between(base.d, 10, 19) ? 0 : (base.d % 10)] || ordinal[0] || ''; break;
        case 'w': buffer += base.w; break;
        case 'z': buffer += ftoi((base.$$ - base.jc) / day); break;
      // week
        case 'W': buffer += padnum(2, (
                    ftoi((
                      ftoi(base.$$ / day) -
                      tumble(base.w, 7) -
                      ftoi((base.$$ > base.an ? base.an : base.ac) / day)
                    ) / 7) + 1
                  )); break;
      // month
        case 'F': buffer += lang.month_full[base.m]; break;
        case 'm': buffer += padnum(2, base.n); break;
        case 'M': buffer += lang.month_full[base.m].substr(0, 3); break;
        case 'n': buffer += base.n; break;
        case 't': buffer += month_c[base.m]; break;
      // year
        case 'L': buffer += base.l ? 1 : 0; break;
        case 'o': buffer += padnum(4, (
                    (base.$$ < base.ac ? (base.y - 1) :
                      (base.$$ >= base.an ? (base.y + 1) : base.y)
                    )
                  )); break;
        case 'Y': buffer += padnum(4, base.y); break;
        case 'y': buffer += padnum(2, (base.y % 100)); break;
      // time
        case 'a': buffer += lang.meridiem[base.h < 12 ? 2 : 3]; break;
        case 'A': buffer += lang.meridiem[base.h < 12 ? 0 : 1]; break;
        case 'a': buffer += base.h < 12 ? 'am' : 'pm'; break;
        case 'A': buffer += base.h < 12 ? 'AM' : 'PM'; break;
        case 'B': buffer += padnum(3, (((
                    ftoi((
                      (base.h * 3600) + (base.i * 60) + base.s + ((base.o + 60) * 60)
                    ) / swb)
                  ) + 1000) % 1000)); break;
        case 'g': buffer += tumblesh((base.h % 12), 12); break;
        case 'G': buffer += base.h; break;
        case 'h': buffer += padnum(2, tumblesh((base.h % 12), 12)); break;
        case 'H': buffer += padnum(2, base.h); break;
        case 'i': buffer += padnum(2, base.i); break;
        case 's': buffer += padnum(2, base.s); break;
        case 'u': buffer += padnum(6, base.$u); break;
      // timezone
        case 'e': break;  /* unsupported */
        case 'I': buffer += base.t ? 1 : 0; break;
        case 'O': rfc_colon = false; /* break intentionally missing */
        case 'P': buffer += ''.concat(
                    (base.z < 0 ? '-' : '+'),
                    (padnum(2, Math.abs(ftoi(base.z / 60)))),
                    (rfc_colon ? ':' : ''),
                    (padnum(2, Math.abs(base.z % 60)))
                  ); break;
        case 'T': break;  /* unsupported */
        case 'Z': buffer += base.z * 60; break;
      // full date/time
        case 'c': buffer += phpf('Y-m-d\\TH:i:sP', base); break;
        case 'r': buffer += phpf('D, d M Y H:i:s O', base); break;
        case 'U': buffer += base.$t; break;

        case '\\': i += 1;

        default: buffer += (format[i] || ''); break;
      }
    }

    return buffer;
  };

// public
  this.phpdate = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());

    if (time != 0 && !time) return;
    if (!inrange(time, false)) return null;

    return phpf(format, setbase(time, false));
  };

  this.phputc = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());

    if (time != 0 && !time) return;
    if (!inrange(time, true)) return null;

    return phpf(format, setbase(time, true));
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: POSIX {WIP}
**/
// private
  var strflocale = function (utc) {
    var swap = function (c) {
      return (_locale[utc ? 'utc' : 'local'][c] || '').replace(/%%|%([A-Za-z])\1*/g, function ($1) {
        switch ($1) {
          case '%%'    : return '%%';
          case '%C'    : return '%C';
          case '%d'    : return '%e';
          case '%dd'   : return '%d';
          case '%H'    : return '%l';
          case '%HH'   : return '%I';
          case '%HHH'  : return '%k';
          case '%HHHH' : return '%H';
          case '%M'    : return '%M';
          case '%MM'   : return '%M';
          case '%m'    : return '%m';
          case '%mm'   : return '%m';
          case '%mmm'  : return '%b';
          case '%mmmm' : return '%B';
          case '%o'    : return '';
          case '%p'    : return '%p';
          case '%S'    : return '%S';
          case '%SS'   : return '%S';
          case '%SSS'  : return '';
          case '%SSSS' : return '%s';
          case '%W'    : return '%W';
          case '%WW'   : return '%U';
          case '%WWW'  : return '%V';
          case '%w'    : return '%w';
          case '%ww'   : return '%u';
          case '%www'  : return '%a';
          case '%wwww' : return '%A';
          case '%yy'   : return '%y';
          case '%yyy'  : return '%G';
          case '%yyyy' : return '%Y';
          case '%Z'    : return '%Z';
          case '%ZZ'   : return '%Z';
          case '%ZZZ'  : return '%Z';
          case '%ZZZZ' : return '%Z';
          case '%z'    : return '%z';
          case '%zz'   : return '%z';
          default : return '';
        }
      });
    };

    return {
      c : swap('c'),
      x : swap('x'),
      X : swap('X')
    };
  };

  var strf = function (format, base, locale) {
    format = Type.clone(format).split('');

    var lang = _lang[$lang] || _lang[defaultLanguage];

    var buffer = '';
    for (var i = 0; i < format.length; i += 1) {
      if (format[i] == '%') {
        switch (format[(i += 1)]) {
          case 'a': buffer += lang.week_abbr[base.w] || lang.week_full[base.w].substr(0, 3); break;
          case 'A': buffer += lang.week_full[base.w]; break;
          case 'b': buffer += lang.month_abbr[base.m] || lang.month_full[base.w].substr(0, 3); break;
          case 'B': buffer += lang.month_full[base.m]; break;
          case 'c': buffer += strf(locale.c, base); break;
          case 'C': buffer += padnum(2, ftoi(base.y / 100)); break;
          case 'd': buffer += padnum(2, base.d); break;
          case 'D': buffer += strf('%m/%d/%y', base); break;
          case 'e': buffer += padspc(2, base.d); break;
          case 'E': break;
          case 'F': buffer += strf('%Y-%m-%d', base); break;
          case 'g': buffer += padnum(2, strf('%G', base) % 100); break;
          case 'G': buffer += padnum(4, (
                      (base.$$ < base.ac ? (base.y - 1) :
                        (base.$$ >= base.an ? (base.y + 1) : base.y)
                      )
                    )); break;
          case 'h': buffer += strf('%b', base); break;
          case 'H': buffer += padnum(2, base.h); break;
          case 'I': buffer += padnum(2, tumblesh((base.h % 12), 12)); break;
          case 'j': buffer += padnum(3, ftoi((base.$$ - base.jc) / day) + 1); break;
          case 'k': buffer += padspc(2, base.h); break;
          case 'l': buffer += padspc(2, tumblesh((base.h % 12), 12)); break;
          case 'm': buffer += padnum(2, base.n); break;
          case 'M': buffer += padnum(2, base.i); break;
          case 'n': buffer += '\n'; break;
          case 'N': buffer += padnum(3, base.$u / 1000); break;
          case 'O': break;
          case 'p': buffer += lang.meridiem[(base.h < 12 ? 0 : 1)] || ''; break;
          case 'P': buffer += lang.meridiem[(base.h < 12 ? 2 : 3)] || ''; break;
          case 'r': buffer += strf('%I:%M:%S %p', base); break;
          case 'R': buffer += strf('%H:%M', base); break;
          case 's': buffer += base.$t; break;
          case 'S': buffer += padnum(2, base.s); break;
          case 't': buffer += '\t'; break;
          case 'T': buffer += strf('%H:%M:%S', base); break;
          case 'u': buffer += tumblesh(base.w, 7); break;
          case 'U': buffer += padnum(2, ftoi((base.$$ - base.fs) / (7 * day))); break;
          case 'v': buffer += strf('%e-%b-%Y', base); break;
          case 'V': buffer += padnum(2, (
                      ftoi((
                        ftoi(base.$$ / day) -
                        tumble(base.w, 7) -
                        ftoi((base.$$ > base.an ? base.an : base.ac) / day)
                      ) / 7) + 1
                    )); break;
          case 'w': buffer += base.w; break;
          case 'W': buffer += padnum(2, ftoi((base.$$ - base.fm) / (7 * day))); break;
          case 'x': buffer += strf(locale.x, base); break;
          case 'X': buffer += strf(locale.X, base); break;
          case 'y': buffer += padnum(2, (base.y % 100)); break;
          case 'Y': buffer += padnum(4, base.y); break;
          case 'z': buffer += ''.concat(
                      (base.z < 0 ? '-' : '+'),
                      (padnum(2, Math.abs(ftoi(base.z / 60)))),
                      (padnum(2, Math.abs(base.z % 60)))
                    ); break;
          case 'Z': break;  /* unsupported */
          case '%': buffer += '%'; break;
        }
      } else {
        buffer += format[i];
      }
    }

    return buffer;
  };

// public
  this.strftime = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());

    if (time != 0 && !time) return;
    if (!inrange(time, false)) return null;

    return strf(format, setbase(time, false), strflocale(false));
  };

  this.strfutc = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());

    if (time != 0 && !time) return;
    if (!inrange(time, true)) return null;

    return strf(format, setbase(time, true), strflocale(true));
  };

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Language
**/
// private
  var $$lang = 'en'; // default language

  var $lang = $$lang; // language used
  var _lang = {};     // language list // a=abbreviated, f=full

  _lang.de={month_abbr:[],month_full:["Januar","Februar","M\u00E4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],week_abbr:[],week_full:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],meridiem:['AM','PM','am','pm']};
  _lang.en={month_abbr:['Jan','Febr','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'],month_full:['January','February','March','April','May','June','July','August','September','October','November','December'],week_abbr:['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],week_full:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],meridiem:['AM','PM','am','pm'],ordinal:['th','st','nd','rd']};
  _lang.es={month_abbr:[],month_full:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],week_abbr:[],week_full:["Domingo","Lunes","Martes","Mi\u00E9rcoles","Jueves","Viernes","S\u00E1bado"],meridiem:['AM','PM','am','pm']};

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
    return this.langSet($$lang);
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
      c: '%www, %dd %mmm %yyyy %HHHH:%MM:%SS %z',
      x: '%yyyy-%mm-%dd',
      X: '%HHHH:%MM:%SS'
    }
  };

  // find locale formatting for local dates
  (function () {
    var seg = function (name) { // segment from 3 to length - 1
      var segs = [];
      for (var i = (name.length - 1); i >= 3; i -= 1)
        segs.push(name.substr(0, i));
      return segs;
    };

    // build lists for searching
    var month_abbr = [];
    var month_full = [];
    var week_abbr  = [];
    var week_full  = [];
    var meridiem   = [];
    var ordinal    = [];

    for (var l in _lang) {
      if (_lang.propertyIsEnumerable(l)) {
        if (_lang[l].month_full) month_abbr = (month_abbr).concat(seg((_lang[l].month_full)[11]));
        if (_lang[l].month_full) month_full = (month_full).concat(   [(_lang[l].month_full)[11]]);
        if (_lang[l].week_full ) week_abbr  = (week_abbr ).concat(seg((_lang[l].week_full )[00]));
        if (_lang[l].week_full ) week_full  = (week_full ).concat(   [(_lang[l].week_full )[00]]);
        if (_lang[l].meridiem  ) meridiem   = (meridiem  ).concat(_lang[l].meridiem);
        if (_lang[l].ordinal   ) ordinal    = (ordinal   ).concat(_lang[l].ordinal );
      }
    }

    var re_month_abbr = new RegExp((month_abbr).join('|'), 'gi');
    var re_month_full = new RegExp((month_full).join('|'), 'gi');
    var re_week_abbr  = new RegExp((week_abbr ).join('|'), 'gi');
    var re_week_full  = new RegExp((week_full ).join('|'), 'gi');
    var re_meridiem   = new RegExp((meridiem  ).join('|'), 'gi');
    var re_ordinal    = new RegExp((ordinal   ).join('|'), 'gi');

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

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Shared
**/
  var day = 24 * 60 * 60 * 1000; // milliseconds in a day
  var swb = 24 * 60 * 60 / 1000; // seconds in a swatch beat

  var between = function (x, m, n) { return m <= x && x <= n; };
  var ftoi = function (x) { return x - (x % 1); };
  var tumble = function (x, n) { x=ftoi(x); n=ftoi(n||0); return (x+n-1)%n; };
  var tumblesh = function (x, n) { return tumble(x, n) + 1; };
  var padspc = function (l, n) { n=String(n); while(n.length<l) n=' '+n; return n; };
  var padnum = function (l, n) { n=String(n); while(n.length<l) n='0'+n; return n; };

  var inrange = function (time, utc) {
    if (utc) {
      return between(time,
        Time.utc(   0,  0,  1,  0,  0,  0,   0),
        Time.utc(9999, 11, 31, 23, 59, 59, 999)
      );
    } else {
      return between(time,
        Time.abs(   0,  0,  1,  0,  0,  0,   0),
        Time.abs(9999, 11, 31, 23, 59, 59, 999)
      );
    };
  };

  var setbase = function (time, utc) {
    // January 1st
    var jc = new Date(utc ? Time.utc(time.getUTCFullYear() + 0) : Time.abs(time.getFullYear() + 0));
    var jn = new Date(utc ? Time.utc(time.getUTCFullYear() + 1) : Time.abs(time.getFullYear() + 1));

    // 1st Sunday, 1st Monday
    var dfs = utc ? jc.getUTCDay() : jc.getDay();
    var dfm = tumble(dfs, 7);
    var fs = jc.getTime() - (day * dfs);
    var fm = jc.getTime() - (day * dfm);

    // Adjusted 1st Mondays
    var dac = tumble((utc ? jc.getUTCDay() : jc.getDay()), 7); // days since
    var dan = tumble((utc ? jn.getUTCDay() : jn.getDay()), 7);
    var ac = jc.getTime() - (day * (dac - (dac >= 4 ? 7 : 0)));
    var an = jn.getTime() - (day * (dan - (dan >= 4 ? 7 : 0)));

    var base = {};
    // core
      base.$$ = time.getTime();
      base.$t = ftoi(base.$$ / 1000);
      base.$u = (base.$$ % 1000) * 1000;
    // reference
      base.ac = ac;
      base.an = an;
      base.fs = fs;
      base.fm = fm;
      base.jc = jc.getTime();
      base.jn = jn.getTime();
    // day, month, year
      base.d  = time[utc ? 'getUTCDate' : 'getDate']();
      base.n  = time[utc ? 'getUTCMonth' : 'getMonth']() + 1;
      base.m  = time[utc ? 'getUTCMonth' : 'getMonth']();
      base.y  = time[utc ? 'getUTCFullYear' : 'getFullYear']();
    // hour, minute, second
      base.h  = time[utc ? 'getUTCHours' : 'getHours']();
      base.i  = time[utc ? 'getUTCMinutes' : 'getMinutes']();
      base.s  = time[utc ? 'getUTCSeconds' : 'getSeconds']();
    // week
      base.w  = time[utc ? 'getUTCDay' : 'getDay']();
    // timezone
      base.o  = utc ? 0 : time.getTimezoneOffset();
      base.t  = utc ? false : base.o !== jc.getTimezoneOffset();
      base.z  = -1 * base.o;
    // leap year
      base.l  = !(base.y % 4) && !!(base.y % 100) || !(base.y % 400);
    /*# end #*/

    return base;
  };


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Requires
**/
  var Type=new(function(){this.Version='8.1117';var UND='undefined',NUL='null',ARR='array',BLN='boolean',DTE='date',ERR='error',FNC='function',NUM='number',OBJ='object',RGX='regexp',STR='string',UNK='unknown';this.types=function(){return this.clone([UND,NUL,ARR,BLN,DTE,ERR,FNC,NUM,OBJ,RGX,STR,UNK]);};this.get=function(object){switch(typeof object){case'undefined':return UND;case'boolean':return BLN;case'number':return NUM;case'string':return STR;case'function':if(object.constructor===RegExp)return RGX;return FNC;case'object':if(object===null)return NUL;if(object instanceof Error)return ERR;if(object.constructor===Array)return ARR;if(object.constructor===Boolean)return BLN;if(object.constructor===Date)return DTE;if(object.constructor===Number)return NUM;if(object.constructor===RegExp)return RGX;if(object.constructor===String)return STR;return OBJ;default:return UNK;}};this.clone=function(object){var $object=function(object){var obj={};for(var prop in object)obj[prop]=object[prop];return obj;};switch(this.get(object)){case NUL:return null;case ARR:return[].concat(object.valueOf());case BLN:return!!object.valueOf();case DTE:return new Date(object.valueOf());case ERR:case FNC:return object.valueOf();case NUM:return 0+object.valueOf();case OBJ:return $object(object.valueOf());case RGX:return new RegExp(object.valueOf());case STR:return''+object.valueOf();default:return undefined}};this.is_a=function(object,compare){switch(this.get(compare)){case UND:return this.get(object)===UND;case NUL:return this.get(object)===NUL;case STR:return this.get(object)===compare;case FNC:switch(compare){case Boolean:return this.get(object)===BLN;case Number:return this.get(object)===NUM;case String:return this.get(object)===STR;default:return object instanceof compare;}default:return undefined;}};this.isof=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];var object=args.shift();for(argi=0;argi<args.length;argi+=1)if(this.is_a(object,args[argi]))return true;return false;};this.limit=function(){var args=[],argc=arguments.length,argi;for(argi=0;argi<argc;argi+=1)args[argi]=arguments[argi];return this.isof.apply(this,args)?this.clone(args[0]):undefined;};})();

})();
