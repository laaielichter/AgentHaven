'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('masks ApiKey Authorization header values without dropping the scheme', () => {
  const value = 'Ab3_'.repeat(8);
  for (const prefix of ['Authorization: ApiKey ', 'authorization: apiKEY ', 'Proxy-Authorization: APIKEY ']) {
    const input = prefix + value;
    const result = inspect(input);
    assert.equal(result.text, prefix + '[authorization token removed]');
    assert.deepEqual(result.secrets, ['authorization token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('preserves non-credential headers and existing Bearer masking', () => {
  assert.equal(inspect('Authorization: ApiKey ').text, 'Authorization: ApiKey ');
  const value = 'abcXYZ123';
  assert.equal(inspect('Authorization: Bearer ' + value).text,
    'Authorization: Bearer [authorization token removed]');
});
