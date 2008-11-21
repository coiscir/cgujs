cycles.Time = [
  {
    title: 'utc',
    cases: [
      [
        '0000-01-01T00:00:00Z', -62167219200000, function(){ return CGU.utc(0, 0, 1, 0, 0, 0, 0); }
      ], [
        '9999-12-31T23:59:59Z', 253402300799999, function(){ return CGU.utc(9999, 11, 31, 23, 59, 59, 999); }
      ]
    ]
  }, {
    title: 'php',
    cases: [
      [
        'local 0000-01-01T00:00:00', '0000-01-01T00:00:00', function(){ return CGU.phpdate('Y-m-d\\TH:i:s', CGU.local(0, 0, 1, 0, 0, 0, 0)); }
      ], [
        'local 9999-12-31T23:59:59', '9999-12-31T23:59:59', function(){ return CGU.phpdate('Y-m-d\\TH:i:s', CGU.local(9999, 11, 31, 23, 59, 59, 999)); }
      ], [
        'utc 0000-01-01T00:00:00', '0000-01-01T00:00:00', function(){ return CGU.phputc('Y-m-d\\TH:i:s', CGU.utc(0, 0, 1, 0, 0, 0, 0)); }
      ], [
        'utc 9999-12-31T23:59:59', '9999-12-31T23:59:59', function(){ return CGU.phputc('Y-m-d\\TH:i:s', CGU.utc(9999, 11, 31, 23, 59, 59, 999)); }
      ], [
        'utc c', '2008-12-31T12:30:59+00:00', function(){ return CGU.phputc('c', CGU.utc(2008, 11, 31, 12, 30, 59, 000)); }
      ], [
        'utc r', 'Wed, 31 Dec 2008 12:30:59 +0000', function(){ return CGU.phputc('r', CGU.utc(2008, 11, 31, 12, 30, 59, 000)); }
      ]
    ]
  }, {
    title: 'posix',
    cases: [
      [
        'local 0000-01-01T00:00:00', '0000-01-01T00:00:00', function(){ return CGU.strftime('%FT%T', CGU.local(0, 0, 1, 0, 0, 0, 0)); }
      ], [
        'local 9999-12-31T23:59:59', '9999-12-31T23:59:59', function(){ return CGU.strftime('%FT%T', CGU.local(9999, 11, 31, 23, 59, 59, 999)); }
      ], [
        'utc 0000-01-01T00:00:00', '0000-01-01T00:00:00', function(){ return CGU.strfutc('%FT%T', CGU.utc(0, 0, 1, 0, 0, 0, 0)); }
      ], [
        'utc 9999-12-31T23:59:59', '9999-12-31T23:59:59', function(){ return CGU.strfutc('%FT%T', CGU.utc(9999, 11, 31, 23, 59, 59, 999)); }
      ], [
        'utc %c', 'Wed, 31 Dec 2008 12:30:59 GMT', function(){ return CGU.strfutc('%c', CGU.utc(2008, 11, 31, 12, 30, 59, 000)); }
      ], [
        'utc %x', '2008-12-31', function(){ return CGU.strfutc('%x', CGU.utc(2008, 11, 31, 12, 30, 59, 000)); }
      ], [
        'utc %X', '12:30:59', function(){ return CGU.strfutc('%X', CGU.utc(2008, 11, 31, 12, 30, 59, 000)); }
      ]
    ]
  }
];
