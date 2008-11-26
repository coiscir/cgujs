/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Query
 *    HTTP GET Variables and Query-String Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  location -> Get all values for a key from the current query-string.
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
 *  param -> Convert an object's properties to a query-string.
 *
 *    Syntax: CGU.param(object [, all])
 *
 *      object <Object>: Object to parameterize.
 *
 *      all <Boolean>: Include inherited properties. Default is false.
 *
 *    Return: <String>: Query-string of object's properties.
 *----
 *
 *  query -> Get all values for a key from the current query-string.
 *
 *    Syntax: CGU.query(key [, href])
 *
 *      key <String>: Name of the query-string variable.
 *
 *      href <String>: Any URI accepted by CGU.location.
 *
 *        <undefined>: Use current location.
 *
 *    Return: <Array>: List of values.
 *
 *      <undefined>: Invalid href.
 *
 *    Note: Precede param and serialize values with '?' for a valid href.
 *
 *      Example: CGU.query('foo', '?' + CGU.param(object))
 *----
 *
 *  query.toObject -> Get an object representation of the query-string.
 *
 *    Syntax: CGU.query.toObject()
 *
 *    Return: <Object>: of key properties of value arrays.
 *----
 *
 *  serialize -> Parameterize a Form's elements.
 *
 *    Syntax: CGU.serialize(form)
 *
 *      form <Object>: Either a Form DOM object or elements list.
 *
 *    Return: <String>: Query-string of form's elements.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Query() { // enable private members
  
  CGU.location = function (href) {
    if (CGU.is_a(href, null)) href = window.location.toString();
    if (!CGU.is_a(href, String)) return;
    
    var seg = href.match(/^(?:([a-z\-]+:)\/\/)?(([a-z0-9\.]+)(?:\:(\d+))?)?(\/[^#?]*)?(\?[^#]*)?(\#.*)?$/i);
    if (!seg) return null;
    return {
      constructor : {},
      hash     : seg[7] || '',
      host     : seg[2] || '',
      hostname : seg[3] || '',
      href     : seg[0] || '',
      pathname : seg[5] || '',
      port     : seg[4] || '',
      protocol : seg[1] || '',
      search   : seg[6] || '',
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
  
  CGU.query.toObject = function () {
    var object = {}, k, v;
    var queries = CGU.clone(location.search).replace(/^\?/, '').split(/\&/);
    for (var i = 0; i < queries.length; i += 1) {
      k = decodeURIComponent(queries[i].split('=')[0]);
      v = decodeURIComponent(queries[i].split('=')[1]) || '';
      if (k != '') {
        object[k] = object[k] || [];
        object[k].push(v);
      }
    }
    return CGU.clone(object);
  };
  
  CGU.param = function (object, all) {
    all = all === true ? true : false;
    
    var serial = [], i;
    var append = function (key, value) {
      serial.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };
    
    // handle serialize arrays
    if (CGU.is_a(object, Array) && object._seralized === true)
      for (i = 0; i < object.length; i += 1)
        append(object[i].name, object[i].value);
    
    // handle other objects
    else
      for (var p in object)
        if (all || object.propertyIsEnumerable(p))
          switch (CGU.type(object[p])) {
            case 'undefined':
            case 'error':
            case 'function':
            case 'regexp':
              break;
            case 'object':
              serial.push(CGU.param(object[p], all));
              break;
            case 'array':
              for (i = 0; i < object[p].length; i += 1)
                append(p, object[p][i]);
              break;
            case 'date':
              append(p, CGU.strfutc('%FT%T.%NZ', object[p]));
              break;
            default:
              append(p, object[p]);
              break;
          }
    
    return serial.join('&').replace(/%20/, '+');
  };
  
  CGU.serialize = function (fe) { // fe = form/elements
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
    
    elems._seralized = true;
    return CGU.param(elems);
  };

})();