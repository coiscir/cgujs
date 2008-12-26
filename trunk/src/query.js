/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Query
 *    HTTP GET Variables and Query-String Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *----
 *
 *  location -> Create a location clone from a URI.
 *
 *    Syntax: CGU.location(href)
 *
 *      href <String>: URI to create a location clone from.
 *
 *        <null>: Clone the global location.
 *
 *    Return: <Object>: A location clone.
 *
 *      <null>: Invalid href string.
 *
 *      <undefined>: href was not specified.
 *----
 *
 *  param -> Create a query-string from an object's properties.
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
    
    var seg = href.match(/^(?:([a-z\-]+:)\/\/)?(([a-z0-9\-\.]+)(?:\:(\d+))?)?(\/[^#?]*)?(\?[^#]*)?(\#.*)?$/i);
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
    CGU.iterate(queries, function (v) {
      var s = v.split(/=/);
      if (key == decodeURIComponent(s[0]))
        matches.push(decodeURIComponent(s[1] || ''));
    });
    return CGU.clone(matches);
  };
  
  CGU.param = function (object, complete) {
    complete = complete === true ? true : false;
    
    var serial = [], i;
    var add = function (k, v) {
      serial.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    };
    var append = function (s) {
      serial.push(s);
    };
    
    // handle serialize arrays
    if (CGU.is_a(object, Array) && object._seralized === true)
      CGU.iterate(object, function (v, k, t) {
        add(v.name, v.value);
      });
    
    // handle other objects
    else
      CGU.iterate(object, function (v, k) {
        switch (CGU.type(v)) {
          case 'undefined':
          case 'error'    :
          case 'function' :
          case 'regexp'   : break;
          case 'object': append(CGU.param(v)); break;
          case 'array' : CGU.iterate(v, function(v){ add(k, v); }); break;
          case 'date'  : add(k, CGU.fromTime(v)); break;
          default: add(k, v); break;
        }
      }, true);
    
    return (complete ? '?' : '') + serial.join('&').replace(/%20/, '+');
  };
  
  CGU.serialize = function (fe, complete) { // fe = form/elements
    var elems = [], i, j;
    var add = function (name, value) {
      elems.push({name: name, value: (value || '')});
    };
    
    CGU.iterate(CGU.asArray(fe.elements || fe), function (e) {
      var first = false;
      if (e.name.length > 0)
        switch (e.type) {
          case 'select-one': first = true;
          case 'select-multiple':
            CGU.iterate(CGU.asArray(e.options), function (o) {
              if (o.selected) {
                add(e.name, o.value);
                if (first) return null;
              }
            });
            break;
          case 'checkbox':
          case 'radio': if (!e.checked) break;
          default: add(e.name, e.value); break;
        }
    });
    
    elems._seralized = true; // add catch for param
    return CGU.param(elems, complete);
  };

})();
