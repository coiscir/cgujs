<%= req 'HEADER' %>

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
 *
 *  php -> PHP date() formatting for local time.
 *
 *    Syntax: Time.php(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, -999 (1000 B.C.) to Dec 31, 9999.
 *----
 *
 *  utcphp -> PHP date() formatting for UTC time.
 *
 *    (Timezone is the only difference between php and utcphp.)
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Time = new (function () {
  this.Version = '<%= serial %>';
  
  var between = function (x, m, n) { return m <= x && x <= n; };
  var ftoi = function (x) { return x - (x % 1); };
  var tumble = function (x, n) { x=ftoi(x); n=ftoi(n||0); return (x+n-1)%n; };
  var tumblesh = function (x, n) { return tumble(x, n) + 1; };
  var padnum = function (l, n) { n=String(n); while(n.length<l) n='0'+n; return n; };
  
  var day = 24 * 60 * 60 * 1000; // milliseconds in a day
  var swb = 24 * 60 * 60 / 1000; // seconds in a swatch beat
  
<%= inc 'php.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Requires
**/
<%= req 2, true, 'type' %>
  
})();
