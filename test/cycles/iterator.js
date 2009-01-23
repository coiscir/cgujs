var iterArr = ['foo', 'bar'];
var iterObj = {foo:'bar', red:'foo'};

cycles.Iterator = {
  notes: [
  ],
  tests: [
    {
      title: 'keys',
      cases: [
        [
          'array', '0, 1', function(){ return CGU.keys(iterArr).join(', '); }
        ], [
          'object', 'foo, red', function(){ return CGU.keys(iterObj).join(', '); }
        ]
      ]
    }, {
      title: 'iterator',
      cases: [
        [
          'keys', 'foo, red', function(){ var ks = []; CGU.iterate(iterObj, function (v, k, t) { ks.push(k); }); return ks.join(', '); }
        ], [
          'values', 'bar, foo', function(){ var vs = []; CGU.iterate(iterObj, function (v, k, t) { vs.push(v); }); return vs.join(', '); }
        ], [
          'type (interrupt)', 'object', function(){ return CGU.iterate(iterObj, function (v, k, t) { return t; }); }
        ]
      ]
    }, {
      title: 'map',
      cases: [
        [
          'string array', '0, 1', function(){ return CGU.map(iterArr, function (v, k) { return k; }).join(', '); }
        ], [
          'number array', '1, 2, 4, 8, 16, 32', function(){ return CGU.map([0, 1, 2, 3, 4, 5], function (v) { return Math.pow(2, v); }).join(', '); }
        ], [
          'object', '{foo: "foo", red: "red"}', function(){ return CGU.toJSON(CGU.map(iterObj, function (v, k) { return k; }), false); }
        ]
      ]
    }, {
      title: 'reject',
      cases: [
        [
          'string array', '["foo"]', function(){ return CGU.toJSON(CGU.reject(iterArr, function (v) { return v === 'bar'; }), false); }
        ], [
          'number array', '1, 3, 5', function(){ return CGU.reject([0, 1, 2, 3, 4, 5], function (v) { return (v % 2) == 0; }).join(', '); }
        ], [
          'object', '{red: "foo"}', function(){ return CGU.toJSON(CGU.reject(iterObj, function (v) { return v === 'bar'; }), false); }
        ]
      ]
    }, {
      title: 'trials',
      cases: [
        [
          'Ajax Object', false, function(){ return CGU.is_a(CGU.trials(
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); },
            function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
            function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
          ), undefined); }
        ], [
          'fail case', undefined, function(){ return CGU.trials(
            function () { return new NilFooBar(); },
            function () { return new FooBarRed(); }
          ); }
        ]
      ]
    }
  ]
};
