'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['tr_prod_sk_' + 'Ab3x'.repeat(10), 'tr_stg_' + 'Ab3x'.repeat(10), 'tr_preview_sk_' + 'Ab3x'.repeat(10)];

test('guard: redact complete Trigger.dev secret key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Trigger.dev secret key removed] done');
    assert.deepEqual(result.secrets, ['Trigger.dev secret key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject partial Trigger.dev secret key values and false prefixes', () => {
  for (const token of tokens) {
    const nearMisses = ['prefix_' + token, 'tr_prod_sk_' + 'Ab3x'.repeat(4)];
    for (const value of nearMisses) assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
  }
});
