'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const tokens = ['pcsk_' + 'Ab12xY' + '_' + 'Ab3'.repeat(21), 'pcsk_' + 'Ab12x' + '_' + 'Ab3'.repeat(21)];
const invalid = ["pcsk_Ab12_Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3","pcsk_Ab12xY_Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3Ab3"];

test('guard: redact complete Pinecone API key values', () => {
  for (const token of tokens) {
    const result = inspect('credential ' + token + ' end');
    assert.equal(result.text, 'credential [Pinecone API key removed] end');
    assert.deepEqual(result.secrets, ['Pinecone API key']);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('guard: reject malformed Pinecone API key values or prefixed identifiers', () => {
  for (const value of [...invalid, ...tokens.map(t => 'prefix_' + t)]) {
    assert.deepEqual(inspect(value).secrets, [], value.slice(0, 35));
  }
});
