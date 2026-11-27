'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = 'GitLab feed token';
const tokens = ['glft-' + 'Ab3_'.repeat(5), 'glft-' + 'aB9-'.repeat(5)];

test('redacts complete GitLab feed credentials in agent memory', () => {
  for (const token of tokens) {
    for (const input of [token, 'feed ' + token + ' next']) {
      const result = inspect(input);
      assert.equal(result.text, input.replace(token, '[' + kind + ' removed]'));
      assert.deepEqual(result.secrets, [kind]);
      assert.deepEqual(inspect(result.text).secrets, []);
    }
  }
});

test('does not partially mask malformed or embedded GitLab feed tokens', () => {
  const value = tokens[0];
  for (const text of ['glft-', 'glft-' + 'A'.repeat(19), 'glft-' + 'A'.repeat(21),
    'x' + value, '_' + value, value + '-', value + 'x']) {
    assert.equal(inspect(text).text, text);
  }
});
