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
 *----
 *
 *  strftime -> [work in progress]
 *
 *  strfutc -> [under consideration]
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Time = new (function () {
  this.Version = '<%= serial %>';
  
<%= inc 'core.js' %>
  
<%= inc 'php.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Requires
**/
<%= req 2, true, 'type' %>
  
})();
