window.onload = function () {
  var body = document.getElementById('body');
  var doc = document.getElementById('docs');
  var nav = document.getElementById('nav');
  doc.style.height = nav.style.height = '' + document.getElementById('body').scrollHeight + 'px';
};
