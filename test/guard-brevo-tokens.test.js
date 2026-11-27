'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['xkeysib-' + 'a1b2'.repeat(16) + '-' + 'Ab3x'.repeat(4)];

test('guard: redact fully formed Brevo API key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Brevo API key removed] done');
    assert.deepEqual(result.secrets, ['Brevo API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject truncated Brevo API key values and adjacent identifiers', () => {
  for (const token of tokens) {
    for (const value of [token.slice(0, -1), 'prefix_' + token, token + '_suffix']) {
      assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
    }
  }
});
