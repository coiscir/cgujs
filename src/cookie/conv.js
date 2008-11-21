/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Cookie :: Conversion
**/
  this.toObject = function () {
    var object = {}, k, v;
    var cookies = Type.clone(document.cookie).split(/\;\s*/);
    for (var i = 0; i < cookies.length; i += 1) {
      k = decodeURIComponent(cookies[i].split('=')[0]);
      v = decodeURIComponent(cookies[i].split('=')[1]) || '';
      if (k != '')
        object[k] = v;
    }
    return Type.clone(object);
  };
