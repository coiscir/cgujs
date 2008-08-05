/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU: Common & General Use Javascript
 *  (c) 2008 Jonathan Lonowski
 *  
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Query
 *    Read HTTP GET Variables
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Query = new (function () {
  this.Version = '1.0.0';
  this.Release = '2008-08-04';
  this.Serials = [1.0, 8.0804];

  this.read = function (key, index) {
    key = String(key);
    index = typeof index === 'number' ? (index - (index % 1)) : null;
    var queries = ('' + location.search).replace(/^\?/, '').split(/\&/), i;
    var matches = [];
    for (i = 0; i < queries.length; i += 1)
      if (typeof queries[i] === 'string' && queries[i].match(/[^\=]+\=?/))
        if (key === decodeURIComponent(queries[i].split('=')[0]))
          matches.push(decodeURIComponent(queries[i].split('=')[1] || ''));
    if (index === null && matches.length <= 1) index = 0;
    return (index === null ? matches : (matches[index]));
  }
})();
