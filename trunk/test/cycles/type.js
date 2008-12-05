cycles.Type = {
  notes: [
    'types: ' + CGU.toJSON(CGU.types())
  ],
  tests: [
    {
      title: 'type',
      cases: [
        [
          'undefined', 'undefined', function(){ return CGU.type(undefined); }
        ], [
          'null', 'null', function(){ return CGU.type(null); }
        ], [
          'Array', 'array', function(){ return CGU.type([]); }
        ], [
          'Boolean', 'boolean', function(){ return CGU.type(true); }
        ], [
          'Date', 'date', function(){ return CGU.type(new Date()); }
        ], [
          'Error - Error', 'error', function(){ return CGU.type(new Error()); }
        ], [
          'Error - TypeError', 'error', function(){ return CGU.type(new TypeError()); }
        ], [
          'Error - SyntaxError', 'error', function(){ return CGU.type(new SyntaxError()); }
        ], [
          'Function', 'function', function(){ return CGU.type(function(){}); }
        ], [
          'Number', 'number', function(){ return CGU.type(0); }
        ], [
          'Object', 'object', function(){ return CGU.type({}); }
        ], [
          'RegExp', 'regexp', function(){ return CGU.type(/./); }
        ], [
          'String', 'string', function(){ return CGU.type(''); }
        ]
      ]
    }, {
      title: 'clone',
      cases: [
        [
          'undefined', undefined, function(){ return CGU.clone(undefined); }
        ], [
          'null', null, function(){ return CGU.clone(null); }
        ], [
          'Boolean', true, function(){ return CGU.clone(true); }
        ], [
          'Number', 24.42, function(){ return CGU.clone(24.42); }
        ], [
          'String', 'abc', function(){ return CGU.clone('abc'); }
        ]
      ]
    }, {
      title: 'is_a',
      cases: [
        [
          'undefined type', true, function(){ return CGU.is_a(undefined, 'undefined'); }
        ], [
          'undefined primitive', true, function(){ return CGU.is_a(undefined, undefined); }
        ], [
          'null type', true, function(){ return CGU.is_a(null, 'null'); }
        ], [
          'null primitive', true, function(){ return CGU.is_a(null, null); }
        ], [
          'Boolean primitive vs. class', true, function(){ return CGU.is_a(true, Boolean); }
        ], /*[
          'Boolean primitive vs. type', true, function(){ return CGU.is_a(true, 'boolean'); }
        ], [
          'Boolean object vs. type', true, function(){ return CGU.is_a(new Boolean(), 'boolean'); }
        ], [
          'Number primitive vs. class', true, function(){ return CGU.is_a(0, Number); }
        ],*/ [
          'Number primitive vs. type', true, function(){ return CGU.is_a(0, 'number'); }
        ], /*[
          'Number object vs. type', true, function(){ return CGU.is_a(new Number(), 'number'); }
        ], [
          'String primitive vs. class', true, function(){ return CGU.is_a('', String); }
        ], [
          'String primitive vs. type', true, function(){ return CGU.is_a('', 'string'); }
        ],*/ [
          'String object vs. type', true, function(){ return CGU.is_a(new String(), 'string'); }
        ]
      ]
    }, {
      title: 'isof',
      cases: [
        [
          'null is "nil"', true, function(){ return CGU.isof(null, null, undefined); }
        ], [
          'Array of Array, String', true, function(){ return CGU.isof([], Array, String); }
        ], [
          'Array of Date, Number', false, function(){ return CGU.isof([], Date, Number); }
        ], [
          'Number of Array, String', false, function(){ return CGU.isof(24, Array, String); }
        ], [
          'Number of Date, Number', true, function(){ return CGU.isof(24, Date, Number); }
        ], [
          'String of Array, String', true, function(){ return CGU.isof('', Array, String); }
        ], [
          'String of Date, Number', false, function(){ return CGU.isof('', Date, Number); }
        ]
      ]
    }, {
      title: 'limit',
      cases: [
        [
          'null to "nil" is null', null, function(){ return CGU.limit(null, null, undefined); }
        ], [
          'Number to Array, String is undefined', undefined, function(){ return CGU.limit(24, Array, String); }
        ], [
          'Number to Date, Number is Number', 24, function(){ return CGU.limit(24, Date, Number); }
        ], [
          'String to Array, String is String', '', function(){ return CGU.limit('', Array, String); }
        ], [
          'String to Date, Number is undefined', undefined, function(){ return CGU.limit('', Date, Number); }
        ]
      ]
    }
  ]
};
