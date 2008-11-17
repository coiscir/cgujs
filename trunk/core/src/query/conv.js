/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Conversion
**/
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
