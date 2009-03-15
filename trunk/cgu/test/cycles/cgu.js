cycles.CGU = {
  notes: [
    'Version: ' + ((CGU || {}).Version || 'N/A')
  ],
  tests: [
    {
      title: 'Exists',
      cases: [
        [
          'CGU', true, function(){ return !!CGU; }
        ]
      ]
    }
  ]
};
