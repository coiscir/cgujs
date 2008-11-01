/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Core
**/
  var day = 24 * 60 * 60 * 1000; // milliseconds in a day
  var swb = 24 * 60 * 60 / 1000; // seconds in a swatch beat

  var between = function (x, m, n) { return m <= x && x <= n; };
  var ftoi = function (x) { return x - (x % 1); };
  var tumble = function (x, n) { x=ftoi(x); n=ftoi(n||0); return (x+n-1)%n; };
  var tumblesh = function (x, n) { return tumble(x, n) + 1; };
  var padnum = function (l, n) { n=String(n); while(n.length<l) n='0'+n; return n; };

  var inrange = function (time, utc) {
    if (utc) {
      return between(time,
        new Date(-999,  0,  1,  0,  0,  0,   0).getTime(),
        new Date(9999, 11, 31, 23, 59, 59, 999).getTime()
      );
    } else {
      return between(time,
        new Date(-999,  0,  1,  0,  0,  0,   0).getTime(),
        new Date(9999, 11, 31, 23, 59, 59, 999).getTime()
      );
    };
  };
