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
 *  abs | utc -> Absolute Date creation.
 *
 *    Syntax: Time.abs([yr [, mn [, dy [, hr [, mi [, sc [, ms]]]]]]])
 *
 *      (All parameters are optional. Default is '0/0/0000 00:00:00'.)
 *
 *    Return: <Number>: Epoch timestamp.
 *----
 *
 *  phpdate | phputc -> PHP date() formatting.
 *
 *    Syntax: Time.phpdate(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *----
 *
 *  strftime | strfutc -> POSIX date formatting. (Work-in-progress)
 *
 *    Syntax: Time.strftime(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Time = new (function () {
  this.Version = '<%= serial %>';
  
<%= inc 'core.js' %>
  
<%= inc 'php.js', 'posix.js' %>

<%= inc 'shared.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Requires
**/
<%= req 2, true, 'type' %>
  
})();
