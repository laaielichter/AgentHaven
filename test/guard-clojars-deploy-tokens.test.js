'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = 'Clojars deploy token';
const valid = 'CLOJARS_' + 'a'.repeat(60); // Synthetic, generated at test runtime.

test('redacts complete Clojars deployment credentials', () => {
  const result = inspect('before ' + valid + ' after');
  assert.equal(result.text, 'before [Clojars deploy token removed] after');
  assert.deepEqual(result.secrets, [kind]);
  assert.deepEqual(inspect(result.text).secrets, []);
});

test('rejects truncated, non-hex, and embedded Clojars-like text', () => {
  for (const value of [
    'CLOJARS_' + 'a'.repeat(59),
    'CLOJARS_' + 'G'.repeat(60),
    valid + 'a',
    valid + '.suffix',
    'x' + valid,
  ]) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
