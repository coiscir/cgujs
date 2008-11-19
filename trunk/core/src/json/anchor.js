/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: JSON
 *    JSON Parsing and Writing
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
 *  from -> Create an object from a JSON-formatted string.
 *
 *    Alias: JSON.parse
 *
 *    Syntax: JSON.from(json [, options])
 *
 *      json <String>: A JSON-formatted string to parse.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        errlen <Number>: Code snippet length for exceptions.
 *
 *        relax <Boolean>: Set all relax properties the same.
 *        relax <Object>: Allow extra parsing for various conditions.
 *
 *          date <Boolean>: Parse UTC date strings.
 *
 *          keyword <Boolean>: Allow the keyword undefined.
 *
 *          number <Boolean>: Allow hexideciml and octal numbers.
 *
 *          objkey <Boolean>: Allow un-quoted object keys.
 *                            Limited to alphanumeric, underscore and dollar.
 *
 *          string <Boolean>: Allow single-quoted strings and hex encoding.
 *
 *    Return: <Mixed>: Object created.
 *
 *      <SyntaxError>: Exception thrown for mal-formed strings.
 *
 *        Format: "JSON: {message} ({position}, {snippet})
 *----
 *
 *  to -> Create JSON-formatted string from an object.
 *
 *    Alias: JSON.stringify
 *
 *    Syntax: JSON.to(input [, options])
 *
 *      input <Mixed>: Object being stringified.
 *
 *      options <Object>: Specify cookie settings. (optional)
 *
 *        allkey <Number>: Don't limit object keys to enumerables.
 *                         Otherwise: {object}.propertyIsEnumerable(property)
 *
 *        relax <Boolean>: Set all relax properties the same.
 *        relax <Object>: Allow extra parsing for various conditions.
 *
 *          date <Boolean>: Parse UTC date strings.
 *
 *          keyword <Boolean>: Allow the keyword undefined.
 *
 *        verify <Boolean>: Use JSON.from to verify string. 
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var JSON = CGUS.JSON = new (function () {
  
<%= inc 'from.js', 'to.js' %>

})();
