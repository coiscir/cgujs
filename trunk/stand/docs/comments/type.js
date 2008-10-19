/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Properties
 *
 *----
 *    Version
 *
 *      Formatting is based on the date built: Y.MMDD
 *      Where `Y` is the number of years since 2000.
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  Methods
 *
 *----
 *    clone
 *
 *      Description: Clone an object.
 *
 *      Return: <Mixed>
 *
 *      Syntax: Type.clone(object)
 *
 *        object <Mixed>: The object being cloned.
 *
 *----
 *    get
 *
 *      Description: Enhanced typeof.
 *
 *      Return: <String>
 *
 *      Syntax: Type.get(object)
 *
 *        object <Mixed>: The object being tested.
 *
 *----
 *    is_a
 *
 *      Description: Enhanced instanceof.
 *
 *      Return: <Boolean>
 *
 *      Syntax: Type.is_f(object, {type|Constructor})
 *
 *        object <Mixed>: The object being tested.
 *
 *        type <String>: A type string to test against.
 *        Constructor <Function>: A constructor function to test against.
 *
 *----
 *    isof
 *
 *      Description: Multiple is_a.
 *
 *      Return: <Boolean>
 *
 *      Syntax: Type.isof(object, {type|Constructor} [, ..])
 *
 *        Properties descriptions are the same as Type.is_a.
 *
 *----
 *    limit
 *
 *      Description: Limit an object's type.
 *
 *        Short for combining isof and clone.
 *
 *      Return: <Mixed> || <undefined>
 *
 *        undefined: isof returned false.
 *
 *      Syntax: Type.limit(object, {type|Constructor} [, ..])
 *
 *        Properties descriptions are the same as Type.is_a and Type.isof.
 *
 *----
 *    types
 *
 *      Description: Get a list of all recognized type strings.
 *
 *      Return: <Array>
 *
 *      Syntax: Type.types()
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
