'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

test('guard: redact quoted and unquoted SECRET_KEY configuration values', () => {
  const cases = [
    ['SECRET_KEY=' + 'Ab3x'.repeat(5), 'SECRET_KEY=[secret removed]'],
    ['DJANGO_SECRET_KEY="' + 'correct horse battery' + '"', 'DJANGO_SECRET_KEY="[secret removed]"'],
    ["APP_SECRET-KEY='" + 'Ab3x'.repeat(4) + "'", "APP_SECRET-KEY='[secret removed]'"],
  ];
  for (const [input, expected] of cases) {
    const result = inspect(input);
    assert.equal(result.text, expected);
    assert.deepEqual(result.secrets, ['password']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: do not redact descriptions of configuration keys', () => {
  for (const value of ['Set SECRET_KEY in production', 'DJANGO_SECRET_KEY comes from an environment variable']) {
    assert.equal(inspect(value).text, value);
    assert.deepEqual(inspect(value).secrets, []);
  }
});
