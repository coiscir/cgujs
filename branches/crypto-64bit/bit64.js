/*********
 * OPER
**/
NEW = function (x) {
  return [x[0] & 0xffffffff, x[1] & 0xffffffff];
};

LT = function (a, b) {
  var c, d;
  for (var i = 0; i < 32; i += 1) {
    c = (a >> (31 - i)) & 0x1;
    d = (b >> (31 - i)) & 0x1;
    if (c == d) continue;
    if (c < d) return true;
    if (c > d) return false;
  }
  return false;
};

ADD = function (x, y) {
  var b = x[1] + y[1];
  var a = x[0] + y[0] + (LT(b, x[1]) ? 0x1 : 0x0);
  return NEW([a, b]);
};

AND = function (x, y) {
  return NEW([x[0] & y[0], x[1] & y[1]]);
};

OR = function (x, y) {
  return NEW([x[0] | y[0], x[1] | y[1]]);
};

XOR = function (x, y) {
  return NEW([x[0] ^ y[0], x[1] ^ y[1]]);
};

NOT = function (x) {
  return NEW([~x[0], ~x[1]]);
  var a = ~x[0];
  var b = ~x[1];
  return NEW([a, b]);
};

/*********
 * CONV
**/
SHL = function (x, n) {
  var a = x[0];
  var b = x[1];
  var c = n >= 32 ? (b << (n - 32)) :
          n == 0 ? a : ((a << n) | (b >>> (32 - n)));
  var d = n >= 32 ? 0x00000000 : (b << n);
  return NEW([c, d]);
};

SHR = function (x, n) {
  var a = x[0], b = x[1];
  var c = n >= 32 ? 0x00000000 : (a >>> n);
  var d = n >= 32 ? (a >>> (n - 32)) :
          n == 0 ? b : ((a << (32 - n)) | (b >>> n));
  return NEW([c, d]);
};

ROTL = function (x, n) {
  return OR(SHR(x, (64 - n)), SHL(x, n));
};

ROTR = function (x, n) {
  return OR(SHR(x, n), SHL(x, (64 - n)));
};

/*********
 * FIFO
**/
DEC = function (input) {
  var i, j, output = [];
  for (i = 0, j = 0; j < input.length; i += 1, j = (i * 8)) {
    output[i] = [
      ((input[j + 0] & 0xff) << 24) |
      ((input[j + 1] & 0xff) << 16) |
      ((input[j + 2] & 0xff) << 8 ) |
      ((input[j + 3] & 0xff) << 0 ),
      ((input[j + 4] & 0xff) << 24) |
      ((input[j + 5] & 0xff) << 16) |
      ((input[j + 6] & 0xff) << 8 ) |
      ((input[j + 7] & 0xff) << 0 )
    ];
  }
  return output;
};

ENC = function (input) {
  var i, output = [];
  for (i = 0; i < input.length; i += 1) {
    output.push((input[i][0] >> 24) & 0xff);
    output.push((input[i][0] >> 16) & 0xff);
    output.push((input[i][0] >> 8 ) & 0xff);
    output.push((input[i][0] >> 0 ) & 0xff);
    output.push((input[i][1] >> 24) & 0xff);
    output.push((input[i][1] >> 16) & 0xff);
    output.push((input[i][1] >> 8 ) & 0xff);
    output.push((input[i][1] >> 0 ) & 0xff);
  }
  return output;
};