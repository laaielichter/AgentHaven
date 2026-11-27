'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "sntryu_a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2"
];
const nearMisses = [
  "sntryu_aaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaa",
  "sntryu_aaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa" + "aaaaaaaaaaaa",
  "_sntryu_a1b2" + "a1b2a1b2a1b2" + "a1b2a1b2a1b2" + "a1b2a1b2a1b2" + "a1b2a1b2a1b2" + "a1b2a1b2a1b2",
  "sntryu_a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2a" + "1b2a1b2a1b2_",
  "sntryu_AAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAA"
];

test('guard: redact complete Sentry user token values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Sentry user token removed]'));
      assert.deepEqual(result.secrets, ['Sentry user token']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Sentry user token lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
