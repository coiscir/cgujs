var iterArr = ['foo', 'bar'];
var iterObj = {foo:'bar', red:'foo'};

Object.prototype.bar = 'bar';

cycles.Iterator = {
  notes: [
  ],
  tests: [
    {
      title: 'each',
      cases: [
        [
          'keys', 'foo, red', function(){ var keys = []; CGU.each(iterObj, function (v, k) { keys.push(k); }); return keys.join(', '); }
        ], [
          'values', 'bar, foo', function(){ var values = []; CGU.each(iterObj, function (v) { values.push(v); }); return values.join(', '); }
        ], [
          'interrupt', true, function(){ return CGU.each(iterObj, function (v, k, i) { return i; }); }
        ]
      ]
    }, {
      title: 'every',
      cases: [
        [
          'keys', 'foo, red, bar', function(){ var keys = []; CGU.every(iterObj, function (v, k) { keys.push(k); }); return keys.join(', '); }
        ], [
          'values', 'bar, foo, bar', function(){ var values = []; CGU.every(iterObj, function (v) { values.push(v); }); return values.join(', '); }
        ], [
          'interrupt', true, function(){ return CGU.every(iterObj, function (v, k, i) { return i; }); }
        ]
      ]
    }, {
      title: 'keys',
      cases: [
        [
          'array', '0, 1, bar', function(){ return CGU.keys(iterArr).sort().join(', '); }
        ], [
          'object', 'bar, foo, red', function(){ return CGU.keys(iterObj).sort().join(', '); }
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
          'object', '{"foo": "foo", "red": "red"}', function(){ return CGU.toJSON(CGU.map(iterObj, function (v, k) { return k; })); }
        ]
      ]
    }, {
      title: 'properties',
      cases: [
        [
          'array', '0, 1', function(){ return CGU.properties(iterArr).sort().join(', '); }
        ], [
          'object', 'foo, red', function(){ return CGU.properties(iterObj).sort().join(', '); }
        ]
      ]
    }, {
      title: 'reject',
      cases: [
        [
          'string array', 'foo', function(){ return CGU.reject(iterArr, function (v) { return v === 'bar'; }).join(', '); }
        ], [
          'number array', '1, 3, 5', function(){ return CGU.reject([0, 1, 2, 3, 4, 5], function (v) { return (v % 2) == 0; }).join(', '); }
        ], [
          'object', '{"red": "foo"}', function(){ return CGU.toJSON(CGU.reject(iterObj, function (v) { return v === 'bar'; })); }
        ]
      ]
    }
  ]
};
