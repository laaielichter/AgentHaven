'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = 'Dynatrace API token';
const make = (type = 'dt0c01') => `${type}.${'A'.repeat(24)}.${'B'.repeat(64)}`;

test('redacts complete Dynatrace API, service and platform tokens', () => {
  for (const type of ['dt0c01', 'dt0s01', 'dt0s16']) {
    const value = make(type);
    const result = inspect(`credential ${value} end`);
    assert.equal(result.text, 'credential [Dynatrace API token removed] end');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('does not match malformed or embedded Dynatrace-like text', () => {
  const value = make();
  for (const input of [
    value + '_', 'X' + value, value + '.suffix',
    'dt0c01.' + 'A'.repeat(23) + '.' + 'B'.repeat(64),
    'dt0c01.' + 'A'.repeat(24) + '.' + 'B'.repeat(63),
    'dt0c01.' + 'A'.repeat(24) + '.' + 'B'.repeat(65),
    'dt0c01.' + 'a'.repeat(24) + '.' + 'B'.repeat(64),
  ]) {
    const result = inspect(input);
    assert.equal(result.text, input);
    assert.equal(result.secrets.includes(kind), false);
  }
});
