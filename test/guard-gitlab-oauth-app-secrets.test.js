'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab OAuth app secret";
// Generate fake credentials at runtime instead of committing credential-shaped strings.
const positives = ['gloas-' + 'A'.repeat(64)];
const negatives = ['gloas-' + 'A'.repeat(63), 'gloas-' + 'A'.repeat(65), 'x' + positives[0], positives[0] + '.suffix', positives[0] + '_'];

test('redacts complete GitLab OAuth app secret values', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('rejects malformed or embedded GitLab OAuth app secret candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
