/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Query :: Conversion
**/
  var _param = this.param = function (object, all) {
    all = all === true ? true : false;
    
    var serial = [], i;
    var append = function (key, value) {
      serial.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
    };
    
    if (Type.is_a(object, Array))
      for (i = 0; i < object.length; i += 1)
        append(object[i].name, object[i].value);
    
    if (Type.is_a(object, 'object'))
      for (var p in object)
        if (all || object.propertyIsEnumerable(p))
          switch (Type.get(object[p])) {
            case 'undefined':
            case 'error':
            case 'function':
            case 'regexp':
              break;
            case 'object':
              serial.push(_param(object[p], all));
              break;
            case 'array':
              for (i = 0; i < object[p].length; i += 1)
                append(p, object[p][i]);
              break;
            case 'date':
              append(p, Time.strfutc('%FT%T.%NZ', object[p]));
              break;
            default:
              append(p, object[p]);
              break;
          }
    
    return serial.join('&').replace(/%20/, '+');
  };
  
  this.serialize = function (fe) {
    fe = Type.is_a(fe.elements, 'object') ? fe.elements : fe;
    if (!Type.is_a(fe.length, Number)) return null;
    
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
          case 'radio'   : if (fe[i].checked) add(fe[i].name, fe[i].value); break;
          default: add(fe[i].name, fe[i].value); break;
        }
    
    return _param(elems);
  };

  this.toObject = function (key) {
    var object = {}, k, v;
    var queries = Type.clone(location.search).replace(/^\?/, '').split(/\&/);
    for (var i = 0; i < queries.length; i += 1) {
      k = decodeURIComponent(queries[i].split('=')[0]);
      v = decodeURIComponent(queries[i].split('=')[1]) || '';
      if (k != '') {
        object[k] = object[k] || [];
        object[k].push(v);
      }
    }
    return Type.clone(object);
  };
