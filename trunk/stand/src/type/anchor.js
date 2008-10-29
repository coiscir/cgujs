<%= req 'HEADER' %>

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Type
 *    Enhanced Data-Type Distinction
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
 *  clone -> Clone any type of object.
 *
 *    Syntax: Type.clone(object)
 *
 *      object <Mixed>: The object to be cloned.
 *
 *    Return: <Mixed>: The object's clone.
 *----
 *
 *  get -> Enhanced typeof.
 *
 *    Syntax: Type.get(object)
 *
 *      object <Mixed>: The object to be tested.
 *
 *    Return: <String>: The object's type.
 *----
 *
 *  is_a -> Enhanced instanceof.
 *
 *    Syntax: Type.is_a(object, compare)
 *
 *      object <Mixed>: The object to be compared.
 *
 *      compare <String>: A type.
 *      compare <Function>: A constructor.
 *
 *    Return: <Boolean>: Object compared the type or Constructor.
 *----
 *
 *  isof -> Multiple is_a with OR testing.
 *
 *    Syntax: Type.isof(object, compare [, ..])
 *
 *      Properties are the same as is_a.
 *
 *    Return: <Boolean>: Object compared a type or Constructor.
 *----
 *
 *  limit -> Limit an object's type.
 *
 *    Syntax: Type.limit(object, compare [, ..])
 *
 *      Properties are the same as is_a and isof.
 *
 *    Return: <Mixed>: A clone of the object.
 *
 *      <undefined>: Object did not compare.
 *----
 *
 *  types -> Get a list of recognized types.
 *
 *    Syntax: Type.types()
 *
 *    Return: <Array>: List of recognized types.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Type = new (function () {
  this.Version = '<%= serial %>';
  
<%= inc 'types.js', 'utils.js', 'lists.js' %>

})();
