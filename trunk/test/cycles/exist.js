cycles['Version: ' + (CGU || {}).Version || ''] = [
  {
    title: 'Exists',
    cases: [
      [
        'CGU', true, function(){ return !!CGU; }
      ]
    ]
  }
];
