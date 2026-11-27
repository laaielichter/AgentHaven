'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['rubygems_' + 'a1b2'.repeat(12)];

test('guard: redact fully formed RubyGems API key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [RubyGems API key removed] done');
    assert.deepEqual(result.secrets, ['RubyGems API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject truncated RubyGems API key values and adjacent identifiers', () => {
  for (const token of tokens) {
    for (const value of [token.slice(0, -1), 'prefix_' + token, token + '_suffix']) {
      assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
    }
  }
});
