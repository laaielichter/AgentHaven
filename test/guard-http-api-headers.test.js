'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: mask complete short HTTP API credential headers', () => {
  for (const [raw, expected] of [
    ['X-API-Key: abc', 'X-API-Key: [API credential removed]'],
    ['x-auth-token: t', 'x-auth-token: [API credential removed]'],
    ['X-Auth-Token: Ab3xAb3x', 'X-Auth-Token: [API credential removed]'],
  ]) {
    const result = inspect(raw);
    assert.equal(result.text, expected);
    assert.deepEqual(result.secrets, ['HTTP API credential']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: leave empty header values and ordinary prose alone', () => {
  for (const input of ['X-API-Key:', 'X-Auth-Token: ', 'Set X-API-Key in request headers']) {
    assert.equal(inspect(input).text, input);
    assert.deepEqual(inspect(input).secrets, []);
  }
});
