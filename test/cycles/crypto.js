var kx0b16 = '\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b';
var kx0b20 = '\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b';
var kx00FF = '\x00\x11\x22\x33\x44\x55\x66\x77\x88\x99\xaa\xbb\xcc\xdd\xee\xff';
var kx0067 = '\x00\x11\x22\x33\x44\x55\x66\x77\x88\x99\xaa\xbb\xcc\xdd\xee\xff\x01\x23\x45\x67';

cycles.Crypto = {
  notes: [
    'Hashes: ' + CGU.toJSON(CGU.hashes()),
    'HMAC:   ' + CGU.toJSON(CGU.hashes(false)),
    'Keyed:  ' + CGU.toJSON(CGU.hashes(true))
  ],
  tests: [
    {
      title: 'hash',
      cases: [
        [
          'MD4', 'a448017aaf21d8525fc10ae87aa6729d', function(){ return CGU.hash('md4', 'abc').hex(); }
        ], [
          'MD5', '900150983cd24fb0d6963f7d28e17f72', function(){ return CGU.hash('md5', 'abc').hex(); }
        ], [
          'SHA-1', 'A9993E364706816ABA3E25717850C26C9CD0D89D', function(){ return CGU.hash('sha1', 'abc').base16(); }
        ], [
          'SHA-224', '23097D223405D8228642A477BDA255B32AADBCE4BDA0B3F7E36C9DA7', function(){ return CGU.hash('sha224', 'abc').base16(); }
        ], [
          'SHA-256', 'BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD', function(){ return CGU.hash('sha256', 'abc').base16(); }
        ], [
          'SHA-384', 'CB00753F45A35E8BB5A03D699AC65007272C32AB0EDED1631A8B605A43FF5BED8086072BA1E7CC2358BAECA134C825A7', function(){ return CGU.hash('sha384', 'abc').base16(); }
        ], [
          'SHA-512', 'DDAF35A193617ABACC417349AE20413112E6FA4E89A97EA20A9EEEE64B55D39A2192992A274FC1A836BA3C23A3FEEBBD454D4423643CE80E2A9AC94FA54CA49F', function(){ return CGU.hash('sha512', 'abc').base16(); }
        ], [
          'RIPEMD-128', 'c14a12199c66e4ba84636b0f69144c77', function(){ return CGU.hash('ripemd128', 'abc').hex(); }
        ], [
          'RIPEMD-160', '8eb208f7e05d987a9b044a8e98c6b087f15a0bfc', function(){ return CGU.hash('ripemd160', 'abc').hex(); }
        ]
      ]
    }, {
      title: 'HMAC hash',
      cases: [
        [
          'MD5', '9294727a3638bb1c13f48ef8158bfc9d', function(){ return CGU.hash('md5', 'Hi There', kx0b16).hex(); }
        ], [
          'SHA-1', 'b617318655057264e28bc0b6fb378c8ef146be00', function(){ return CGU.hash('sha1', 'Hi There', kx0b20).hex(); }
        ], [
          'SHA-224', '896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22', function(){ return CGU.hash('sha224', 'Hi There', kx0b20).hex(); }
        ], [
          'SHA-256', 'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7', function(){ return CGU.hash('sha256', 'Hi There', kx0b20).hex(); }
        ], [
          'SHA-384', 'afd03944d84895626b0825f4ab46907f15f9dadbe4101ec682aa034c7cebc59cfaea9ea9076ede7f4af152e8b2fa9cb6', function(){ return CGU.hash('sha384', 'Hi There', kx0b20).hex(); }
        ], [
          'SHA-512', '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b30545e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f1702e696c203a126854', function(){ return CGU.hash('sha512', 'Hi There', kx0b20).hex(); }
        ], [
          'RIPEMD-128', 'ad9db2c1e22af9ab5ca9dbe5a86f67dc', function(){ return CGU.hash('ripemd128', '', kx00FF).hex(); }
        ], [
          'RIPEMD-160', 'cf387677bfda8483e63b57e06c3b5ecd8b7fc055', function(){ return CGU.hash('ripemd160', '', kx0067).hex(); }
        ]
      ]
    }
  ]
};
