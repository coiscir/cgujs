/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: POSIX {WIP}
**/
// private
  var strflocale = function (utc) {
    var swap = function (c) {
      return (_locale[utc ? 'utc' : 'local'][c] || '').replace(/%(C|d|H|M|m|o|p|S|W|w|y|Z|z)\1*/g, function ($1) {
        switch ($1) {
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
          case 'a': buffer += lang.week_s[base.w]; break;
          case 'A': buffer += lang.week_f[base.w]; break;
          case 'b': buffer += lang.month_s[base.m]; break;
          case 'B': buffer += lang.month_f[base.m]; break;
          case 'c': buffer += strf(locale.c, base); break;
                    /* buffer += strf('%a %b %e %H:%M:%S %Y', base); break; */
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
          case 'O': break;
          case 'p': buffer += lang.meridien[(base.h < 12 ? 0 : 1)] || ''; break;
          case 'P': break; /* disable ruby-1.9 equivalents */
                    buffer += base.h < 12 ? 'am' : 'pm'; break;
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
                    /* buffer += strf('%m/%d/%y', base); break; */
          case 'X': buffer += strf(locale.X, base); break;
                    /* buffer += strf('%H:%M:%S', base); break; */
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
