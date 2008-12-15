var iterArr = ['foo', 'bar'];
var iterObj = {foo:'bar', red:'blah'};

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
          'values', 'bar, blah', function(){ var vs = []; CGU.iterate(iterObj, function (v, k, t) { vs.push(v); }); return vs.join(', '); }
        ], [
          'type', 'object', function(){ var ty; CGU.iterate(iterObj, function (v, k, t) { ty = t; return null; }); return ty; }
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
          'object', '{foo: "foo", red: "red"}', function(){ return CGU.toJSON(CGU.map(CGU.clone(iterObj), function (v, k) { return k; })); }
        ]
      ]
    }
  ]
};
