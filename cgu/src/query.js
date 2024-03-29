/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU - Query
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released and distributable under the terms of the MIT License.
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

(function Query() {
  
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
    CGU.each(queries, function (v) {
      var s = v.split(/=/);
      if (key == decodeURIComponent(s[0]))
        matches.push(decodeURIComponent(s[1] || ''));
    });
    return CGU.clone(matches);
  };
  
  CGU.param = function (object, complete) {
    complete = CGU.limit(complete, Boolean) || false;
    
    var serial = [], i;
    var add = function (k, v) {
      serial.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
    };
    
    // handle serialize arrays
    if (CGU.is_a(object, Array) && object._seralized === true)
      CGU.each(object, function (v, k, t) {
        add(v.name, v.value);
      });
    
    // handle other objects
    else
      CGU.each(object, function (v, k) {
        switch (CGU.type(v)) {
          case 'undefined':
          case 'error'    :
          case 'function' :
          case 'regexp'   : break;
          case 'object': serial.push(CGU.param(v)); break;
          case 'array' : CGU.each(v, function(v){ add(k, v); }); break;
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
    
    CGU.each(CGU.asArray(fe.elements || fe), function (e) {
      var first = false;
      if (e.name.length > 0 && !e.disabled)
        switch (e.type) {
          case 'select-one': first = true;
          case 'select-multiple':
            CGU.each(CGU.asArray(e.options), function (o) {
              if (o.selected && !o.disabled) {
                add(e.name, o.value);
                if (first) return null;
              }
            });
            break;
          case 'checkbox':
          case 'radio': if (!e.checked) break;
          default: if (CGU.is_a(e.value, String)) add(e.name, e.value); break;
        }
    });
    
    elems._seralized = true; // add catch for param
    return CGU.param(elems, complete);
  };

})();
