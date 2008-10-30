<%= req 'HEADER' %>

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie
 *    Read, Write, and Delete (Expire) Cookies
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *
 *  expire -> Force a cookie to expire.
 *
 *    Syntax: Cookie.expire(key [, options])
 *
 *      key <String>: Name of the cookie.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <null>: Wasn't previously written.
 *----
 *
 *  read -> Get the value of a cookie.
 *
 *    Syntax: Cookie.read(key)
 *
 *      key <String>: Name of the cookie.
 *
 *    Return: <String>: Value of the cookie.
 *
 *      <null>: Cookie hasn't been written.
 *----
 *
 *  write -> Create a cookie.
 *
 *    Syntax: Cookie.write(key, value [, options])
 *
 *      key <String>: Name of the cookie.
 *
 *      value <String>: Value of the cookie.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        domain <String>: The domain associated with the cookie.
 *
 *        expire <Number>: Number of days the cookie should live.
 *                         Leave unset to create a session cookie.
 *
 *        path <String>: The path associated with the cookie.
 *
 *        secure <Boolean>: Create a secure cookie.
 *
 *    Return: <Boolean>: Successful or not.
 *
 *      <null>: Key was not specified.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Cookie = new (function () {
  this.Version = '<%= serial %>';
  
<%= inc 'core.js' %>

<%= inc 'conv.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Cookie :: Requires
**/
<%= req 2, true, 'type' %>

})();
