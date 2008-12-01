var locationSerial = CGU.param({
  "test": ["-1058.56e+2"],
  "demo": ["+!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~"],
  "foo": ["b", "a", "r", "'", "d"],
  " ": ["space"],
  "n/a": [""],
  "true": ["undefined"],
  "num": ["-24"],
  "date": ["1/1/2008"]
});
var locationSearch = '?' + locationSerial;

cycles.Query = {
  notes: [
  ],
  tests: [
    {
      title: 'location',
      cases: [
        [
          'clone current', CGU.toJSON(location), function(){ return CGU.toJSON(CGU.location(null)); }
        ]
      ]
    }, {
      title: 'query serial',
      cases: [
        [
          'missing lead "?"', undefined, function(){ return CGU.query('test', locationSerial); }
        ]
      ]
    }, {
      title: 'query',
      cases: [
        [
          'test', "-1058.56e+2", function(){ return CGU.query('test', locationSearch).join(','); }
        ], [
          'demo', "+!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~", function(){ return CGU.query('demo', locationSearch).join(','); }
        ], [
          'foo', "b,a,r,',d", function(){ return CGU.query('foo', locationSearch).join(','); }
        ], [
          '" "', "space", function(){ return CGU.query(' ', locationSearch).join(','); }
        ], [
          'n/a', "", function(){ return CGU.query('n/a', locationSearch).join(','); }
        ], [
          'true', "undefined", function(){ return CGU.query('true', locationSearch).join(','); }
        ], [
          'num', "-24", function(){ return CGU.query('num', locationSearch).join(','); }
        ], [
          'date', "1/1/2008", function(){ return CGU.query('date', locationSearch).join(','); }
        ]
      ]
    }, {
      title: 'param',
      cases: [
        [
          'flat', 'foo=bar&red=blah', function(){ return CGU.param({foo: 'bar', red: 'blah'}); }
        ], [
          'flatten', 'foo=bar&red=blah', function(){ return CGU.param({nil: {foo: 'bar'}, red: 'blah'}); }
        ], [
          'exlusion', '', function(){ return CGU.param({foo: function(){}, bar: /pattern/}); }
        ], [
          'dates', 'foo=2008-12-31T23%3A59%3A59.999Z', function(){ return CGU.param({foo: new Date(CGU.utc(2008, 11, 31, 23, 59, 59, 999))}); }
        ]
      ]
    }, {
      title: 'serialize',
      cases: [
        [
          'form', 'text=&checkbox=foo&checkbox=bar&radio=foo&select-s=foo&select-m=foo&select-m=bar&textarea=', function(){ return CGU.serialize(document.getElementById('serialize')); }
        ], [
          'form.elements', 'text=&checkbox=foo&checkbox=bar&radio=foo&select-s=foo&select-m=foo&select-m=bar&textarea=', function(){ return CGU.serialize(document.getElementById('serialize').elements); }
        ]
      ]
    }
  ]
};

document.writeln('\
<div style="display: none;">\
  <form id="serialize" action="" method="get">\
    <input type="text" name="text" value="">\
    \
    <input type="checkbox" name="checkbox" value="foo" checked>\
    <input type="checkbox" name="checkbox" value="bar" checked>\
    <input type="checkbox" name="checkbox" value="red">\
    \
    <input type="radio" name="radio" value="foo" checked>\
    <input type="radio" name="radio" value="bar">\
    <input type="radio" name="radio" value="red">\
    \
    <select name="select-s">\
      <option value="foo" selected>foo</option>\
      <option value="bar">bar</option>\
      <option value="red">red</option>\
    </select>\
    <select name="select-m" multiple>\
      <option value="foo" selected>foo</option>\
      <option value="bar" selected>bar</option>\
      <option value="red">red</option>\
    </select>\
    \
    <textarea name="textarea"></textarea>\
    \
    <input type="button" value="Press">\
    \
    <input type="submit" value="Go">\
  </form>\
</div>\
');
