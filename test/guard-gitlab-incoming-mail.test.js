'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab incoming mail token";
const prefix = "glimt-";
const token = prefix + 'Ab3_'.repeat(6) + "A";

test('redacts complete GitLab incoming mail token values from shared memory', () => {
  for (const raw of [token, 'before ' + token + ' after']) {
    const result = inspect(raw);
    assert.deepEqual(result.secrets, [kind]);
    assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('avoids partial and embedded GitLab incoming mail token matches', () => {
  for (const raw of [prefix, prefix + 'A'.repeat(24), prefix + 'A'.repeat(26),
    'x' + token, '_' + token, token + 'x', token + '_']) {
    assert.equal(inspect(raw).text, raw);
  }
});
