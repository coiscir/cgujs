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
 *    expire
 *
 *      Description: Delete a cookie by forcing it to expire.
 *
 *      Return: <Boolean> || <null>
 *
 *        null: Cookie was not already written before attempting to expire.
 *
 *      Syntax: Cookie.expire(key [, options])
 *
 *        key <Mixed>: Name of the cookie.
 *
 *          Any non-String keys will first be casted to String.
 *
 *        options <Object>: (Optional)
 *
 *          Same as for Cookie.write, excluding duration.
 *
 *----
 *    read
 *
 *      Description: Get the value of a cookie.
 *
 *      Return: <String> || <null>
 *
 *        null: Cookie key/name was not found.
 *
 *      Syntax: Cookie.read(key)
 *
 *        key <Mixed>: Name of the cookie.
 *
 *----
 *    write
 *
 *      Description: Create a cookie.
 *
 *      Return: <Boolean>
 *
 *      Syntax: Cookie.write(key, value [, options])
 *
 *        key <Mixed>: Name of the cookie.
 *
 *          Any non-String keys will first be casted to String.
 *
 *        value <Mixed>: Value of the cookie.
 *
 *          Any non-String values will first be casted to String.
 *
 *        options <Object>: (Optional)
 *
 *          domain <String>: The domain or host name associated with the cookie.
 *
 *          duration <Number>: Time, in days, that the cookie should live. Leave this unset to create a session cookie.
 *
 *          path <String>: The path associated with the cookie.
 *
 *          secure <Boolean>: Use a secure cookie.
 *
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/
