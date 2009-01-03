/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Time
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Time() {
  
  CGU.local = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date();
    
    if (arguments.length > 0) {
      date.setFullYear(0, 0, 1);
      date.setHours(0, 0, 0, 0);
      
      if (CGU.is_a(yr, Number)) date.setFullYear(yr);
      if (CGU.is_a(mn, Number)) date.setMonth(mn - 1);
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
      if (CGU.is_a(mn, Number)) date.setUTCMonth(mn - 1);
      if (CGU.is_a(dy, Number)) date.setUTCDate(dy);
      if (CGU.is_a(hr, Number)) date.setUTCHours(hr);
      if (CGU.is_a(mi, Number)) date.setUTCMinutes(mi);
      if (CGU.is_a(sc, Number)) date.setUTCSeconds(sc);
      if (CGU.is_a(ms, Number)) date.setUTCMilliseconds(ms);
    }
    
    return date.getTime();
  };
  
  CGU.fromTime = function (time) {
    return CGU.strfutc("%FT%T.%NZ", time);
  };
  
  CGU.toTime = function (string) {
    if (!CGU.is_a(string, String)) return;
    if (!isTime.test(string)) return null;
    var dt = isTime.exec(string);
    return new Date(CGU.utc(+dt[1], +dt[2], +dt[3], +dt[4], +dt[5], +dt[6], +dt[7]));
  };
  
  var isTime = /(\d{4})-(\d{2})-(\d{2})[T\x20](\d{2}):(\d{2}):(\d{2})(?:\.(\d{3})\d*)?Z?/;
  
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
        case 'c': buffer += phpf('Y-m-d\\TH:i:sP', base, locale); break;
        case 'r': buffer += phpf('D, d M Y H:i:s O', base, locale); break;
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
          case 'c': buffer += strf(locale.c, base, locale); break;
          case 'C': buffer += padnum(2, ftoi(base.y / 100)); break;
          case 'd': buffer += padnum(2, base.d); break;
          case 'D': buffer += strf('%m/%d/%y', base, locale); break;
          case 'e': buffer += padspc(2, base.d); break;
          case 'E': break;
          case 'F': buffer += strf('%Y-%m-%d', base, locale); break;
          case 'g': buffer += padnum(2, strf('%G', base, locale) % 100); break;
          case 'G': buffer += padnum(4, (
                      (base.$$ < base.ac ? (base.y - 1) :
                        (base.$$ >= base.an ? (base.y + 1) : base.y)
                      )
                    )); break;
          case 'h': buffer += strf('%b', base, locale); break;
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
          case 'r': buffer += strf('%I:%M:%S %p', base, locale); break;
          case 'R': buffer += strf('%H:%M', base, locale); break;
          case 's': buffer += base.$t; break;
          case 'S': buffer += padnum(2, base.s); break;
          case 't': buffer += '\t'; break;
          case 'T': buffer += strf('%H:%M:%S', base, locale); break;
          case 'u': buffer += tumblesh(base.w, 7); break;
          case 'U': buffer += padnum(2, ftoi((base.$$ - base.fs) / (7 * day))); break;
          case 'v': buffer += strf('%e-%b-%Y', base, locale); break;
          case 'V': buffer += padnum(2, (
                      ftoi((
                        ftoi(base.$$ / day) -
                        tumble(base.w, 7) -
                        ftoi((base.$$ > base.an ? base.an : base.ac) / day)
                      ) / 7) + 1
                    )); break;
          case 'w': buffer += base.w; break;
          case 'W': buffer += padnum(2, ftoi((base.$$ - base.fm) / (7 * day))); break;
          case 'x': buffer += strf(locale.x, base, locale); break;
          case 'X': buffer += strf(locale.X, base, locale); break;
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
      var dyZr = (/09/).test(new Date(CGU.local(0, 1, 9, 0, 0, 0, 0))[f]());
      var hrZr = (/09/).test(new Date(CGU.local(0, 1, 0, 9, 0, 0, 0))[f]());
      
      return new Date(CGU.local(2000, 12, 31, 23, 30, 59, 999))[f]().
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
        CGU.utc(   0,  1,  1,  0,  0,  0,   0),
        CGU.utc(9999, 12, 31, 23, 59, 59, 999)
      );
    } else {
      return between(time,
        CGU.local(   0,  1,  1,  0,  0,  0,   0),
        CGU.local(9999, 12, 31, 23, 59, 59, 999)
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
      base.$u = (((base.$$ % 1000) + 1000) % 1000) * 1000;
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
