'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['sk.eyJ' + 'Ab3x'.repeat(8) + '.' + 'aB3_'.repeat(11)];
const invalid = ["pk.eyJAb3xAb3xAb3xAb3xAb3xAb3xAb3xAb3x.aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_","sk.eyJAb3xAb3xAb3x.aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_aB3_"];

test('guard: redact complete Mapbox secret token values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' end');
    assert.equal(result.text, 'credential [Mapbox secret token removed] end');
    assert.deepEqual(result.secrets, ['Mapbox secret token']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject malformed Mapbox secret token values or prefixed identifiers', () => {
  for (const value of [...invalid, ...tokens.map(t => 'prefix_' + t)]) {
    assert.deepEqual(inspect(value).secrets, [], value.slice(0, 35));
  }
});
