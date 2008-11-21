/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query :: Core
**/
  this.read = function (key) {
    key = String(key);
    var queries = Type.clone(location.search).replace(/^\?/, '').split(/\&/);
    var matches = [];
    for (var i = 0; i < queries.length; i += 1)
      if (Type.is_a(queries[i], String) && queries[i].match(/[^\=]+\=?/))
        if (key === decodeURIComponent(queries[i].split('=')[0]))
          matches.push(decodeURIComponent(queries[i].split('=')[1] || ''));
    return Type.clone(matches);
  };
