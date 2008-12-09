/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Time
 *    Date/Time Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  local | utc -> Absolute time.
 *
 *    Syntax: CGU.local([yr [, mn [, dy [, hr [, mi [, sc [, ms]]]]]]])
 *
 *      (All parameters are optional. Default is the current time.)
 *
 *    Return: <Number>: UNIX Epoch timestamp.
 *
 *----
 *
 *  phpdate | phputc -> PHP date() formatting.
 *
 *    Note: phpdate and phputc are English-only.
 *
 *    Syntax: CGU.phpdate(format [, time])
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
 *      time <Mixed>: A date value. <Date> or <Number>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *----
 *
 *  strftime | strfutc -> C/C++ date formatting.
 *
 *    Syntax: CGU.strftime(format [, time])
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
 *      time <Mixed>: A date value. <Date> or <Number>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: Invalid `time`.
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Time() { // enable private members
  
  CGU.local = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date();
    
    if (arguments.length > 0) {
      date.setFullYear(0, 0, 1);
      date.setHours(0, 0, 0, 0);
      
      if (CGU.is_a(yr, Number)) date.setFullYear(yr);
      if (CGU.is_a(mn, Number)) date.setMonth(mn);
      if (CGU.is_a(dy, Number)) date.setDate(dy);
      if (CGU.is_a(hr, Number)) date.setHours(hr);
      if (CGU.is_a(mi, Number)) date.setMinutes(mi);
      if (CGU.is_a(sc, Number)) date.setSeconds(sc);
      if (CGU.is_a(ms, Number)) date.setMilliseconds(ms);
    }
    
    return date.getTime();
  };

  CGU.utc = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date();
    
    if (arguments.length > 0) {
      date.setUTCFullYear(0, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      
      if (CGU.is_a(yr, Number)) date.setUTCFullYear(yr);
      if (CGU.is_a(mn, Number)) date.setUTCMonth(mn);
      if (CGU.is_a(dy, Number)) date.setUTCDate(dy);
      if (CGU.is_a(hr, Number)) date.setUTCHours(hr);
      if (CGU.is_a(mi, Number)) date.setUTCMinutes(mi);
      if (CGU.is_a(sc, Number)) date.setUTCSeconds(sc);
      if (CGU.is_a(ms, Number)) date.setUTCMilliseconds(ms);
    }
    
    return date.getTime();
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * PHP Date Formatting
**/
  var phpf = function (format, base) {
    format = CGU.clone(format).split('');
    
    var month_c = [31, (base.l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    var buffer = '', rfc_colon = true;
    for (var i = 0; i < format.length; i += 1) {
      rfc_colon = true;
      switch (format[i]) {
      // day
        case 'd': buffer += padnum(2, base.d); break;
        case 'D': buffer += lang.weekdays[base.w].substr(0, 3); break;
        case 'j': buffer += base.d; break;
        case 'l': buffer += lang.weekdays[base.w]; break;
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
        case 'F': buffer += lang.months[base.m]; break;
        case 'm': buffer += padnum(2, base.n); break;
        case 'M': buffer += lang.months[base.m].substr(0, 3); break;
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

  
  CGU.phpdate = function (format, time) {
    format = CGU.limit(format, String) || '';
    time   = CGU.is_a(time, Date) ? time.getTime() : time;
    time   = new Date(CGU.limit(time, Number) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, false)) return null;
    
    return phpf(format, setbase(time, false));
  };

  CGU.phputc = function (format, time) {
    format = CGU.limit(format, String) || '';
    time   = CGU.is_a(time, Date) ? time.getTime() : time;
    time   = new Date(CGU.limit(time, Number) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, true)) return null;
    
    return phpf(format, setbase(time, true));
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * POSIX Formatting
**/
  
  var strf = function (format, base, locale) {
    format = CGU.clone(format).split('');
    
    var buffer = '';
    for (var i = 0; i < format.length; i += 1) {
      if (format[i] == '%') {
        switch (format[(i += 1)]) {
          case 'a': buffer += lang.weekdays[base.w].substr(0, 3); break;
          case 'A': buffer += lang.weekdays[base.w]; break;
          case 'b': buffer += lang.months[base.m].substr(0, 3); break;
          case 'B': buffer += lang.months[base.m]; break;
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
          case 'N': buffer += padnum(3, (base.$u / 1000)); break;
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

  CGU.strftime = function (format, time) {
    format = CGU.limit(format, String) || '';
    time   = CGU.is_a(time, Date) ? time.getTime() : time;
    time   = new Date(CGU.limit(time, Number) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, false)) return null;
    
    return strf(format, setbase(time, false), locale.local);
  };

  CGU.strfutc = function (format, time) {
    format = CGU.limit(format, String) || '';
    time   = CGU.is_a(time, Date) ? time.getTime() : time;
    time   = new Date(CGU.limit(time, Number) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, true)) return null;
    
    return strf(format, setbase(time, true), locale.utc);
  };
  
/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * private
**/
  
  var day = 24 * 60 * 60 * 1000; // milliseconds in a day
  var swb = 24 * 60 * 60 / 1000; // seconds in a swatch beat

  var lang = {
    months   : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekdays : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    meridiem : ['AM', 'PM', 'am', 'pm'],
    ordinal  : ['th', 'st', 'nd', 'rd']
  };
  
  var locale = {
    local: {},
    utc: {
      c: '%a, %d %b %Y %H:%M:%S GMT',
      x: '%Y-%m-%d',
      X: '%H:%M:%S'
    }
  };
  
  post.push(function () {
    var seg = function (name) { // segment from 3 to length - 1
      var segs = [];
      for (var i = (name.length - 1); i >= 3; i -= 1)
        segs.push(name.substr(0, i));
      return segs;
    };
    
    var re_month_full = new RegExp(lang.months[11], 'gi');
    var re_month_abbr = new RegExp(seg(lang.months[11]).join('|'), 'gi');
    var re_week_full  = new RegExp(lang.weekdays[0], 'g');
    var re_week_abbr  = new RegExp(seg(lang.weekdays[0]).join('|'), 'gi');
    var re_meridiem   = new RegExp(lang.meridiem.join('|'), 'gi');
    var re_ordinal    = new RegExp(lang.ordinal.join('\\b|') + '\\b', 'gi');
    
    var conv = function (stage) {
      var f, z;
      switch (stage) {
        case 'c' : f = 'toLocaleString';     z = false; break;
        case 'x' : f = 'toLocaleDateString'; z = false; break;
        case 'X' : f = 'toLocaleTimeString'; z = false; break;
        default  : f = 'toString';           z = false; break;
      }
      
      // 0 or space padding
      var dyZr = (/09/).test(new Date(CGU.local(0, 0, 9, 0, 0, 0, 0))[f]());
      var hrZr = (/09/).test(new Date(CGU.local(0, 0, 0, 9, 0, 0, 0))[f]());
      
      return new Date(CGU.local(2000, 11, 31, 23, 30, 59, 999))[f]().
      // character replacements
        replace(/%/g, '%%').
      // grouping replacements
        replace(/2000-12-31/g, '%Y-%m-%d').
        replace(/2000-W52-0/gi, '%G-W%V-%w').
        replace(/[+-]\d{2}:?(00|15|30|45)/g, '%z').
      // word replacements
        replace(re_month_full, '%B').
        replace(re_month_abbr, '%b').
        replace(re_week_full, '%A').
        replace(re_week_abbr, '%a').
        replace(re_ordinal, '%o').
        replace(re_meridiem, '%p').
      // numeric replacements
        replace(/820\d{4}59/g, '%s').
        replace(/\d+/g, function ($1) {
          switch ($1) {
            case '20'   : return '%C';
            case '31'   : return dyZr ? '%d' : '%e';
            case '11'   : return hrZr ? '%I' : '%l';
            case '23'   : return hrZr ? '%H' : '%k';
            case '12'   : return '%m';
            case '30'   : return '%M';
            case '59'   : return '%S';
            case '999'  : return '%N';
            case '0'    : return '%w';
            case '7'    : return '%u';
            case '52'   : return '%W';
            case '53'   : return '%U';
            case '00'   : return '%y';
            case '2000' : return '%Y';
            default : $1;
          }
        });
    };
    
    locale.local.c = conv('c') || '';
    locale.local.x = conv('x') || '';
    locale.local.X = conv('X') || '';
  });
  
  var inrange = function (time, utc) {
    if (utc) {
      return between(time,
        CGU.utc(   0,  0,  1,  0,  0,  0,   0),
        CGU.utc(9999, 11, 31, 23, 59, 59, 999)
      );
    } else {
      return between(time,
        CGU.local(   0,  0,  1,  0,  0,  0,   0),
        CGU.local(9999, 11, 31, 23, 59, 59, 999)
      );
    };
  };

  var setbase = function (time, utc) {
    // January 1st
    var jc = new Date(utc ? CGU.utc(time.getUTCFullYear() + 0) : CGU.local(time.getFullYear() + 0));
    var jn = new Date(utc ? CGU.utc(time.getUTCFullYear() + 1) : CGU.local(time.getFullYear() + 1));
    
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
  
})();
