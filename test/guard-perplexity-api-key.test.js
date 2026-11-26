'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const key = 'pplx-' + 'Ab3q'.repeat(12);

test('guard: redact complete Perplexity API keys', () => {
  for (const input of [key, 'key ' + key + ' safe']) {
    const result = inspect(input);
    assert.equal(result.text, input.replace(key, '[Perplexity API key removed]'));
    assert.deepEqual(result.secrets, ['Perplexity API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: preserve incomplete and embedded Perplexity-like strings', () => {
  for (const input of [
    'pplx-' + 'A'.repeat(47),
    'pplx-' + 'A'.repeat(49),
    '_' + key,
    key + '_',
    key + '-more',
    'See the pplx-api-key configuration guide'
  ]) {
    assert.equal(inspect(input).text, input, input.slice(0, 25));
    assert.deepEqual(inspect(input).secrets, []);
  }
});
