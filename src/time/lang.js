/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU :: Time :: Language
**/
// private
  var $$lang = 'en'; // default language
  
  var $lang = $$lang; // language used
  var _lang = {};     // language list // a=abbreviated, f=full

<%= inc 2, true, 'lang/[a-z][a-z].js' %>
  
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
    return this.langSet($$lang);
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
