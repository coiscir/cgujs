/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Shared
**/
  this.abs = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date(0);
    date.setFullYear(0, 0, 1);
    date.setHours(0, 0, 0, 0);
    
    if (Number(yr)) date.setFullYear(yr);
    if (Number(mn)) date.setMonth(mn);
    if (Number(dy)) date.setDate(dy);
    if (Number(hr)) date.setHours(hr);
    if (Number(mi)) date.setMinutes(mi);
    if (Number(sc)) date.setSeconds(sc);
    if (Number(ms)) date.setMilliseconds(ms);
    
    return date.getTime();
  };

  this.utc = function (yr, mn, dy, hr, mi, sc, ms) {
    var date = new Date(0);
    date.setUTCFullYear(0, 0, 1);
    date.setUTCHours(0, 0, 0, 0);
    
    if (Number(yr)) date.setUTCFullYear(yr);
    if (Number(mn)) date.setUTCMonth(mn);
    if (Number(dy)) date.setUTCDate(dy);
    if (Number(hr)) date.setUTCHours(hr);
    if (Number(mi)) date.setUTCMinutes(mi);
    if (Number(sc)) date.setUTCSeconds(sc);
    if (Number(ms)) date.setUTCMilliseconds(ms);
    
    return date.getTime();
  };