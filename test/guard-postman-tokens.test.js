'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['PMAK-' + 'a1b2'.repeat(6) + '-' + 'a1'.repeat(17)];

test('guard: redact fully formed Postman API key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [Postman API key removed] done');
    assert.deepEqual(result.secrets, ['Postman API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject truncated Postman API key values and adjacent identifiers', () => {
  for (const token of tokens) {
    for (const value of [token.slice(0, -1), 'prefix_' + token, token + '_suffix']) {
      assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
    }
  }
});
