/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *    http://code.google.com/p/cgujs/
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU is released under the MIT License.
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var CGU = new (function () {
  this.Version = '<%= serial %>';
  
  var CGUS = {};
  
  this.extern = function (name) {
    if (!CGUS.propertyIsEnumerable(name)) return null;
    return CGUS[name];
  };
  
  this.create = function (name) {
    if (!CGUS.propertyIsEnumerable(name)) return null;
    return !!eval(name + ' = CGU.extern(' + CGUS.JSON.to(String(name)) + ')');
  };
  
  this.createAll = function () {
    for (var util in CGUS)
      if (this.create(util) === false)
        return false;
    return true;
  };
  
  this.list = function () {
    var utils = [];
    for (var util in CGUS)
      if (CGUS.propertyIsEnumerable(util))
        utils.push(util);
    return utils;
  };

<%= inc 'shared.js' %>

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Utilities
**/
(function(){ // avoid `create` interference
<%= inc 2, true, INCS.keys.sort.map{|i| INCS[i]} %>
})();

})();
