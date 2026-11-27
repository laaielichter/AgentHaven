'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = [
  "SKa1B2a1B2a1" + "B2a1B2a1B2a1" + "B2a1B2a1B2"
];
const nearMisses = [
  "SKAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAA",
  "SKAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAAA",
  "_SKa1B2a1B2a" + "1B2a1B2a1B2a" + "1B2a1B2a1B2",
  "SKa1B2a1B2a1" + "B2a1B2a1B2a1" + "B2a1B2a1B2_",
  "SKGGGGGGGGGG" + "GGGGGGGGGGGG" + "GGGGGGGGGG",
  "skAAAAAAAAAA" + "AAAAAAAAAAAA" + "AAAAAAAAAA"
];

test('guard: redact complete Twilio API key values', () => {
  for (const token of tokens) {
    for (const input of [token, 'credential ' + token + ' done']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[Twilio API key removed]'));
      assert.deepEqual(result.secrets, ['Twilio API key']);
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('guard: preserve malformed and embedded Twilio API key lookalikes', () => {
  for (const input of nearMisses) {
    const result = inspect(input);
    assert.equal(result.text, input, input.slice(0, 32));
    assert.deepEqual(result.secrets, [], input.slice(0, 32));
  }
});
