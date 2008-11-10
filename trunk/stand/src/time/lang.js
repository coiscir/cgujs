/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Language
**/
// private
  var defaultLanguage = 'en';
  
  var $lang = defaultLanguage; // language used
  var _lang = {                // language list // a=abbreviated, f=full
    $$ : { // language non-specific
    },
    
    en : {
      month_abbr : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      month_full : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      week_abbr  : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      week_full  : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      meridiem   : ['AM', 'PM', 'am', 'pm'],
      ordinal    : ['th', 'st', 'nd', 'rd']
    }
  };
  
// public
  this.lang = function () {
    return Type.clone($lang) || '';
  };
  
  this.langList = function () {
    var langs = [];
    for (var l in _lang)
      if (_lang.propertyIsEnumerable(l))
        if ((/[a-z]{2}/).test(l))
          langs.push(l);
    return langs.sort();
  };
  
  this.langSet = function (lang) {
    if (!_lang[lang]) return false;
    if (!(/[a-z]{2}/).test(lang)) return false;
    $lang = lang;
    return true;
  };
  
  this.langReset = function () {
    return this.langSet(defaultLanguage);
  };
  
  this.langDetect = function () {
    return (
      navigator.language ||
      navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage ||
      document.getElementById('html')[0].lang
    ).substr(0, 2);
  };
  
  this.langSetDetect = function () {
    return this.langSet(this.langDetect());
  };
