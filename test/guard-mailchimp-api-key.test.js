'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "Mailchimp API key";
const tokens = ['a1b2c3d4'.repeat(4) + '-us20', 'A1B2C3D4'.repeat(4) + '-us9'];

test('redacts complete Mailchimp API key credentials', () => {
  for (const token of tokens) {
    for (const raw of [token, 'before ' + token + ' after']) {
      const result = inspect(raw);
      assert.deepEqual(result.secrets, [kind]);
      assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
      assert.deepEqual(inspect(result.text).secrets, []);
    }
  }
});

test('rejects malformed and adjacent Mailchimp API key candidates without partial masking', () => {
  for (const raw of ['a1b2c3d4'.repeat(3) + 'a1b2c3d' + '-us20', 'a1b2c3d4'.repeat(4) + '-us200', 'a1b2c3d4'.repeat(4) + '-eu20', 'x' + tokens[0], tokens[0] + 'x']) {
    assert.equal(inspect(raw).text, raw);
  }
});
