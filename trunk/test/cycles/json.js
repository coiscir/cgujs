cycles.JSON = {
  notes: [
  ],
  tests: [
    {
      title: 'from/to',
      cases: [
        [
          'relaxed', '{foo: "bar"}', function(){ return CGU.toJSON(CGU.fromJSON('{foo: "bar"}')); }
        ], [
          'strict', '{"foo": "bar"}', function(){ return CGU.toJSON(CGU.fromJSON('{"foo": "bar"}', true), true); }
        ]
      ]
    }, {
      title: 'exclusion',
      cases: [
        [
          'to', '["2008-12-31T23:59:59.000Z"]', function(){ return CGU.toJSON([function(){}, /pattern/, new Date(CGU.utc(2008, 12, 31, 23, 59, 59))]); }
        ]
      ]
    }
  ]
};
