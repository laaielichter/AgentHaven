'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab SCIM token";
// Generate fake credentials at runtime instead of committing credential-shaped strings.
const positives = ['glsoat-' + 'A'.repeat(20)];
const negatives = ['glsoat-' + 'A'.repeat(19), 'glsoat-' + 'A'.repeat(21), 'x' + positives[0], positives[0] + '.suffix', positives[0] + '_'];

test('redacts complete GitLab SCIM token values', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('rejects malformed or embedded GitLab SCIM token candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
