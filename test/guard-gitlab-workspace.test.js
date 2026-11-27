'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab workspace token";
const prefix = "glwt-";
const token = prefix + 'Ab3_'.repeat(5) + "";

test('redacts complete GitLab workspace token values from shared memory', () => {
  for (const raw of [token, 'before ' + token + ' after']) {
    const result = inspect(raw);
    assert.deepEqual(result.secrets, [kind]);
    assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
    assert.deepEqual(inspect(result.text).secrets, []);
  }
});

test('avoids partial and embedded GitLab workspace token matches', () => {
  for (const raw of [prefix, prefix + 'A'.repeat(19), prefix + 'A'.repeat(129),
    'x' + token, '_' + token]) {
    assert.equal(inspect(raw).text, raw);
  }
});
