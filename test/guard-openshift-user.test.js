'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "sha256~Ab3qA" + "b3qAb3qAb3qA" + "b3qAb3qAb3qA" + "b3qAb3qAb3qA" + "b3"
];
const nearMisses = [
  "sha256~AAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "A",
  "sha256~AAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAA",
  "_sha256~Ab3q" + "Ab3qAb3qAb3q" + "Ab3qAb3qAb3q" + "Ab3qAb3qAb3q" + "Ab3",
  "sha256~Ab3qA" + "b3qAb3qAb3qA" + "b3qAb3qAb3qA" + "b3qAb3qAb3qA" + "b3_",
  "sha257~AAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAAA" + "AA"
];

test('guard: redact complete OpenShift user token values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[OpenShift user token removed]'));
      assert.deepEqual(result.secrets, ['OpenShift user token']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded OpenShift user token lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
