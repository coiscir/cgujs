/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU and CGU-Stand are released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var CGU = new (function () {
  this.Version = '<%= serial %>';
  
  var CGUS = {};
  
  this.create = function (name) {
    if (!CGUS.propertyIsEnumerable(name)) return null;
    return !!(window[name] = CGUS[name]);
  };
  
  this.createAll = function () {
    for (var prop in CGUS)
      if (this.create(prop) === false)
        return false;
    return true;
  };
  
<%= req INCS.keys.sort %>

})();
