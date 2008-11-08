/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Shared
**/
  var day = 24 * 60 * 60 * 1000; // milliseconds in a day
  var swb = 24 * 60 * 60 / 1000; // seconds in a swatch beat
  
  var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
  var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ordinal = ['th', 'st', 'nd', 'rd'];

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
