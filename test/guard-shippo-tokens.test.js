'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['shippo_live_' + 'a1b2'.repeat(10), 'shippo_test_' + 'a1b2'.repeat(10)];

test('guard: redact complete Shippo API token values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Shippo API token removed] done');
    assert.deepEqual(result.secrets, ['Shippo API token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject partial Shippo API token values and false prefixes', () => {
  for (const token of tokens) {
    const nearMisses = [token.slice(0, -1), 'prefix_' + token, token + '_suffix'];
    for (const value of nearMisses) assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
  }
});
