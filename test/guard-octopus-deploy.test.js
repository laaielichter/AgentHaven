'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "API-AB12AB12" + "AB12AB12AB12" + "AB12AB"
];
const nearMisses = [
  "API-AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAA",
  "API-AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAA",
  "_API-AB12AB1" + "2AB12AB12AB1" + "2AB12AB",
  "API-AB12AB12" + "AB12AB12AB12" + "AB12AB_",
  "api-AAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAA",
  "API-Ab12Ab12" + "Ab12Ab12Ab12" + "Ab12Ab"
];

test('guard: redact complete Octopus Deploy API key values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Octopus Deploy API key removed]'));
      assert.deepEqual(result.secrets, ['Octopus Deploy API key']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Octopus Deploy API key lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
