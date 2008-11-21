var between = function (x, m, n) { return m <= x && x <= n; };
var ftoi = function (x) { return x - (x % 1); };
var padnum = function (l, n) { n=String(n); while(n.length<l) n='0'+n; return n; };
var padspc = function (l, n) { n=String(n); while(n.length<l) n=' '+n; return n; };
var tumble = function (x, n) { x=ftoi(x); n=ftoi(n||0); return (x+n-1)%n; };
var tumblesh = function (x, n) { return tumble(x, n) + 1; };
