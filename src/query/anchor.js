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
 *  param -> Convert an object's properties to a query-string.
 *
 *    Syntax: Query.param(object [, all])
 *
 *      object <Object>: Object to parameterize.
 *
 *      all <Boolean>: Include inherited properties. Default is false.
 *
 *    Return: <String>: Query-string of object's properties.
 *----
 *
 *  read -> Get all values for a key from the current query-string.
 *
 *    Syntax: Query.read(key)
 *
 *      key <String>: Name of the query-string variable.
 *
 *    Return: <Array>: List of values.
 *----
 *
 *  serialize -> Parameterize a Form's elements.
 *
 *    Syntax: Query.serialize(form)
 *
 *      form <Object>: Either a Form DOM object or elements list.
 *
 *    Return: <String>: Query-string of form's elements.
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
