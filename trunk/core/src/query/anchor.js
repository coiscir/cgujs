/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Query
 *    Read HTTP GET Variables
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
 *  read -> Get all values for a key.
 *
 *    Syntax: Query.read(key)
 *
 *      key <String>: Name of the query-string variable.
 *
 *    Return: <Array>: List of values.
 *----
 *
 *  toObject -> Get an object representation of the query-string.
 *
 *    Syntax: Query.toObject()
 *
 *    Return: <Object>: With query-string names as keys and an array of string values respectively.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Query = CGUS.Query = new (function () {
  
<%= inc 'core.js' %>

<%= inc 'conv.js' %>

})();
