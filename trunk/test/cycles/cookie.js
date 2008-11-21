cycles.Cookie = [
  {
    title: 'Empty',
    cases: [
      [
        'no arguments given', undefined, function(){ return CGU.cookie(); }
      ]
    ]
  }, {
    title: 'Write',
    cases: [
      [
        'foo=bar with duration=2', true, function(){ return CGU.cookie('foo', 'bar', {duration: 2}); }
      ], [
        '+++=spc with duration=-1', null, function(){ return CGU.cookie('   ', 'spc', {duration: -1}); }
      ]
    ]
  }, {
    title: 'Read',
    cases: [
      [
        'foo', 'bar', function(){ return CGU.cookie('foo'); }
      ], [
        '+++', null, function(){ return CGU.cookie('   '); }
      ]
    ]
  }, {
    title: 'Expire',
    cases: [
      [
        'foo', true, function(){ return CGU.cookie('foo', null, {expire: true}); }
      ], [
        '+++', null, function(){ return CGU.cookie('   ', null, {expire: true}); }
      ]
    ]
  }, {
    title: 'Re-Read',
    cases: [
      [
        'foo', null, function(){ return CGU.cookie('foo'); }
      ], [
        '+++', null, function(){ return CGU.cookie('   '); }
      ]
    ]
  }
];
