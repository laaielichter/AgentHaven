'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "pnu_Ab3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3c"
];
const nearMisses = [
  "pnu_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAA",
  "pnu_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAA",
  "_pnu_Ab3cAb3" + "cAb3cAb3cAb3" + "cAb3cAb3cAb3" + "cAb3c",
  "pnu_Ab3cAb3c" + "Ab3cAb3cAb3c" + "Ab3cAb3cAb3c" + "Ab3c_",
  "pnv_AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAA"
];

test('guard: redact complete Prefect Cloud API key values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Prefect Cloud API key removed]'));
      assert.deepEqual(result.secrets, ['Prefect Cloud API key']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Prefect Cloud API key lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
