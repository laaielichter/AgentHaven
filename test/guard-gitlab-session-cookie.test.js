'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "GitLab session cookie";
const tokens = ['_' + 'gitlab_session=' + 'Ab3_/'.repeat(12), '_' + 'gitlab_session=' + 'A'.repeat(60) + '=='];

test('redacts complete GitLab session cookie credentials', () => {
  for (const token of tokens) {
    for (const raw of [token, 'before ' + token + ' after']) {
      const result = inspect(raw);
      assert.deepEqual(result.secrets, [kind]);
      assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
      assert.deepEqual(inspect(result.text).secrets, []);
    }
  }
});

test('rejects malformed and adjacent GitLab session cookie candidates without partial masking', () => {
  for (const raw of ['_' + 'gitlab_session=', '_' + 'gitlab_session=' + 'A'.repeat(19), '_' + 'gitlab_session=' + 'A'.repeat(4097), 'x' + tokens[0]]) {
    assert.equal(inspect(raw).text, raw);
  }
});
