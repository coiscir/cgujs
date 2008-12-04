/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Query
 *    HTTP GET Variables and Query-String Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  location -> Create a location clone object from a URI.
 *
 *    Syntax: CGU.location(href)
 *
 *      href <String>: Create a location-like object from a URI.
 *
 *        <null>: Clone the global location.
 *
 *    Return: <Object>: List of values.
 *
 *      <null>: Invalid href string.
 *
 *      <undefined>: href was not specified.
 *----
 *
 *  param -> Create a query-string from an object's keys.
 *
 *    Syntax: CGU.param(object [, complete])
 *
 *      object <Object>: Object to parameterize.
 *
 *      complete <Boolean>: Return a complete search string.
 *
 *    Return: <String>: Query-string of object's properties.
 *----
 *
 *  query -> Search a query-string for all values of a key.
 *
 *    Syntax: CGU.query(key [, href])
 *
 *      key <String>: Name of the query-string variable.
 *
 *      href <String>: Any URI accepted by CGU.location.
 *
 *        <null>: Use current location.
 *
 *    Return: <Array>: List of values.
 *
 *      <undefined>: Invalid href.
 *
 *    Note: Use complete with param and serialize for a valid href.
 *
 *      Example: CGU.query('foo', CGU.param({foo: 24}, true))
 *----
 *
 *  serialize -> Parameterize a Form's elements.
 *
 *    Syntax: CGU.serialize(form [, complete])
 *
 *      form <Object>: Either a Form DOM object or elements list.
 *
 *      complete <Boolean>: Return a complete search string.
 *
 *    Return: <String>: Query-string of form's elements.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Query() { // enable private members
  
  CGU.location = function (href) {
    if (CGU.is_a(href, null)) href = window.location.toString();
    if (!CGU.is_a(href, String)) return;
    
    var pathslash = (/\\/).test(window.location.pathname);
    
    var seg = href.match(/^(?:([a-z\-]+:)\/\/)?(([a-z0-9\.]+)(?:\:(\d+))?)?(\/[^#?]*)?(\?[^#]*)?(\#.*)?$/i);
    if (!seg) return null;
    return {
      hash     : (seg[7] || ''),
      host     : (seg[2] || ''),
      hostname : (seg[3] || ''),
      href     : (seg[0] || ''),
      pathname : (seg[5] || '').replace(/(?!^)\//g, (pathslash ? '\\' : '/')),
      port     : (seg[4] || ''),
      protocol : (seg[1] || ''),
      search   : (seg[6] || ''),
      toString : function () { return this.href; },
      valueOf  : function () { return this.href; }
    };
  };

  CGU.query = function (key, href) {
    key = String(key);
    var location = CGU.location(CGU.limit(href, String) || null);
    if (!location) return;
    
    var queries = location.search.replace(/^\?/, '').replace(/\+/, '%20').split(/\&/);
    var matches = [];
    for (var i = 0; i < queries.length; i += 1)
      if (CGU.is_a(queries[i], String) && queries[i].match(/[^\=]+\=?/))
        if (key === decodeURIComponent(queries[i].split('=')[0]))
          matches.push(decodeURIComponent(queries[i].split('=')[1] || ''));
    return CGU.clone(matches);
  };
  
  CGU.param = function (object, complete) {
    complete = complete === true ? true : false;
    
    var serial = [], i;
    var append = function (key, value) {
      serial.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };
    var insArr = function (name, arr) {
      for (var i = 0; i < object[p].length; i += 1)
        append(name, object[p][i]);
    };
    var insObj = function (obj) {
      serial.push(CGU.param(obj));
    };
    
    // handle serialize arrays
    if (CGU.is_a(object, Array) && object._seralized === true)
      for (i = 0; i < object.length; i += 1)
        append(object[i].name, object[i].value);
    
    // handle other objects
    else
      for (var p in object)
        if (object.propertyIsEnumerable(p))
          switch (CGU.type(object[p])) {
            case 'undefined':
            case 'error'    :
            case 'function' :
            case 'regexp'   : break;
            case 'object': insObj(object[p]); break;
            case 'array' : insArr(p, object[p]); break;
            case 'date'  : append(p, CGU.strfutc('%FT%T.%NZ', object[p])); break;
            default: append(p, object[p]); break;
          }
    
    return (complete ? '?' : '') + serial.join('&').replace(/%20/, '+');
  };
  
  CGU.serialize = function (fe, complete) { // fe = form/elements
    fe = CGU.is_a(fe.elements, 'object') ? fe.elements : fe;
    if (!CGU.is_a(fe.length, Number)) return null;
    
    var elems = [], i, j, first;
    var add = function (name, value) {
      elems.push({name: name, value: (value || '')});
    };
    
    for (i = 0; i < fe.length; i += 1, first = false)
      if (fe[i].name.length > 0)
        switch (fe[i].type) {
          case 'select-one': first = true;
          case 'select-multiple':
            for (j = 0; j < fe[i].options.length; j += 1)
              if (fe[i].options[j].selected) {
                add(fe[i].name, fe[i].options[j].value);
                if (first) break;
              }
            break;
          case 'checkbox':
          case 'radio': if (!fe[i].checked) break;
          default: add(fe[i].name, fe[i].value); break;
        }
    
    elems._seralized = true; // add catch for param
    return CGU.param(elems, complete);
  };

})();
