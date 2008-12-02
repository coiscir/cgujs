encode_hex = function (input) {
  var hx = ('0123456789abcdef').split('');
  var output = '', i;
  for (i = 0; i < input.length; i += 1) {
    output += hx[(input[i] >> 4) & 0xf] || '?';
    output += hx[(input[i] >> 0) & 0xf] || '?';
  }
  return output.
    replace(/([0-9a-f]{128}(?!$))/g, '$1\n').
    replace(/([0-9a-f]{16}(?!$))/gm, '$1 ').
    replace(/([0-9a-f]{8})([0-9a-f]{8})/gm, '$1-$2');
};

encode_base16 = function (input) {
  var hx = ('0123456789ABCDEF').split('');
  var output = '', i;
  for (i = 0; i < input.length; i += 1) {
    output += hx[(input[i] >> 4) & 0xf] || '?';
    output += hx[(input[i] >> 0) & 0xf] || '?';
  }
  return output;
};

encode_raw = function (string) {
  var seq = [], i;
  if (string.match(/[^\x00-\xff]/)) return null;
  for (i = 0; i < string.length; i += 1) {
    seq.push(string.charCodeAt(i) & 0xff);
  }
  return seq;
};

encode_str = function (array) {
  var output = '', i;
  for (i = 0; i < array.length; i += 1) {
    output += String.fromCharCode(array[i] & 0xff);
  }
  return output;
};
