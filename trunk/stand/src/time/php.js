/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: PHP
**/
// private
  var phpf = function (base, format, firsts, mondays) {
    var firstCurr = firsts[0];
    var firstNext = firsts[1];
    var monCurr = mondays[0];
    var monNext = mondays[1];
  
    var monthc = [31, (base.l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var ordinal = ['th', 'st', 'nd', 'rd'];
    
    format = Type.clone(format).split('');
    var buffer = '', rfc_colon = true;
    for (var i = 0; i < format.length; i += 1) {
      rfc_colon = true;
      switch (format[i]) {
      // day
        case 'd': buffer += padnum(2, base.d); break;
        case 'D': buffer += weekday[base.w].substr(0, 3); break;
        case 'j': buffer += base.d; break;
        case 'l': buffer += weekday[base.w]; break;
        case 'N': buffer += tumblesh(base.w, 7); break;
        case 'S': buffer += ordinal[between(base.d, 10, 19) ? 0 : (base.d % 10)] || ordinal[0]; break;
        case 'w': buffer += base.w; break;
        case 'z': buffer += ftoi((base.c / firstCurr.getTime()) / day); break;
      // week
        case 'W': buffer += padnum(2, (
                    ftoi((
                      ftoi(base.c / day) -
                      tumble(base.w, 7) -
                      ftoi((base.c > monNext ? monNext : monCurr) / day)
                    ) / 7) + 1
                  )); break;
      // month
        case 'F': buffer += months[base.n]; break;
        case 'm': buffer += padnum(2, base.m); break;
        case 'M': buffer += months[base.n].substr(0, 3); break;
        case 'n': buffer += base.m; break;
        case 't': buffer += monthc[base.n]; break;
      // year
        case 'L': buffer += base.l ? 1 : 0; break;
        case 'o': buffer += padnum(4, (
                    (base.c < monCurr ? (base.y - 1) :
                      (base.c >= monNext ? (base.y + 1) : base.y)
                    )
                  )); break;
        case 'Y': buffer += padnum(4, base.y); break;
        case 'y': buffer += padnum(4, (base.y % 100)); break;
      // time
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
        case 'u': buffer += padnum(6, base.u); break;
      // timezone
        case 'e': buffer += 'e'; break;  /* unsupported */
        case 'I': buffer += base.dst ? 1 : 0; break;
        case 'O': rfc_colon = false; /* break intentionally missing */
        case 'P': buffer += ''.concat(
                    (base.z < 0 ? '-' : '+'),
                    (padnum(2, Math.abs(ftoi(base.z / 60)))),
                    (rfc_colon ? ':' : ''),
                    (padnum(2, Math.abs(base.z % 60)))
                  ); break;
        case 'T': buffer += 'T'; break;  /* unsupported */
        case 'Z': buffer += base.z * 60; break;
      // full date/time
        case 'c': buffer += ''.concat( /* "Y-m-d\TH:i:sP" */
                    padnum(4, base.y), '-',
                    padnum(2, base.m), '-',
                    padnum(2, base.d), 'T',
                    padnum(2, base.h), ':',
                    padnum(2, base.i), ':',
                    padnum(2, base.s),
                    (base.z < 0 ? '-' : '+'),
                    (padnum(2, Math.abs(ftoi(base.z / 60)))), ':',
                    (padnum(2, Math.abs(base.z % 60)))
                  ); break;
        case 'r': buffer += ''.concat( /* "D, d M Y H:i:s O" */
                    weekday[base.w].substr(0, 3), ', ',
                    padnum(2, base.d), ' ',
                    months[base.n].substr(0, 3), ' ',
                    padnum(4, base.y), ' ',
                    padnum(2, base.h), ':',
                    padnum(2, base.i), ':',
                    padnum(2, base.s), ' ',
                    (base.z < 0 ? '-' : '+'),
                    (padnum(2, Math.abs(ftoi(base.z / 60)))),
                    (padnum(2, Math.abs(base.z % 60)))
                  ); break;
        case 'U': buffer += base.t; break;
        
        case '\\': i += 1;
        
        default: buffer += (format[i] || ''); break;
      }
    }
    
    return buffer;
  };

// public
  this.php = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, false)) return null;
    
    // January 1st
    var firstCurr = new Date((time.getFullYear() + 0), 0, 1);
    var firstNext = new Date((time.getFullYear() + 1), 0, 1);
    
    // 1st Monday
    var dayCurr = tumble(firstCurr.getDay(), 7);
    var dayNext = tumble(firstNext.getDay(), 7);
    var monCurr = firstCurr.getTime() - (day * (dayCurr - (dayCurr >= 4 ? 7 : 0)));
    var monNext = firstNext.getTime() - (day * (dayNext - (dayNext >= 4 ? 7 : 0)));
    
    var base = {}; /* c, d, h, i, l, m, n, o, s, t, u, w, y, z */
    // day, month, year
      base.d   = time.getDate();
      base.m   = time.getMonth() + 1;
      base.n   = time.getMonth();
      base.y   = time.getFullYear();
    // hour, minute, second
      base.h   = time.getHours();
      base.i   = time.getMinutes();
      base.s   = time.getSeconds();
    // week
      base.w   = time.getDay();
    // time
      base.c   = time.getTime();
      base.t   = ftoi(base.c / 1000);
      base.u   = (base.c % 1000) * 1000;
    // timezone
      base.o   = time.getTimezoneOffset();
      base.z   = -1 * base.o;
      base.dst = base.o !== firstCurr.getTimezoneOffset();
    // leap year
      base.l   = !(base.y % 4) && !!(base.y % 100) || !(base.y % 400);
    /*# end #*/
    
    return phpf(base, format, [firstCurr, firstNext], [monCurr, monNext]);
  };

  this.utcphp = function (format, time) {
    format = Type.limit(format, String) || '';
    time   = new Date(Type.limit(time, Date, Number, String) || new Date().getTime());
    
    if (time != 0 && !time) return;
    if (!inrange(time, true)) return null;
    
    // January 1st
    var firstCurr = new Date(Date.UTC((time.getUTCFullYear() + 0), 0, 1));
    var firstNext = new Date(Date.UTC((time.getUTCFullYear() + 1), 0, 1));
    
    // 1st Monday
    var dayCurr = tumble(firstCurr.getUTCDay(), 7);
    var dayNext = tumble(firstNext.getUTCDay(), 7);
    var monCurr = firstCurr.getTime() - (day * (dayCurr - (dayCurr >= 4 ? 7 : 0)));
    var monNext = firstNext.getTime() - (day * (dayNext - (dayNext >= 4 ? 7 : 0)));
    
    var base = {}; /* c, d, h, i, l, m, n, o, s, t, u, w, y, z */
    // day, month, year
      base.d   = time.getUTCDate();
      base.m   = time.getUTCMonth() + 1;
      base.n   = time.getUTCMonth();
      base.y   = time.getUTCFullYear();
    // hour, minute, second
      base.h   = time.getUTCHours();
      base.i   = time.getUTCMinutes();
      base.s   = time.getUTCSeconds();
    // week
      base.w   = time.getUTCDay();
    // time
      base.c   = time.getTime();
      base.t   = ftoi(base.c / 1000);
      base.u   = (base.c % 1000) * 1000;
    // timezone
      base.o   = 0;
      base.z   = 0;
      base.dst = false;
    // leap year
      base.l   = !(base.y % 4) && !!(base.y % 100) || !(base.y % 400);
    /*# end #*/
    
    return phpf(base, format, [firstCurr, firstNext], [monCurr, monNext]);
  };
