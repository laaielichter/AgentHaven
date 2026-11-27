'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');
const kind = "age identity private key";
const positives = ["AGE-SECRET-KEY-1QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ"];
const negatives = ["AGE-SECRET-KEY-1QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ","AGE-SECRET-KEY-1BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB","xAGE-SECRET-KEY-1QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ","AGE-SECRET-KEY-1QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQA","AGE-SECRET-KEY-1QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ.suffix"];
test('redacts complete age identity private key values without retaining token bytes', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});
test('ignores invalid or embedded age identity private key candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
