'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "HRKU-AAAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb"
];
const nearMisses = [
  "HRKU-AAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAA",
  "HRKU-AAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAA",
  "_HRKU-AAAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb",
  "HRKU-ABAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAA",
  "HRKU-AAAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb3cAb3cA" + "b3cAb_"
];

test('guard: redact complete Heroku API key v2 values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Heroku API key v2 removed]'));
      assert.deepEqual(result.secrets, ['Heroku API key v2']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Heroku API key v2 lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
