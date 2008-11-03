/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: PHP
**/
// private
  var phpf = function (format, base) {
    format = Type.clone(format).split('');
    
    var monthc = [31, (base.l ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
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
        case 'F': buffer += months[base.m]; break;
        case 'm': buffer += padnum(2, base.n); break;
        case 'M': buffer += months[base.m].substr(0, 3); break;
        case 'n': buffer += base.n; break;
        case 't': buffer += monthc[base.m]; break;
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
