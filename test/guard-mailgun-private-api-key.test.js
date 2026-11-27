'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../src/guard');

const kind = "Mailgun private API key";
const tokens = ['key-' + 'a1b2c3d4'.repeat(4), 'key-' + 'A1B2C3D4'.repeat(4)];

test('redacts complete Mailgun private API key credentials', () => {
  for (const token of tokens) {
    for (const raw of [token, 'before ' + token + ' after']) {
      const result = inspect(raw);
      assert.deepEqual(result.secrets, [kind]);
      assert.equal(result.text, raw.replace(token, '[' + kind + ' removed]'));
      assert.deepEqual(inspect(result.text).secrets, []);
    }
  }
});

test('rejects malformed and adjacent Mailgun private API key candidates without partial masking', () => {
  for (const raw of ['key-' + 'A'.repeat(31), 'key-' + 'A'.repeat(33), 'pubkey-' + 'A'.repeat(32), 'x' + tokens[0], tokens[0] + 'x']) {
    assert.equal(inspect(raw).text, raw);
  }
});
