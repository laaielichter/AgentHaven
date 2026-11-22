'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('one- and two-character URI passwords never reach shared memory', () => {
  for (const scheme of ['postgresql', 'mysql', 'redis', 'https', 'amqps']) {
    for (const password of ['x', 'yz']) {
      const uri = scheme + '://worker:' + password + '@host.example.invalid/data';
      const input = 'Connect using ' + uri;
      const result = inspect(input);
      assert.deepEqual(result.secrets, ['connection string password'], input);
      assert.equal(result.text, 'Connect using ' + scheme +
        '://worker:[secret removed]@host.example.invalid/data');
      assert.deepEqual(inspect(result.text).secrets, [], 'redaction must be idempotent');
    }
  }
});

test('the URI credential rule leaves non-credential URLs unchanged', () => {
  for (const uri of [
    'https://host.example.invalid/path',
    'postgresql://worker@host.example.invalid/db',
    'redis://worker:@host.example.invalid/0'
  ]) {
    const result = inspect(uri);
    assert.deepEqual(result.secrets, [], uri);
    assert.equal(result.text, uri);
  }
});
