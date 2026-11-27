'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['waka_a1b2c3d4-1111-2222-3333-0123456789ab'];

test('guard: redact complete WakaTime API key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' done');
    assert.equal(result.text, 'credential [WakaTime API key removed] done');
    assert.deepEqual(result.secrets, ['WakaTime API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject partial WakaTime API key values and false prefixes', () => {
  for (const token of tokens) {
    const nearMisses = [token.slice(0, -1), 'prefix_' + token, token + '_suffix'];
    for (const value of nearMisses) assert.deepEqual(inspect(value).secrets, [], value.slice(0, 32));
  }
});
