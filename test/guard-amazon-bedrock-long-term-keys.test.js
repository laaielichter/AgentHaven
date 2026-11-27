'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "Amazon Bedrock API key";
// Generate fake credentials at runtime instead of committing credential-shaped strings.
const positives = ['ABSK' + 'A'.repeat(109), 'ABSK' + 'A'.repeat(110) + '=='];
const negatives = ['ABSK' + 'A'.repeat(108), 'ABSK' + 'A'.repeat(270), 'ABSK' + 'A'.repeat(110) + '===', 'x' + positives[0], positives[0] + '.suffix', positives[0] + '_'];

test('redacts complete Amazon Bedrock API key values', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('rejects malformed or embedded Amazon Bedrock API key candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
