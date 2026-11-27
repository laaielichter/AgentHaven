'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab feature flag client token";
const prefix = "glffct-";
const token = prefix + 'Ab3_'.repeat(5) + "";

test('redacts complete GitLab feature flag client token values from shared memory', () => {
  for (const raw of [token, 'before ' + token + ' after']) {
    const result = inspect(raw);
    assert.deepEqual(result.secrets, [kind]);
    assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('avoids partial and embedded GitLab feature flag client token matches', () => {
  for (const raw of [prefix, prefix + 'A'.repeat(19), prefix + 'A'.repeat(21),
    'x' + token, '_' + token, token + 'x', token + '_']) {
    assert.equal(inspect(raw).text, raw);
  }
});
