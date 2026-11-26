'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab Kubernetes agent token";
// Generate fake credentials at runtime instead of committing credential-shaped strings.
const positives = ['glagent-' + 'A'.repeat(50)];
const negatives = ['glagent-' + 'A'.repeat(49), 'glagent-' + 'A'.repeat(51), 'x' + positives[0], positives[0] + '.suffix', positives[0] + '_'];

test('redacts complete GitLab Kubernetes agent token values', () => {
  for (const value of positives) {
    const result = inspect('before ' + value + ' after');
    assert.equal(result.text, 'before [' + kind + ' removed] after');
    assert.deepEqual(result.secrets, [kind]);
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('rejects malformed or embedded GitLab Kubernetes agent token candidates', () => {
  for (const value of negatives) {
    const result = inspect(value);
    assert.equal(result.text, value);
    assert.equal(result.secrets.includes(kind), false);
  }
});
